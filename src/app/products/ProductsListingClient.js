"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductImage from "@/components/ui/ProductImage";
import Fuse from "fuse.js";

export default function ProductsListingClient({ products, categories, settings }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Elevator exit transition states
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [exitOverlayOpacity, setExitOverlayOpacity] = useState(1);

  useEffect(() => {
    const active = sessionStorage.getItem("elevator-transition-active") === "true";
    const consuming = sessionStorage.getItem("elevator-transition-consuming") === "true";

    if (active || consuming) {
      setShowExitOverlay(true);
      setExitOverlayOpacity(1);

      if (active) {
        sessionStorage.removeItem("elevator-transition-active");
        sessionStorage.setItem("elevator-transition-consuming", "true");
      }

      let rafId1;
      let rafId2;
      let removeTimer;

      rafId1 = requestAnimationFrame(() => {
        rafId2 = requestAnimationFrame(() => {
          setExitOverlayOpacity(0);
        });
      });

      // Clear the overlay and reset session storage after transition completes (800ms)
      removeTimer = setTimeout(() => {
        setShowExitOverlay(false);
        sessionStorage.removeItem("elevator-transition-consuming");
      }, 1000); // 1.0s safety timeout to ensure the transition finishes

      return () => {
        if (rafId1) cancelAnimationFrame(rafId1);
        if (rafId2) cancelAnimationFrame(rafId2);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  // Debounce scroll search query inputs (200ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Pre-process specs to raw text for search indexing
  const preparedProducts = useMemo(() => {
    return products.map((product) => {
      const specsMap = product.specifications?.size
        ? Object.fromEntries(product.specifications)
        : (product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs || {});
      
      const specsText = Object.entries(specsMap)
        .map(([key, val]) => `${key} ${val}`)
        .join(" ");

      return {
        ...product,
        specsText,
      };
    });
  }, [products]);

  // Configure Fuse.js index
  const fuse = useMemo(() => {
    const options = {
      keys: [
        { name: "title", weight: 0.45 },
        { name: "shortDescription", weight: 0.2 },
        { name: "specsText", weight: 0.25 },
        { name: "category", weight: 0.1 },
      ],
      threshold: 0.35, // Adjusts balance between absolute matches and fuzzy results
      ignoreLocation: true,
    };
    return new Fuse(preparedProducts, options);
  }, [preparedProducts]);

  // Perform filtering
  const filteredProducts = useMemo(() => {
    let list = preparedProducts;

    // Apply fuzzy search
    if (debouncedQuery.trim()) {
      list = fuse.search(debouncedQuery.trim()).map(r => r.item);
    }

    // Apply category selection tab
    return list.filter((product) => {
      return activeCategory === "all" || product.category === activeCategory;
    });
  }, [debouncedQuery, activeCategory, preparedProducts, fuse]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-brand-orange selection:text-white">
      {/* Navigation Header */}
      <Header logoUrl={settings.logoUrl} />

      {/* Hero Header Section */}
      <section className="bg-bg-light text-text-light-primary border-b border-border-light pb-20 pt-32 lg:pb-28 lg:pt-40 px-6 lg:px-16">
        <div className="max-w-[1300px] mx-auto flex flex-col gap-6">
          {/* Breadcrumb */}
          <nav className="text-xs lg:text-sm font-semibold tracking-wide text-text-light-secondary flex items-center gap-2">
            <Link href="/" className="hover:text-brand-orange transition duration-200">
              Home
            </Link>
            <span className="text-text-light-secondary/40 font-mono">/</span>
            <span className="text-brand-blue">Products</span>
          </nav>

          <div className="max-w-3xl flex flex-col gap-4">
            <span className="text-brand-blue text-[0.85rem] font-bold uppercase tracking-[0.2em] block">
              Our Catalog
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-text-light-primary">
               Elevator Components & Solutions
            </h1>
            <p className="text-[1.05rem] text-text-light-secondary leading-[1.7] mt-1">
              Explore Shivshakti's complete range of elevator cabins, automatic doors, car frames, machines, guide rails, wire ropes, and elevator components.
            </p>
          </div>
        </div>
      </section>

      {/* Grid, Filtering & Live Search Section */}
      <section className="px-6 lg:px-16 py-16">
        <div className="max-w-[1300px] mx-auto flex flex-col gap-10">

          {/* Control Bar: Filters & Search */}
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 bg-slate-50 border border-slate-200/80 rounded-[2rem] p-6 shadow-sm">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                suppressHydrationWarning
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeCategory === "all"
                  ? "bg-brand-orange text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                All ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.slug).length;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    suppressHydrationWarning
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeCategory === cat.slug
                      ? "bg-brand-orange text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full lg:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specs, titles, descriptions..."
                suppressHydrationWarning
                className="w-full bg-white border border-slate-200 rounded-full pl-11 pr-5 py-3 text-slate-800 text-[0.9rem] outline-none transition-all duration-300 focus:border-brand-orange focus:bg-slate-50 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center text-[0.88rem] text-slate-500 px-2">
            <span>
              Showing {filteredProducts.length} of {products.length} Products
            </span>
            {searchQuery && (
              <span>
                Search results for: <strong className="text-slate-800">"{searchQuery}"</strong>
              </span>
            )}
          </div>

          {/* Catalog Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-16 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">No products found</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                We couldn't find any products matching your current category filter and search parameters. Try clearing your search or choosing another category.
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="mt-2 bg-brand-orange text-white px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-brand-orange-light cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {filteredProducts.map((product) => {
                return (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="bg-card-bg border border-border-light rounded-[1.5rem] overflow-hidden flex flex-col transition-all duration-300 shadow-[0_4px_20px_rgba(90,75,65,0.03)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-brand-blue/25 group text-text-light-primary"
                  >
                    <div className="relative w-full h-[280px] overflow-hidden bg-slate-50 flex items-center justify-center">
                      <ProductImage
                        src={product.featuredImage}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.badge && (
                        <span
                          className={`absolute top-5 right-5 text-white px-3 py-1.5 rounded-lg text-[0.8rem] font-semibold backdrop-blur-[4px] z-10 ${product.badgeColor === "brand-orange" ? "bg-brand-orange/85" : "bg-brand-blue/85"
                            }`}
                        >
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-6 text-center border-t border-border-light">
                      <h3 className="text-[1.2rem] font-bold text-text-light-primary group-hover:text-brand-blue transition-colors duration-300">
                        {product.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Footer component */}
      <Footer products={products} settings={settings} />

      {/* Cinematic Elevator Transit Exit Overlay — Loading Screen Theme */}
      {showExitOverlay && (
        <div
          className="fixed inset-0 z-[100000] pointer-events-none flex flex-col items-center justify-center"
          style={{
            background: "radial-gradient(circle at 15% 20%, rgba(30,58,138,0.25) 0%, transparent 50%), radial-gradient(circle at 85% 80%, rgba(249,115,22,0.15) 0%, transparent 45%), #0A0A0A",
            opacity: exitOverlayOpacity,
            transition: "opacity 0.8s ease-out",
          }}
        >
          {/* Mini loading screen SVG */}
          <div style={{
            opacity: exitOverlayOpacity,
            transform: exitOverlayOpacity === 1 ? "scale(1)" : "scale(0.9)",
            transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
            <svg
              width="120"
              height="170"
              viewBox="0 0 180 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-hidden"
            >
              <rect x="10" y="10" width="160" height="240" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" />
              <line x1="25" y1="10" x2="25" y2="250" stroke="#1E3A8A" strokeWidth="3" />
              <line x1="155" y1="10" x2="155" y2="250" stroke="#1E3A8A" strokeWidth="3" />
              <g>
                <line x1="70" y1="10" x2="70" y2="82" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <line x1="90" y1="10" x2="90" y2="82" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <line x1="110" y1="10" x2="110" y2="82" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <rect x="30" y="80" width="120" height="140" stroke="#FFFFFF" strokeWidth="2.5" fill="rgba(255,255,255,0.03)" />
                <line x1="70" y1="85" x2="70" y2="215" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="110" y1="85" x2="110" y2="215" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="90" y1="85" x2="90" y2="215" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                <line x1="20" y1="82" x2="160" y2="82" stroke="#F97316" strokeWidth="3" />
                <line x1="20" y1="218" x2="160" y2="218" stroke="#F97316" strokeWidth="3" />
                <rect x="70" y="65" width="40" height="14" fill="rgba(30,58,138,0.3)" stroke="#1E3A8A" strokeWidth="1" rx="3" />
              </g>
            </svg>
            <div style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textAlign: "center",
              marginTop: "12px",
            }}>
              Loading products...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
