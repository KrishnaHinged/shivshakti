"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Maximize2, Minimize2, Loader2 } from "lucide-react";

export default function Cabin360Viewer({ view360, productName }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameRef = useRef(null);
  const autoRotateTimerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (autoRotateTimerRef.current) {
      clearTimeout(autoRotateTimerRef.current);
      autoRotateTimerRef.current = null;
    }
    if (controlsRef.current) {
      controlsRef.current.dispose();
      controlsRef.current = null;
    }
    if (sceneRef.current) {
      sceneRef.current.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => {
              mat.map?.dispose();
              mat.dispose();
            });
          } else if (obj.material) {
            obj.material.map?.dispose();
            obj.material.dispose();
          }
        }
      });
      sceneRef.current = null;
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current.domElement?.remove();
      rendererRef.current = null;
    }
    cameraRef.current = null;
  }, []);

  useEffect(() => {
    if (!containerRef.current || !view360) return;

    let cancelled = false;

    const init = async () => {
      // Dynamically import Three.js to keep the module out of SSR
      const THREE = await import("three");
      const { OrbitControls } = await import(
        "three/addons/controls/OrbitControls.js"
      );

      if (cancelled || !containerRef.current) return;

      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera — placed at center of the box
      const camera = new THREE.PerspectiveCamera(85, width / height, 0.01, 100);
      camera.position.set(0, 0, 0.01);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Box Geometry — proportioned to match image ratios
      const boxWidth = 3;
      const boxDepth = 3;
      const boxHeight = 5; // matches 3:5 wall ratio

      const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

      // Loading Manager to track all 6 textures
      const loadingManager = new THREE.LoadingManager();
      let loadedCount = 0;

      loadingManager.onProgress = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / 6) * 100));
      };

      loadingManager.onLoad = () => {
        setLoading(false);
      };

      loadingManager.onError = (url) => {
        console.error("Failed to load texture:", url);
      };

      const loader = new THREE.TextureLoader(loadingManager);

      // Fix color space for each texture
      const loadTex = (url) => {
        const tex = loader.load(url);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      };

      // BoxGeometry material order: [+X right, -X left, +Y top, -Y bottom, +Z back, -Z front]
      const materials = [
        new THREE.MeshBasicMaterial({
          map: loadTex(view360.right),
          side: THREE.BackSide,
        }),
        new THREE.MeshBasicMaterial({
          map: loadTex(view360.left),
          side: THREE.BackSide,
        }),
        new THREE.MeshBasicMaterial({
          map: loadTex(view360.ceiling),
          side: THREE.BackSide,
        }),
        new THREE.MeshBasicMaterial({
          map: loadTex(view360.floor),
          side: THREE.BackSide,
        }),
        new THREE.MeshBasicMaterial({
          map: loadTex(view360.back),
          side: THREE.BackSide,
        }),
        new THREE.MeshBasicMaterial({
          map: loadTex(view360.front),
          side: THREE.BackSide,
        }),
      ];

      const box = new THREE.Mesh(geometry, materials);
      scene.add(box);

      // Controls — interior looking around
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false; // We handle zoom via FOV
      controls.enablePan = false;
      controls.rotateSpeed = -0.4;
      controls.minDistance = 0.01;
      controls.maxDistance = 0.01;
      controls.target.set(0, 0, 0); // Keep camera at center, look at front wall by default
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.update();
      controlsRef.current = controls;

      // Pause auto-rotation on drag, resume after 3 seconds
      controls.addEventListener("start", () => {
        controls.autoRotate = false;
        if (autoRotateTimerRef.current) {
          clearTimeout(autoRotateTimerRef.current);
        }
      });

      controls.addEventListener("end", () => {
        autoRotateTimerRef.current = setTimeout(() => {
          if (controlsRef.current) {
            controlsRef.current.autoRotate = true;
          }
        }, 3000);
      });

      // FOV zoom via scroll wheel
      const handleWheel = (e) => {
        e.preventDefault();
        if (!cameraRef.current) return;
        cameraRef.current.fov = THREE.MathUtils.clamp(
          cameraRef.current.fov + e.deltaY * 0.05,
          55,
          100
        );
        cameraRef.current.updateProjectionMatrix();
      };
      renderer.domElement.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      // Touch pinch zoom
      let prevPinchDist = 0;
      const handleTouchMove = (e) => {
        if (e.touches.length === 2 && cameraRef.current) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (prevPinchDist > 0) {
            const delta = prevPinchDist - dist;
            cameraRef.current.fov = THREE.MathUtils.clamp(
              cameraRef.current.fov + delta * 0.1,
              55,
              100
            );
            cameraRef.current.updateProjectionMatrix();
          }
          prevPinchDist = dist;
        }
      };
      const handleTouchEnd = () => {
        prevPinchDist = 0;
      };

      renderer.domElement.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      renderer.domElement.addEventListener("touchend", handleTouchEnd);

      // Resize handler
      const handleResize = () => {
        if (
          !containerRef.current ||
          !rendererRef.current ||
          !cameraRef.current
        )
          return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        rendererRef.current.setSize(w, h);
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
      };
      window.addEventListener("resize", handleResize);

      // Animation loop
      const animate = () => {
        animFrameRef.current = requestAnimationFrame(animate);
        if (controlsRef.current) controlsRef.current.update();
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      animate();

      // Store cleanup references
      renderer.domElement._wheelHandler = handleWheel;
      renderer.domElement._resizeHandler = handleResize;
      renderer.domElement._touchMoveHandler = handleTouchMove;
      renderer.domElement._touchEndHandler = handleTouchEnd;
    };

    init();

    return () => {
      cancelled = true;
      // Remove event listeners
      if (rendererRef.current?.domElement) {
        const el = rendererRef.current.domElement;
        if (el._wheelHandler)
          el.removeEventListener("wheel", el._wheelHandler);
        if (el._touchMoveHandler)
          el.removeEventListener("touchmove", el._touchMoveHandler);
        if (el._touchEndHandler)
          el.removeEventListener("touchend", el._touchEndHandler);
        if (el._resizeHandler)
          window.removeEventListener("resize", el._resizeHandler);
      }
      cleanup();
    };
  }, [view360, cleanup]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Trigger three.js resize on fullscreen changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 150);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-900 select-none ${
        isFullscreen
          ? "w-full h-full aspect-auto rounded-none"
          : "w-full aspect-[16/10] max-sm:aspect-square rounded-2xl"
      }`}
      style={{ touchAction: "none" }}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 bg-slate-900 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-[#F97316] animate-spin" />
          <p className="text-white text-sm font-semibold">
            Loading 360° View...
          </p>
          <div className="w-40 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F97316] rounded-full transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="text-slate-500 text-xs">{loadProgress}%</p>
        </div>
      )}

      {/* UI Overlay — only visible when loaded */}
      {!loading && (
        <>
          {/* Top-left: Title */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <p className="text-white/90 text-[0.68rem] font-bold uppercase tracking-[0.15em] bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              360° Interior View
            </p>
            {productName && (
              <p className="text-white/60 text-[0.62rem] font-medium mt-1 ml-0.5">
                Viewing: {productName}
              </p>
            )}
          </div>

          {/* Top-right: Fullscreen toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-sm text-white/80 hover:text-white p-2 rounded-lg cursor-pointer transition"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Bottom-center: Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <p className="text-white/50 text-[0.62rem] font-semibold uppercase tracking-wider bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full whitespace-nowrap">
              Drag to look around &nbsp;|&nbsp; Scroll to zoom
            </p>
          </div>
        </>
      )}
    </div>
  );
}
