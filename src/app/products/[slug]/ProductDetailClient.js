"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, CheckCircle2, ChevronRight, MessageSquare, PhoneCall, Eye } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductImage from "@/components/ui/ProductImage";
import ProductInquiryForm from "@/components/sections/ProductInquiryForm";

const Cabin360Viewer = dynamic(() => import("@/components/Cabin360Viewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/10] max-sm:aspect-square bg-slate-100 rounded-[24px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-3 border-[#F97316] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading 360° Viewer...</p>
      </div>
    </div>
  ),
});

export default function ProductDetailClient({ product, similarProducts, settings, allActiveProducts }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isLayoutCabin = product.category === "layout-cabin";

  // Safe extraction of query params or fallback defaults
  const [selectedColor, setSelectedColor] = useState(product.defaultColor || "Dark Grey");
  const [selectedFinish, setSelectedFinish] = useState(product.defaultFinish || "Mirror");

  // Sync state from query parameters on mount to avoid hydration mismatch
  useEffect(() => {
    const colorParam = searchParams.get("color");
    const finishParam = searchParams.get("finish");
    let changed = false;
    let initialColor = product.defaultColor || "Dark Grey";
    let initialFinish = product.defaultFinish || "Mirror";

    if (colorParam && colorParam !== initialColor) {
      setSelectedColor(colorParam);
      initialColor = colorParam;
      changed = true;
    }
    if (finishParam && finishParam !== initialFinish) {
      setSelectedFinish(finishParam);
      initialFinish = finishParam;
      changed = true;
    }

    if (changed && isLayoutCabin) {
      const match = product.customizationVariants?.find(
        (v) => v.color === initialColor && v.finish === initialFinish && v.enabled !== false
      );
      const targetImage = (match && match.image) ? match.image : product.featuredImage;
      setActiveImage(targetImage);
    }
  }, [searchParams, product.defaultColor, product.defaultFinish, product.customizationVariants, isLayoutCabin, product.featuredImage]);

  // Track previous state for Apple-style crossfade preview
  const [prevColor, setPrevColor] = useState(null);
  const [prevFinish, setPrevFinish] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [isCrossfading, setIsCrossfading] = useState(false);

  // Sync to URL state in real-time
  useEffect(() => {
    if (isLayoutCabin) {
      const params = new URLSearchParams(window.location.search);
      params.set("color", selectedColor);
      params.set("finish", selectedFinish);
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    }
  }, [selectedColor, selectedFinish, isLayoutCabin, pathname]);

  // Gallery active image state
  const galleryList = [product.featuredImage, ...(product.galleryImages || product.images || [])].filter(Boolean);
  const [activeImage, setActiveImage] = useState(galleryList[0] || product.featuredImage);

  // Effect to handle selection changes and trigger the crossfade transition
  useEffect(() => {
    if (isLayoutCabin) {
      const match = product.customizationVariants?.find(
        (v) => v.color === selectedColor && v.finish === selectedFinish && v.enabled !== false
      );
      const targetImage = (match && match.image) ? match.image : product.featuredImage;

      if (targetImage !== activeImage) {
        setPrevImage(activeImage);
        setPrevColor(selectedColor);
        setPrevFinish(selectedFinish);
        
        setActiveImage(targetImage);
        setIsCrossfading(true);
        
        const timer = setTimeout(() => {
          setIsCrossfading(false);
          setPrevImage(null);
        }, 400); // 400ms crossfade
        return () => clearTimeout(timer);
      }
    }
  }, [selectedColor, selectedFinish, isLayoutCabin, product.customizationVariants, activeImage]);

  // Helper functions for dynamic styling
  const getDynamicColorOverlay = (color) => {
    if (color === "Gold") {
      return "radial-gradient(circle at center, rgba(212, 175, 55, 0.18) 0%, rgba(212, 175, 55, 0.35) 100%)";
    }
    if (color === "Rose Gold") {
      return "radial-gradient(circle at center, rgba(183, 110, 121, 0.22) 0%, rgba(183, 110, 121, 0.42) 100%)";
    }
    if (color === "Dark Grey") {
      return "radial-gradient(circle at center, rgba(75, 85, 99, 0.1) 0%, rgba(75, 85, 99, 0.25) 100%)";
    }
    return "transparent";
  };

  const getDynamicFilter = (color) => {
    if (color === "Gold") {
      return "sepia(0.35) saturate(1.9) hue-rotate(5deg) brightness(0.92) contrast(1.05)";
    }
    if (color === "Rose Gold") {
      return "sepia(0.25) saturate(1.7) hue-rotate(320deg) brightness(0.88) contrast(1.1)";
    }
    if (color === "Dark Grey") {
      return "brightness(0.9) contrast(1.05) grayscale(0.1)";
    }
    return "none";
  };
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [viewMode, setViewMode] = useState("photos"); // "photos" or "360"

  // Track product view in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("shivshakti-recent-products");
      let list = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(list)) list = [];

      // Remove current product and prepend it to the top
      list = list.filter((item) => item._id !== product._id);
      list.unshift({
        _id: product._id,
        title: product.title,
        slug: product.slug,
        featuredImage: product.featuredImage,
      });

      // Maintain a maximum of 6 elements
      list = list.slice(0, 6);
      localStorage.setItem("shivshakti-recent-products", JSON.stringify(list));

      // Display recently viewed items excluding the current one
      setRecentlyViewed(list.filter((item) => item._id !== product._id));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }, [product]);

  // Zoom magnifier states
  const [zoomStyle, setZoomStyle] = useState({});
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.8)",
    });
  };
  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  const handleScrollToForm = (e) => {
    e.preventDefault();
    document.getElementById("inquiry-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const specsMap = product.specifications?.size 
    ? Object.fromEntries(product.specifications) 
    : (product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs || {});

  const categoryLabels = {
    "in-house": "In-House Production",
    trading: "Trading Component",
    authorized: "Authorized Dealer",
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-brand-orange selection:text-white">
      {/* Navigation Header */}
      <Header logoUrl={settings.logoUrl} />
      
      {/* Back link wrapper with top padding to clear fixed header */}
      <div className=" px-6 pb-6 pt-24 lg:px-16 lg:pt-28 border-b border-slate-100">
        <div className="max-w-[1300px] mx-auto flex flex-col gap-6">
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition duration-300 text-[0.9rem] font-medium group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-slate-400 group-hover:text-slate-800" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="px-4 lg:px-6 py-12 bg-white">
        <div className="bg-bg-light text-text-light-primary rounded-[48px] overflow-hidden max-w-[1300px] mx-auto shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100">
          
          {/* Section 1: Breadcrumb */}
          <div className="px-8 lg:px-16 pt-10 pb-2 border-b border-slate-100/30">
            <nav className="text-xs lg:text-sm font-semibold tracking-wide text-text-light-secondary flex flex-wrap items-center gap-2">
              <Link href="/" className="hover:text-brand-orange transition duration-200">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-text-light-secondary/40" />
              <Link href="/products" className="hover:text-brand-orange transition duration-200">
                Products
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-text-light-secondary/40" />
              <span className="text-brand-blue truncate max-w-[15rem]">{product.title}</span>
            </nav>
          </div>

          {/* Section 2: Product Hero Section */}
          <div className="p-8 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start border-b border-border-light">
            
            {/* Left: Image & Media Gallery Preview */}
            <div className="flex flex-col gap-5 w-full">

              {/* Tab toggle — only if has360View */}
              {product.has360View && (
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => setViewMode("photos")}
                    suppressHydrationWarning
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      viewMode === "photos"
                        ? "bg-[#F97316] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Photos
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("360")}
                    suppressHydrationWarning
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      viewMode === "360"
                        ? "bg-[#F97316] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    360° View
                  </button>
                </div>
              )}

              {/* Photos View */}
              {viewMode === "photos" && (
                <>
                  {/* Zoom Magnifier Box */}
                  <div 
                    className="relative aspect-[4/3] rounded-[24px] overflow-hidden border border-border-light bg-slate-50 flex items-center justify-center shadow-sm cursor-zoom-in"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div 
                      className="w-full h-full transition-transform duration-200 ease-out relative"
                      style={zoomStyle}
                    >
                      {/* Apple-style Configurator Crossfade Transition - Fade out previous layer */}
                      {isLayoutCabin && prevImage && (
                        <div className="absolute inset-0 z-10 animate-fade-out pointer-events-none">
                          <ProductImage
                            src={prevImage}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            style={{
                              filter: !product.customizationVariants?.some(v => v.color === prevColor && v.finish === prevFinish && v.image && v.image !== product.featuredImage && v.enabled !== false)
                                ? getDynamicFilter(prevColor)
                                : "none"
                            }}
                          />
                          {/* Color overlay */}
                          {!product.customizationVariants?.some(v => v.color === prevColor && v.finish === prevFinish && v.image && v.image !== product.featuredImage && v.enabled !== false) && (
                            <div
                              className="absolute inset-0 mix-blend-color pointer-events-none"
                              style={{ background: getDynamicColorOverlay(prevColor) }}
                            />
                          )}
                          {/* Finish: Mirror shine */}
                          {prevFinish === "Mirror" && (
                            <div className="absolute inset-0 pointer-events-none mirror-shine-effect" />
                          )}
                          {/* Finish: Hairline grain */}
                          {prevFinish === "Hairline" && (
                            <div
                              className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                              style={{
                                backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)"
                              }}
                            />
                          )}
                        </div>
                      )}

                      {/* Active Preview Layer */}
                      <ProductImage
                        src={activeImage}
                        alt={product.title}
                        className={`w-full h-full object-cover ${isLayoutCabin && isCrossfading ? 'animate-fade-in' : ''}`}
                        style={{
                          filter: isLayoutCabin && !product.customizationVariants?.some(v => v.color === selectedColor && v.finish === selectedFinish && v.image && v.image !== product.featuredImage && v.enabled !== false)
                            ? getDynamicFilter(selectedColor)
                            : "none"
                        }}
                      />

                      {/* Color overlay for active */}
                      {isLayoutCabin && !product.customizationVariants?.some(v => v.color === selectedColor && v.finish === selectedFinish && v.image && v.image !== product.featuredImage && v.enabled !== false) && (
                        <div
                          className="absolute inset-0 mix-blend-color pointer-events-none transition-all duration-300"
                          style={{ background: getDynamicColorOverlay(selectedColor) }}
                        />
                      )}

                      {/* Finish: Mirror shine for active */}
                      {isLayoutCabin && selectedFinish === "Mirror" && (
                        <div className="absolute inset-0 pointer-events-none mirror-shine-effect" />
                      )}

                      {/* Finish: Hairline grain for active */}
                      {isLayoutCabin && selectedFinish === "Hairline" && (
                        <div
                          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                          style={{
                            backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)"
                          }}
                        />
                      )}
                    </div>
                    
                    {product.badge && (
                      <span
                        className={`absolute top-5 right-5 text-white px-4 py-2 rounded-xl text-[0.8rem] font-bold shadow-md z-10 ${
                          product.badgeColor === "brand-orange" ? "bg-brand-orange/90" : "bg-brand-blue/90"
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Quick access 360 button */}
                  {product.has360View && (
                    <button
                      type="button"
                      onClick={() => setViewMode("360")}
                      suppressHydrationWarning
                      className="self-start flex items-center gap-2 bg-[rgba(249,115,22,0.10)] text-[#F97316] border border-[rgba(249,115,22,0.2)] px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:bg-[rgba(249,115,22,0.18)] hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View in 360° →
                    </button>
                  )}

                  {/* Secondary Images List */}
                  {galleryList.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {galleryList.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(img)}
                          suppressHydrationWarning
                          className={`aspect-square rounded-xl overflow-hidden border bg-slate-50 flex items-center justify-center cursor-pointer transition duration-300 ${
                            activeImage === img 
                              ? "border-brand-orange ring-2 ring-brand-orange/30 shadow-sm" 
                              : "border-border-light hover:border-brand-blue/40"
                          }`}
                        >
                          <img src={img} alt={`${product.title} gallery thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* 360° View */}
              {viewMode === "360" && product.has360View && product.view360 && (() => {
                // For layout cabins, resolve variant-specific 360° images
                let resolved360 = product.view360;
                let view360Key = "default";

                if (isLayoutCabin && product.view360Variants?.length > 0) {
                  const variantMatch = product.view360Variants.find(
                    (v) =>
                      v.color === selectedColor &&
                      v.finish === selectedFinish &&
                      v.enabled !== false &&
                      v.view360?.front &&
                      v.view360?.back &&
                      v.view360?.left &&
                      v.view360?.right &&
                      v.view360?.ceiling &&
                      v.view360?.floor
                  );
                  if (variantMatch) {
                    resolved360 = variantMatch.view360;
                    view360Key = `${selectedColor}-${selectedFinish}`;
                  }
                }

                return (
                  <Cabin360Viewer
                    key={view360Key}
                    view360={resolved360}
                    productName={product.title}
                  />
                );
              })()}
            </div>

            {/* Right: Text Information Details */}
            <div className="flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-2">
                <span className="text-brand-blue text-[0.82rem] font-bold uppercase tracking-[0.2em] block">
                  {categoryLabels[product.category] || product.category}
                </span>
                <h1 className="text-4xl lg:text-[2.6rem] font-extrabold text-text-light-primary tracking-tight leading-tight">
                  {product.title}
                </h1>
              </div>

              {/* Short Description */}
              <p className="text-[0.98rem] text-text-light-secondary leading-[1.6]">
                {product.shortDescription}
              </p>

              {/* Apple-style Customization Stylesheet */}
              {isLayoutCabin && (
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                  @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                  }
                  @keyframes mirrorShine {
                    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                  }
                  .animate-fade-in {
                    animation: fadeIn 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                  }
                  .animate-fade-out {
                    animation: fadeOut 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                  }
                  .mirror-shine-effect {
                    position: relative;
                    overflow: hidden;
                  }
                  .mirror-shine-effect::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                      45deg,
                      rgba(255, 255, 255, 0) 35%,
                      rgba(255, 255, 255, 0.25) 50%,
                      rgba(255, 255, 255, 0) 65%
                    );
                    transform: rotate(45deg);
                    animation: mirrorShine 3s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 5;
                  }
                `}} />
              )}

              {/* Real-time Customization Panel for Layout Cabins */}
              {isLayoutCabin && (
                <div className="bg-slate-50 border border-slate-200/60 rounded-[2rem] p-6 lg:p-8 flex flex-col gap-6 shadow-sm my-4 text-left">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-brand-orange rounded-full" />
                      Personalize Cabin Aesthetics
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Configure colors and finishes to preview in real-time before requesting a quote.
                    </p>
                  </div>

                  {/* Color Selection */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      1. Select Color: <span className="text-slate-800 font-extrabold capitalize">{selectedColor}</span>
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {product.availableColors?.filter(c => c.enabled).map((color) => {
                        const isSelected = selectedColor === color.name;
                        return (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            suppressHydrationWarning
                            className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full border text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                              isSelected
                                ? "border-slate-900 bg-slate-900 text-white shadow-md scale-105"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner shrink-0"
                              style={{ backgroundColor: color.code }}
                            />
                            {color.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Finish Selection */}
                  <div className="flex flex-col gap-3 border-t border-slate-200/60 pt-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      2. Select Finish: <span className="text-slate-800 font-extrabold capitalize">{selectedFinish} Finish</span>
                    </span>
                    <div className="flex gap-3">
                      {product.availableFinishes?.filter(f => f.enabled).map((finish) => {
                        const isSelected = selectedFinish === finish.name;
                        return (
                          <button
                            key={finish.name}
                            onClick={() => setSelectedFinish(finish.name)}
                            suppressHydrationWarning
                            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                              isSelected
                                ? "border-brand-orange bg-brand-orange-pale/10 text-brand-orange ring-1 ring-brand-orange/20 shadow-sm"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            <span className="text-xs font-bold capitalize">{finish.name}</span>
                            <span className="text-[9px] text-slate-400 mt-0.5 block">
                              {finish.name === "Mirror" ? "High reflectivity gloss finish" : "Elegant brushed texture finish"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Highlights Bullet List */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-border-light pt-4 my-2">
                  <h4 className="text-xs font-bold text-text-light-primary uppercase tracking-wider">Key Highlights</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm text-text-light-secondary">
                        <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Specs preview list */}
              {Object.keys(specsMap).length > 0 && (
                <div className="bg-bg-light border border-border-light rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-[0.72rem] font-bold text-text-light-secondary uppercase tracking-wider">Quick Specifications</span>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-text-light-primary">
                    {Object.entries(specsMap).slice(0, 4).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-dashed border-border-light last:border-none">
                        <span className="text-text-light-secondary capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className="font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Downloads */}
              {(product.brochureUrl || product.techSpecsUrl || product.installGuideUrl) && (
                <div className="flex flex-col gap-3 border-t border-border-light pt-5 my-1">
                  <span className="text-[0.72rem] font-bold text-text-light-secondary uppercase tracking-wider">Document Downloads</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {product.brochureUrl && (
                      <a
                        href={product.brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-brand-orange hover:bg-brand-orange-pale/10 hover:text-brand-orange transition duration-300 text-xs font-bold px-4 py-3 rounded-xl justify-center text-slate-600 cursor-pointer"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Brochure PDF
                      </a>
                    )}
                    {product.techSpecsUrl && (
                      <a
                        href={product.techSpecsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-brand-orange hover:bg-brand-orange-pale/10 hover:text-brand-orange transition duration-300 text-xs font-bold px-4 py-3 rounded-xl justify-center text-slate-600 cursor-pointer"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Technical Specs
                      </a>
                    )}
                    {product.installGuideUrl && (
                      <a
                        href={product.installGuideUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-brand-orange hover:bg-brand-orange-pale/10 hover:text-brand-orange transition duration-300 text-xs font-bold px-4 py-3 rounded-xl justify-center text-slate-600 cursor-pointer"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Install Guide
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Inquiry CTA */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={handleScrollToForm}
                  suppressHydrationWarning
                  className="flex-1 bg-brand-orange text-white py-4 px-6 rounded-full text-[0.9rem] font-bold text-center transition-all duration-300 hover:bg-brand-orange-light hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" /> Inquire & Request Price
                </button>
                {settings.whatsapp && (
                  <a
                    href={`https://api.whatsapp.com/send/?phone=${settings.whatsapp.replace(/[^0-9]/g, "")}&text=Hello%2C%20I%20am%20interested%20in%20inquiring%20about%20${encodeURIComponent(product.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-border-light bg-bg-light text-text-light-primary py-4 px-6 rounded-full text-[0.9rem] font-bold text-center transition-all duration-300 hover:bg-green-500 hover:text-white hover:border-green-500 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4 shrink-0" /> WhatsApp Support
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Detailed Description */}
          {(product.fullDescription || product.description) && (
            <div className="p-8 lg:p-16 border-b border-border-light">
              <h3 className="text-[1.5rem] font-bold text-text-light-primary mb-6">Detailed Description</h3>
              <div 
                className="prose max-w-none text-text-light-secondary leading-relaxed text-[0.96rem] space-y-4 prose-headings:font-bold prose-headings:text-text-light-primary prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5 prose-table:w-full prose-table:border-collapse prose-table:text-sm prose-td:border prose-td:border-border-light prose-td:p-2.5 prose-th:border prose-th:border-border-light prose-th:p-2.5 prose-th:bg-slate-50"
                dangerouslySetInnerHTML={{ __html: product.fullDescription || product.description }}
              />
            </div>
          )}

          {/* Section 4: Technical Specifications */}
          {Object.keys(specsMap).length > 0 && (
            <div className="p-8 lg:p-16 border-b border-border-light flex flex-col gap-6">
              <h3 className="text-[1.5rem] font-bold text-text-light-primary">Technical Specifications</h3>
              <div className="border border-border-light rounded-2xl overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-sm">
                  <tbody>
                    {Object.entries(specsMap).map(([key, val], index) => (
                      <tr
                        key={key}
                        className={`border-b border-border-light last:border-none ${
                          index % 2 === 0 ? "bg-slate-50/50" : "bg-white"
                        }`}
                      >
                        <td className="py-4.5 px-6 font-semibold text-text-light-secondary capitalize w-[40%]">
                          {key.replace(/([A-Z])/g, " $1")}
                        </td>
                        <td className="py-4.5 px-6 font-bold text-text-light-primary">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 5: Why Choose Shivshakti */}
          <div className="p-8 lg:p-16 border-b border-border-light bg-slate-50/30 flex flex-col gap-8">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-brand-blue text-[0.72rem] font-bold uppercase tracking-[0.2em] block mb-1">Our Standard</span>
              <h3 className="text-[1.5rem] font-bold text-text-light-primary">Why Choose Shivshakti Elevator</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-white border border-border-light rounded-[1.25rem] p-6 flex flex-col gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.015)]">
                <div className="text-brand-orange text-2xl font-bold font-mono">40,000+</div>
                <h4 className="font-bold text-text-light-primary text-sm">Sq Ft Factory</h4>
                <p className="text-xs text-text-light-secondary leading-[1.5]">Advanced heavy industrial elevator manufacturing plant in Surat.</p>
              </div>
              <div className="bg-white border border-border-light rounded-[1.25rem] p-6 flex flex-col gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.015)]">
                <div className="text-brand-orange text-2xl font-bold font-mono">In-House</div>
                <h4 className="font-bold text-text-light-primary text-sm">Manufacturing</h4>
                <p className="text-xs text-text-light-secondary leading-[1.5]">Custom specifications control and direct sheet-metal fabrications.</p>
              </div>
              <div className="bg-white border border-border-light rounded-[1.25rem] p-6 flex flex-col gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.015)]">
                <div className="text-brand-orange text-2xl font-bold font-mono">Pan India</div>
                <h4 className="font-bold text-text-light-primary text-sm">Delivery</h4>
                <p className="text-xs text-text-light-secondary leading-[1.5]">Logistics dispatch setup supporting networks in Gujarat, MP, and UP.</p>
              </div>
              <div className="bg-white border border-border-light rounded-[1.25rem] p-6 flex flex-col gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.015)]">
                <div className="text-brand-orange text-2xl font-bold font-mono">Honesty</div>
                <h4 className="font-bold text-text-light-primary text-sm">Our Guarantee</h4>
                <p className="text-xs text-text-light-secondary leading-[1.5]">Transparent commercial dealings and reliable steel certifications.</p>
              </div>
            </div>
          </div>

          {/* Section 6: Product Inquiry Form */}
          <div id="inquiry-form-section" className="p-8 lg:p-16 border-b border-border-light scroll-mt-6 max-w-3xl mx-auto w-full">
            <ProductInquiryForm 
              productId={product._id.toString()} 
              productTitle={product.title} 
              productSlug={product.slug} 
              customizationColor={isLayoutCabin ? selectedColor : undefined}
              customizationFinish={isLayoutCabin ? selectedFinish : undefined}
            />
          </div>

          {/* Section 7: Related Products */}
          {similarProducts.length > 0 && (
            <div className="p-8 lg:p-16 flex flex-col gap-10 bg-slate-50/20">
              <div>
                <span className="text-brand-blue text-[0.82rem] font-bold uppercase tracking-[0.2em] block mb-1">Recommendations</span>
                <h2 className="text-3xl font-extrabold text-text-light-primary">Similar Products</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {similarProducts.map((p) => {
                  return (
                    <Link
                      key={p._id}
                      href={`/products/${p.slug}`}
                      className="bg-card-bg border border-border-light rounded-[1.25rem] overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:-translate-y-1.5 hover:shadow-md hover:border-brand-blue/25 group text-text-light-primary"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-50 flex items-center justify-center">
                        <ProductImage
                          src={p.featuredImage}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {p.badge && (
                          <span
                            className={`absolute top-4 right-4 text-white px-2.5 py-1 rounded-lg text-[0.72rem] font-bold shadow-sm z-10 ${
                              p.badgeColor === "brand-orange" ? "bg-brand-orange/85" : "bg-brand-blue/85"
                            }`}
                          >
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-5 text-center border-t border-border-light">
                        <h4 className="font-bold text-text-light-primary group-hover:text-brand-blue transition-colors duration-300 text-[1.1rem] truncate">
                          {p.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 8: Recently Viewed Products */}
          {recentlyViewed.length > 0 && (
            <div className="p-8 lg:p-16 flex flex-col gap-10 bg-slate-50/10 border-t border-border-light">
              <div>
                <span className="text-brand-orange text-[0.82rem] font-bold uppercase tracking-[0.2em] block mb-1">Browse History</span>
                <h2 className="text-3xl font-extrabold text-text-light-primary">Recently Viewed Components</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                {recentlyViewed.slice(0, 5).map((p) => {
                  return (
                    <Link
                      key={p._id}
                      href={`/products/${p.slug}`}
                      className="bg-card-bg border border-border-light rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-brand-orange/25 group text-text-light-primary"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-50 flex items-center justify-center">
                        <ProductImage
                          src={p.featuredImage}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3.5 text-center border-t border-border-light">
                        <h4 className="font-bold text-text-light-primary group-hover:text-brand-orange transition-colors duration-300 text-xs truncate">
                          {p.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer component */}
      <Footer products={allActiveProducts} settings={settings} />
    </div>
  );
}
