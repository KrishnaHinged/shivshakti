import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BREAKPOINTS, MARGINS, CABIN_SIZES } from "../constants/dimensions";

/**
 * Hook to manage coordinates, page path tags, and custom cinematic transition events.
 * 
 * @param {boolean} isAdmin
 * @param {Object} scrollYRef
 * @param {Object} skipEasingRef
 */
export default function useTransition(isAdmin, scrollYRef, skipEasingRef) {
  const router = useRouter();
  const pathname = usePathname();
  const isAbout = pathname === "/about";

  // Coordinates and dimensions
  const [coords, setCoords] = useState({ startX: 0, startY: 0, endY: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Transition machine state
  const [transitionState, setTransitionState] = useState("idle"); // 'idle' | 'focusing' | 'opening' | 'expanding'
  const [startRect, setStartRect] = useState(null);
  const [targetUrl, setTargetUrl] = useState("/products");

  const taggedElementRef = useRef(null);
  const rafIdRef = useRef(null);

  // Layout positions calculator
  const calculateCoordinates = () => {
    const heroEl = document.getElementById("home") || 
                   document.querySelector("main section") || 
                   document.querySelector("section");
    const footerEl = document.getElementById("footer");

    if (!footerEl) return;

    const currentScrollY = window.scrollY;
    const currentScrollX = window.scrollX;

    const refRect = heroEl ? heroEl.getBoundingClientRect() : document.body.getBoundingClientRect();
    const footerRect = footerEl.getBoundingClientRect();

    const startY = heroEl ? (refRect.bottom + currentScrollY) : 150;
    const footerTopDoc = footerRect.top + currentScrollY;

    // Aligned to right container margins
    const w = window.innerWidth;
    let margin = MARGINS.DESKTOP;
    if (w < BREAKPOINTS.MOBILE) {
      margin = MARGINS.MOBILE;
    } else if (w < BREAKPOINTS.TABLET) {
      margin = MARGINS.TABLET;
    }
    const startX = w + currentScrollX - margin;

    // Responsive cabin sizing and overlap logic
    const isMob = w < BREAKPOINTS.MOBILE;
    const isTab = w >= BREAKPOINTS.MOBILE && w < BREAKPOINTS.TABLET;
    
    const sizes = isMob 
      ? CABIN_SIZES.MOBILE 
      : isTab 
        ? CABIN_SIZES.TABLET 
        : CABIN_SIZES.DESKTOP;

    setCoords({
      startX,
      startY: startY - 5,
      endY: footerTopDoc - sizes.HEIGHT + sizes.OVERLAP,
    });
  };

  // Sync size classes and resize listeners
  useEffect(() => {
    if (isAdmin) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    calculateCoordinates();

    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE);
      setIsTablet(window.innerWidth >= BREAKPOINTS.MOBILE && window.innerWidth < BREAKPOINTS.TABLET);
      calculateCoordinates();
    };

    window.addEventListener("load", calculateCoordinates);
    window.addEventListener("resize", handleResize);
    
    // Initial size check
    setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE);
    setIsTablet(window.innerWidth >= BREAKPOINTS.MOBILE && window.innerWidth < BREAKPOINTS.TABLET);

    // Track dynamic height mutations (e.g. tabs or loading states)
    let resizeObserver;
    if (typeof window !== "undefined" && window.ResizeObserver && document.body) {
      resizeObserver = new window.ResizeObserver(() => {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(calculateCoordinates);
      });
      resizeObserver.observe(document.body);
    }

    // Safety layout calculations
    const timer = setTimeout(calculateCoordinates, 1500);

    return () => {
      window.removeEventListener("load", calculateCoordinates);
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      cancelAnimationFrame(rafIdRef.current);
      clearTimeout(timer);
    };
  }, [isAdmin]);

  // Sync scroll positioning
  useEffect(() => {
    if (isAdmin) return;
    
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    scrollYRef.current = window.scrollY;
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdmin, scrollYRef]);

  // Path change listeners & auto-tagging
  useEffect(() => {
    if (isAdmin) return;

    // Reset transition states
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransitionState("idle");
    setStartRect(null);

    // Temporarily skip easing on route transition to avoid bounce jumps
    skipEasingRef.current = true;
    const snapTimer = setTimeout(() => {
      skipEasingRef.current = false;
    }, 1200);

    scrollYRef.current = 0;

    const isHomePage = pathname === "/";
    if (!isHomePage) {
      const existingHome = document.getElementById("home");
      if (existingHome) {
        existingHome.removeAttribute("id");
      }

      const mainEl = document.querySelector("main");
      if (mainEl) {
        const firstSection = mainEl.querySelector("section");
        if (firstSection) {
          const innerCard = firstSection.firstElementChild;
          if (innerCard) {
            innerCard.setAttribute("id", "home");
            taggedElementRef.current = innerCard;
          }
        }
      }
    }

    calculateCoordinates();
    
    const t1 = setTimeout(calculateCoordinates, 100);
    const t2 = setTimeout(calculateCoordinates, 450);
    const t3 = setTimeout(calculateCoordinates, 1000);
    
    return () => {
      clearTimeout(snapTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (taggedElementRef.current) {
        taggedElementRef.current.removeAttribute("id");
        taggedElementRef.current = null;
      }
    };
  }, [pathname, isAdmin, scrollYRef, skipEasingRef]);

  // Catch custom cinematic transit event triggers
  useEffect(() => {
    if (isAdmin) return;

    const handleTransitionEvent = (e) => {
      const url = e.detail?.targetUrl || "/products";
      const liftEl = document.getElementById("rope-elevator-lift");
      
      if (!liftEl) {
        sessionStorage.setItem("elevator-transition-active", "true");
        router.push(url);
        return;
      }

      const rect = liftEl.getBoundingClientRect();
      setStartRect(rect);
      setTargetUrl(url);
      setTransitionState("focusing");
    };

    window.addEventListener("trigger-elevator-transition", handleTransitionEvent);
    return () => {
      window.removeEventListener("trigger-elevator-transition", handleTransitionEvent);
    };
  }, [router, isAdmin]);

  // Handle transition phases timeline
  useEffect(() => {
    if (isAdmin) return;

    if (transitionState === "focusing") {
      const timer = setTimeout(() => setTransitionState("opening"), 150);
      return () => clearTimeout(timer);
    } else if (transitionState === "opening") {
      const timer = setTimeout(() => setTransitionState("expanding"), 600);
      return () => clearTimeout(timer);
    } else if (transitionState === "expanding") {
      const timer = setTimeout(() => {
        sessionStorage.setItem("elevator-transition-active", "true");
        router.push(targetUrl);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [transitionState, targetUrl, router, isAdmin]);

  // Block scrollwheel interactions while expanding
  useEffect(() => {
    if (isAdmin || transitionState === "idle") return;

    const preventDefault = (e) => e.preventDefault();
    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      document.body.style.overflow = "";
    };
  }, [transitionState, isAdmin]);

  return {
    coords,
    isMobile,
    isTablet,
    transitionState,
    startRect,
    targetUrl,
    isAbout,
  };
}
