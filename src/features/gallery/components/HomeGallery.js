"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

export const HomeGallery = ({ gallery, hideHeader = false }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const categoryTabRefs = useRef({});

  // Unified items list containing either dynamic DB project data or static fallback data
  const items = useMemo(() => {
    if (gallery && gallery.length > 0) {
      return gallery.map((item) => ({
        src: item.image,
        title: item.title,
        category: item.category || "cabin",
        location: item.category ? item.category.replace("_", " ") : "Surat Portfolio",
      }));
    }
    return [
      { src: "/images/project-panoramic.png", title: "Panoramic Glass Cabin", category: "cabin", location: "Luxury Penthouse, Mumbai" },
      { src: "/images/project-villa.png", title: "Bespoke Wooden Interior", category: "cabin", location: "Private Villa, Indore" },
      { src: "/images/project-hotel.png", title: "Automatic Metal Finish Doors", category: "door", location: "Grand Palace Hotel, Surat" },
      { src: "/images/project-office.png", title: "Heavy Duty Commercial Elevator", category: "elevator", location: "Hi-Tech IT Park, Lucknow" },
    ];
  }, [gallery]);

  // Extract unique categories for filter tabs dynamically
  const uniqueCategories = useMemo(() => {
    const cats = new Set();
    items.forEach((item) => {
      if (item.category) {
        cats.add(item.category);
      }
    });
    return ["all", ...Array.from(cats)];
  }, [items]);

  // Client-side filtering logic
  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  // Auto-scroll active tabs into view for mobile swipe panels
  useEffect(() => {
    const activeEl = categoryTabRefs.current[activeCategory];
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeCategory]);

  // Lightbox keyboard and scroll lock handlers
  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveImageIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Lock background page scroll

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeImageIndex, filteredItems]);

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="bg-transparent text-[#1C1511] pb-8 pt-8 w-full flex flex-col items-center">
      {!hideHeader && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 w-full gap-6 text-left">
          <div>
            <span className="text-brand-blue text-[0.85rem] font-bold uppercase tracking-[0.2em] block mb-2">Showcase</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-light-primary tracking-tight">Landmark Projects</h2>
          </div>
        </div>
      )}

      {/* Premium Category Filter Tabs Tray */}
      {uniqueCategories.length > 2 && (
        <div className="w-full flex justify-center mb-10 px-4 sm:px-0">
          <div className="relative bg-slate-100 p-1.5 rounded-full flex items-center gap-1 max-w-full overflow-x-auto scrollbar-none border border-slate-200/20 shadow-sm">
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                ref={(el) => (categoryTabRefs.current[cat] = el)}
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveImageIndex(null);
                }}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer select-none whitespace-nowrap ${
                  activeCategory === cat ? "bg-[#0a1128] text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
                }`}
              >
                {cat === "all" ? "All Projects" : cat + "s"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid Portfolio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveImageIndex(index)}
            className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[340px] rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-85 group-hover:opacity-90 transition-opacity duration-300" />
            <img
              src={item.src}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end h-full text-left">
              <span className="text-brand-orange text-[0.72rem] font-extrabold uppercase tracking-widest mb-1.5 capitalize">
                {item.location}
              </span>
              <h4 className="text-white text-[1.12rem] font-bold leading-[1.3] group-hover:text-brand-orange-light transition-colors duration-300">
                {item.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Immersive Lightbox Fullscreen Viewer */}
      {activeImageIndex !== null && filteredItems[activeImageIndex] && (
        <div
          className="fixed inset-0 z-[99999] bg-neutral-950/95 flex flex-col items-center justify-between p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setActiveImageIndex(null)}
        >
          {/* Top Panel: Title and Close Button */}
          <div className="w-full flex justify-between items-center z-50 text-white max-w-6xl">
            <div className="flex flex-col text-left">
              <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-0.5 capitalize">
                {filteredItems[activeImageIndex].location}
              </span>
              <h3 className="text-lg font-bold tracking-tight">
                {filteredItems[activeImageIndex].title}
              </h3>
            </div>
            <button
              onClick={() => setActiveImageIndex(null)}
              className="text-white/60 hover:text-white p-3 rounded-full border border-white/10 hover:bg-white/5 transition cursor-pointer"
              aria-label="Close Lightbox"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Central Image and Arrows Tray */}
          <div className="relative w-full max-w-5xl flex-grow flex items-center justify-center py-6">
            {/* Left arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-0 md:-left-16 z-50 text-white/60 hover:text-white p-3.5 rounded-full border border-white/10 hover:bg-white/5 transition cursor-pointer select-none"
              aria-label="Previous Image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Main Lightbox Image Wrapper */}
            <div
              className="relative max-h-[70vh] max-w-full flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredItems[activeImageIndex].src}
                alt={filteredItems[activeImageIndex].title}
                className="max-h-[70vh] max-w-full object-contain pointer-events-none"
              />
            </div>

            {/* Right arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-0 md:-right-16 z-50 text-white/60 hover:text-white p-3.5 rounded-full border border-white/10 hover:bg-white/5 transition cursor-pointer select-none"
              aria-label="Next Image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          {/* Bottom Panel: Slide Counters */}
          <div className="text-white/40 text-xs font-mono select-none pb-2 z-50">
            {activeImageIndex + 1} / {filteredItems.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeGallery;
