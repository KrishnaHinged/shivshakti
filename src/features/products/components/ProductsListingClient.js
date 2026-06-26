"use client";

import React, { useState, useEffect, useMemo, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/shared/layouts/Header/Header";
import Footer from "@/shared/layouts/Footer/Footer";
import ProductImage from "./ProductImage";
import ProductInquiryForm from "./ProductInquiryForm";
import { ArrowRight, ArrowLeft, Search, X, Shield, Star, Info, HelpCircle } from "lucide-react";

function ProductsListingClient({ products, categories, settings }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active states
  const [activeCategoryModal, setActiveCategoryModal] = useState(null); // 'door' | 'cabin' | 'frame'
  const [activeInquiryProduct, setActiveInquiryProduct] = useState(null); // { _id, title, slug }
  const [dealerActiveTab, setDealerActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Split products into divisions
  const inHouseProducts = useMemo(() => {
    return products.filter(
      (p) => p.productType === "our-product" || p.category === "in-house"
    );
  }, [products]);

  const dealerProducts = useMemo(() => {
    return products.filter(
      (p) => p.productType === "dealer-product" || p.category === "trading" || p.category === "authorized"
    );
  }, [products]);

  const elevatorKits = useMemo(() => {
    return products.filter((p) => p.productType === "elevator-kit" || p.category === "elevator-kit");
  }, [products]);

  // Grouped Subcategories for "Our Products"
  const inHouseGrouped = useMemo(() => {
    const groups = { door: {}, cabin: {}, frame: {}, "layout-cabin": {} };

    inHouseProducts.forEach((p) => {
      // Find category key: 'door', 'cabin', 'frame', or 'layout-cabin'
      let catKey = p.category?.toLowerCase() || "door";
      if (!groups[catKey]) {
        if (catKey.includes("layout-cabin")) catKey = "layout-cabin";
        else if (catKey.includes("door")) catKey = "door";
        else if (catKey.includes("cabin")) catKey = "cabin";
        else if (catKey.includes("frame")) catKey = "frame";
        else catKey = "door";
      }

      const subcat = p.subCategory || "General Components";
      if (!groups[catKey][subcat]) {
        groups[catKey][subcat] = [];
      }
      groups[catKey][subcat].push(p);
    });

    return groups;
  }, [inHouseProducts]);

  // Dynamic filter for Dealer Products (based on Brands)
  const dealerBrands = useMemo(() => {
    const brands = new Set();
    dealerProducts.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands);
  }, [dealerProducts]);

  const filteredDealerProducts = useMemo(() => {
    let list = dealerProducts;
    const activeBrand = (dealerActiveTab && dealerActiveTab !== "all") ? dealerActiveTab : dealerBrands[0];

    if (activeBrand) {
      list = list.filter((p) => p.brand === activeBrand);
    }

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    return list;
  }, [dealerProducts, dealerActiveTab, dealerBrands, debouncedQuery]);

  const filteredElevatorKits = useMemo(() => {
    let list = elevatorKits;
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }
    return list;
  }, [elevatorKits, debouncedQuery]);

  // Tab navigation states
  const [activeMainTab, setActiveMainTab] = useState("manufactured");
  const [activeSubTab, setActiveSubTab] = useState("door");
  const [displayTab, setDisplayTab] = useState({ main: "manufactured", sub: "door" });
  const [fadeState, setFadeState] = useState("in");

  // Sliding indicators layout state
  const [mainIndicatorStyle, setMainIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [subIndicatorStyle, setSubIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const mainTabsRef = useRef({});
  const subTabsRef = useRef({});

  // Sync main tab change
  const handleMainTabChange = (tab) => {
    setActiveMainTab(tab);
    if (tab === "manufactured") {
      setActiveSubTab("door");
    } else if (tab === "dealer") {
      setActiveSubTab(dealerBrands[0] || "");
    } else {
      setActiveSubTab(null);
    }
  };

  // Trigger content fade in/out animation on tab transition
  useEffect(() => {
    setFadeState("out");
    const timer = setTimeout(() => {
      setDisplayTab({ main: activeMainTab, sub: activeSubTab });
      setFadeState("in");
    }, 200);
    return () => clearTimeout(timer);
  }, [activeMainTab, activeSubTab]);

  // Sync sub tab brand filter to existing dealerActiveTab state and handle default brand
  useEffect(() => {
    if (activeMainTab === "dealer") {
      const defaultBrand = dealerBrands[0] || "";
      const currentSub = (activeSubTab && activeSubTab !== "all" && activeSubTab !== "door" && activeSubTab !== "cabin" && activeSubTab !== "frame")
        ? activeSubTab
        : defaultBrand;

      if (activeSubTab !== currentSub) {
        setActiveSubTab(currentSub);
      }
      setDealerActiveTab(currentSub);
    }
  }, [activeSubTab, activeMainTab, dealerBrands]);

  // Dynamic alignment of active tab indicators
  const updateIndicators = () => {
    const activeMainEl = mainTabsRef.current[activeMainTab];
    if (activeMainEl) {
      setMainIndicatorStyle({
        left: activeMainEl.offsetLeft,
        width: activeMainEl.offsetWidth,
        opacity: 1,
      });
    } else {
      setMainIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }

    const activeSubEl = subTabsRef.current[activeSubTab];
    if (activeSubEl) {
      setSubIndicatorStyle({
        left: activeSubEl.offsetLeft,
        width: activeSubEl.offsetWidth,
        opacity: 1,
      });
    } else {
      setSubIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useEffect(() => {
    const timer = setTimeout(updateIndicators, 50);
    window.addEventListener("resize", updateIndicators);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicators);
    };
  }, [activeMainTab, activeSubTab]);

  // Elevator exit transition states
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const [exitOverlayOpacity, setExitOverlayOpacity] = useState(1);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Handle URL inquiry triggers (e.g. from redirect)
  useEffect(() => {
    const inquireSlug = searchParams?.get("inquire") || searchParams?.get("inquiry");
    if (inquireSlug) {
      const foundProduct = products.find((p) => p.slug === inquireSlug);
      if (foundProduct) {
        setActiveInquiryProduct({
          _id: foundProduct._id,
          title: foundProduct.title,
          slug: foundProduct.slug,
        });
      }
    }
  }, [searchParams, products]);

  // Entrance transition
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

      let rafId1, rafId2, removeTimer;

      rafId1 = requestAnimationFrame(() => {
        rafId2 = requestAnimationFrame(() => {
          setExitOverlayOpacity(0);
        });
      });

      removeTimer = setTimeout(() => {
        setShowExitOverlay(false);
        sessionStorage.removeItem("elevator-transition-consuming");
      }, 1000);

      return () => {
        if (rafId1) cancelAnimationFrame(rafId1);
        if (rafId2) cancelAnimationFrame(rafId2);
        clearTimeout(removeTimer);
      };
    }
  }, []);



  // Open Inquiry Modal helper
  const openInquiry = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveInquiryProduct({
      _id: product._id,
      title: product.title,
      slug: product.slug,
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#1C1511] font-sans selection:bg-brand-orange selection:text-white">
      {/* Navigation Header */}
      <Header logoUrl={settings.logoUrl} />

      {/* Hero Header Section */}
      <section className="w-full px-4 lg:px-8 pt-24 lg:pt-28 pb-4 bg-transparent">
        <div className="relative w-full rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden bg-neutral-950 flex flex-col justify-center p-8 md:p-12 lg:p-16 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          {/* Background Image & Radial Glow Overlay */}
          <div className="absolute inset-0 bg-[url('/images/hero.jpeg')] bg-cover bg-center bg-no-repeat opacity-30 z-0" />
          <div className="absolute inset-0 z-10" />

          {/* Content Details */}
          <div className="relative z-20 max-w-[1300px] flex flex-col gap-6">
            {/* Breadcrumb */}
            <nav className="text-xs lg:text-sm font-semibold tracking-wide text-slate-400 flex items-center gap-2">
              <Link href="/" className="hover:text-brand-orange transition duration-200">
                Home
              </Link>
              <span className="text-white/20 font-mono">/</span>
              <span className="text-brand-orange font-semibold">Catalog</span>
            </nav>

            <div className="max-w-3xl flex flex-col gap-4">
              <span className="text-brand-orange text-[0.82rem] font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-4 py-1.5 rounded-full border border-brand-orange/20 select-none w-fit">
                B2B Digital Showroom
              </span>
              <h1 className="text-4xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.15] text-white font-sans mt-2">
                Explore Our <span className="italic text-brand-orange font-medium font-serif">Elevator</span> Solutions
              </h1>
              <p className="text-[1rem] lg:text-[1.12rem] text-slate-300 leading-[1.6] mt-1 opacity-90 max-w-2xl">
                Precision-engineered elevator components and complete systems crafted for modern vertical mobility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ChatGPT-style Pill Navigation Container */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-10 pb-4 flex flex-col gap-5 items-center w-full">
        {/* Main Category Tabs Tray */}
        <div className="relative bg-slate-100 p-1.5 rounded-full flex items-center gap-1 w-fit max-w-full overflow-x-auto scrollbar-none shadow-sm border border-slate-200/20">
          {/* Sliding Background Indicator for Main Tabs */}
          <div
            className="absolute top-1.5 bottom-1.5 bg-[#0a1128] rounded-full pointer-events-none"
            style={{
              transform: `translateX(${mainIndicatorStyle.left}px)`,
              width: `${mainIndicatorStyle.width}px`,
              opacity: mainIndicatorStyle.opacity,
              transition: "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), width 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease",
            }}
          />

          <button
            ref={(el) => (mainTabsRef.current["manufactured"] = el)}
            onClick={() => handleMainTabChange("manufactured")}
            suppressHydrationWarning
            className={`relative z-10 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer select-none whitespace-nowrap ${activeMainTab === "manufactured" ? "text-white" : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Our Manufactured Products
          </button>

          <button
            ref={(el) => (mainTabsRef.current["dealer"] = el)}
            onClick={() => handleMainTabChange("dealer")}
            suppressHydrationWarning
            className={`relative z-10 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer select-none whitespace-nowrap ${activeMainTab === "dealer" ? "text-white" : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Authorized Dealer Products
          </button>

          <button
            ref={(el) => (mainTabsRef.current["kits"] = el)}
            onClick={() => handleMainTabChange("kits")}
            suppressHydrationWarning
            className={`relative z-10 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer select-none whitespace-nowrap ${activeMainTab === "kits" ? "text-white" : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Complete Elevator Kits
          </button>
        </div>

        {/* Sub Category Tabs Row (only rendered if subcategories exist) */}
        {activeMainTab !== "kits" && (
          <div className="relative bg-slate-100/50 p-1 rounded-full flex items-center gap-1 w-fit max-w-full overflow-x-auto scrollbar-none border border-slate-200/30">
            {/* Sliding Background Indicator for Sub Tabs */}
            <div
              className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm border border-slate-200/40"
              style={{
                transform: `translateX(${subIndicatorStyle.left}px)`,
                width: `${subIndicatorStyle.width}px`,
                opacity: subIndicatorStyle.opacity,
                transition: "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), width 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease",
              }}
            />

            {activeMainTab === "manufactured" ? (
              <>
                <button
                  ref={(el) => (subTabsRef.current["door"] = el)}
                  onClick={() => setActiveSubTab("door")}
                  suppressHydrationWarning
                  className={`relative z-10 px-5 py-2 rounded-full text-[0.72rem] font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer select-none whitespace-nowrap ${activeSubTab === "door" ? "text-[#0a1128]" : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  Doors
                </button>
                <button
                  ref={(el) => (subTabsRef.current["cabin"] = el)}
                  onClick={() => setActiveSubTab("cabin")}
                  suppressHydrationWarning
                  className={`relative z-10 px-5 py-2 rounded-full text-[0.72rem] font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer select-none whitespace-nowrap ${activeSubTab === "cabin" ? "text-[#0a1128]" : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  Cabins
                </button>
                <button
                  ref={(el) => (subTabsRef.current["frame"] = el)}
                  onClick={() => setActiveSubTab("frame")}
                  suppressHydrationWarning
                  className={`relative z-10 px-5 py-2 rounded-full text-[0.72rem] font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer select-none whitespace-nowrap ${activeSubTab === "frame" ? "text-[#0a1128]" : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  Frames
                </button>
                <button
                  ref={(el) => (subTabsRef.current["layout-cabin"] = el)}
                  onClick={() => setActiveSubTab("layout-cabin")}
                  suppressHydrationWarning
                  className={`relative z-10 px-5 py-2 rounded-full text-[0.72rem] font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer select-none whitespace-nowrap ${activeSubTab === "layout-cabin" ? "text-[#0a1128]" : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  Layout Cabins
                </button>
              </>
            ) : (
              dealerBrands.map((brand) => (
                <button
                  key={brand}
                  ref={(el) => (subTabsRef.current[brand] = el)}
                  onClick={() => setActiveSubTab(brand)}
                  suppressHydrationWarning
                  className={`relative z-10 px-5 py-2 rounded-full text-[0.72rem] font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer select-none whitespace-nowrap ${activeSubTab === brand ? "text-[#0a1128]" : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  {brand === "all" ? "All Brands" : brand}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Dynamic Products Grid Section */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pb-20 lg:pb-28">
        <div
          className={`transition-all duration-300 ease-out transform ${fadeState === "in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
        >
          {displayTab.main === "manufactured" && (
            <div className="flex flex-col gap-12 text-left">
              {/* Category Header */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-px w-8 bg-brand-orange"></span>
                  <span className="text-brand-orange text-xs font-bold uppercase tracking-wider">Shivshakti Manufactured</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 capitalize">
                  Our Manufactured {displayTab.sub === "layout-cabin" ? "Layout Cabins" : displayTab.sub + "s"}
                </h2>
                <p className="text-slate-500 text-sm max-w-2xl">
                  Premium {displayTab.sub === "door" ? "automatic and manual doors" : displayTab.sub === "cabin" ? "passenger and luxury cabins" : displayTab.sub === "layout-cabin" ? "aesthetic design customizable cabins" : "elevator car frames and alignment products"} engineered and manufactured in-house.
                </p>
              </div>

              {/* Manufactured Subcategories Groupings */}
              <div className="flex flex-col gap-12">
                {Object.entries(inHouseGrouped[displayTab.sub] || {}).map(([subcat, list]) => {
                  if (list.length === 0) return null;
                  return (
                    <div key={subcat} className="flex flex-col gap-6">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2.5 text-left">
                        {subcat} ({list.length})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {list.map((item) => {
                          const subtitleText = item.category === "in-house" ? "IN-HOUSE" : item.category === "trading" ? "TRADING" : "AUTHORIZED";
                          const badgeText = item.badge || "IN-HOUSE MADE";

                          return (
                            <Link
                              key={item._id}
                              href={`/products/${item.slug}`}
                              className="relative w-full aspect-square rounded-[2.2rem] overflow-hidden border border-white/10 flex flex-col justify-end transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 group text-white cursor-pointer"
                            >
                              {/* Product Background Image */}
                              <div className="absolute inset-0 z-0">
                                <ProductImage
                                  src={item.featuredImage}
                                  alt={item.title}
                                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                              </div>

                              {/* Premium Bluish Dark Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128]/95 via-[#0a1128]/45 to-transparent z-10 transition-opacity duration-300 group-hover:via-[#0a1128]/55" />

                              {/* Glassmorphic Pill Badge */}
                              <span className="absolute top-6 right-6 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white font-extrabold text-[0.68rem] tracking-wider uppercase shadow-md z-20">
                                {badgeText}
                              </span>

                              {/* Text Content overlay at bottom */}
                              <div className="relative z-20 p-8 flex flex-col gap-1 text-left">
                                <h3 className="text-xl font-extrabold tracking-wide uppercase text-white mb-0.5">
                                  {subtitleText}
                                </h3>
                                <p className="text-[1rem] font-medium text-white/90">
                                  {item.title}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {Object.keys(inHouseGrouped[displayTab.sub] || {}).length === 0 && (
                  <div className="text-center py-16 text-slate-400 italic bg-white border border-slate-200 rounded-2xl">
                    No manufactured products found in this category.
                  </div>
                )}
              </div>
            </div>
          )}

          {displayTab.main === "dealer" && (
            <div className="flex flex-col gap-12 text-left">
              {/* Category Header */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-px w-8 bg-brand-orange"></span>
                  <span className="text-brand-orange text-xs font-bold uppercase tracking-wider">Trading Divisions</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                  Authorized Dealer Products
                </h2>
                <p className="text-slate-500 text-sm max-w-2xl">
                  We are strategic distribution partners for the world's leading brands of elevator ropes, gearless machines, and digital control boards.
                </p>
              </div>

              {/* Dealer Grid */}
              {filteredDealerProducts.length === 0 ? (
                <div className="text-center py-16 text-slate-400 italic bg-white border border-slate-200 rounded-2xl">
                  No authorized dealer products match your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredDealerProducts.map((product) => {
                    const subtitleText = product.category === "in-house" ? "IN-HOUSE" : product.category === "trading" ? "TRADING" : "AUTHORIZED";
                    const badgeText = product.badge || product.brand || "AUTHORIZED";

                    return (
                      <Link
                        key={product._id}
                        href={`/products/${product.slug}`}
                        className="relative w-full aspect-square rounded-[2.2rem] overflow-hidden border border-white/10 flex flex-col justify-end transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 group text-white cursor-pointer"
                      >
                        {/* Product Background Image */}
                        <div className="absolute inset-0 z-0">
                          <ProductImage
                            src={product.featuredImage}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        </div>

                        {/* Premium Bluish Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128]/95 via-[#0a1128]/45 to-transparent z-10 transition-opacity duration-300 group-hover:via-[#0a1128]/55" />

                        {/* Glassmorphic Pill Badge */}
                        <span className="absolute top-6 right-6 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white font-extrabold text-[0.68rem] tracking-wider uppercase shadow-md z-20">
                          {badgeText}
                        </span>

                        {/* Text Content overlay at bottom */}
                        <div className="relative z-20 p-8 flex flex-col gap-1 text-left">
                          <h3 className="text-xl font-extrabold tracking-wide uppercase text-white mb-0.5">
                            {subtitleText}
                          </h3>
                          <p className="text-[1rem] font-medium text-white/90">
                            {product.title}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {displayTab.main === "kits" && (
            <div className="flex flex-col gap-12 text-left">
              {/* Category Header */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-px w-8 bg-brand-orange"></span>
                  <span className="text-brand-orange text-xs font-bold uppercase tracking-wider">Architecture Portfolio</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                  Complete Elevator Kits
                </h2>
                <p className="text-slate-500 text-sm max-w-2xl">
                  Integrated engineering packages. Custom passenger, home villa, and high-rise traction solutions. Complete packages, inquiry-only.
                </p>
              </div>

              {/* Kits Grid */}
              {filteredElevatorKits.length === 0 ? (
                <div className="text-center py-16 text-slate-400 italic bg-white border border-slate-200 rounded-2xl">
                  No complete elevator kits match your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                  {filteredElevatorKits.map((kit) => {
                    const subtitleText = kit.category === "in-house" ? "IN-HOUSE" : kit.category === "trading" ? "TRADING" : "AUTHORIZED";
                    const badgeText = kit.badge || "INTEGRATED KIT";

                    return (
                      <div
                        key={kit._id}
                        onClick={(e) => openInquiry(kit, e)}
                        className="relative w-full aspect-square rounded-[2.2rem] overflow-hidden border border-white/10 flex flex-col justify-end transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 group text-white cursor-pointer"
                      >
                        {/* Product Background Image */}
                        <div className="absolute inset-0 z-0">
                          <ProductImage
                            src={kit.featuredImage}
                            alt={kit.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        </div>

                        {/* Premium Bluish Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128]/95 via-[#0a1128]/45 to-transparent z-10 transition-opacity duration-300 group-hover:via-[#0a1128]/55" />

                        {/* Glassmorphic Pill Badge */}
                        <span className="absolute top-6 right-6 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white font-extrabold text-[0.68rem] tracking-wider uppercase shadow-md z-20">
                          {badgeText}
                        </span>

                        {/* Text Content overlay at bottom */}
                        <div className="relative z-20 p-8 flex flex-col gap-1 text-left">
                          <h3 className="text-xl font-extrabold tracking-wide uppercase text-white mb-0.5">
                            {subtitleText}
                          </h3>
                          <p className="text-[1rem] font-medium text-white/90">
                            {kit.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer component */}
      <Footer products={products} settings={settings} />

      {/* CATEGORY FULL-PAGE VIEW (For Manufactured Doors, Cabins, Frames divisions) */}
      {activeCategoryModal && (
        <div className="fixed inset-0 z-[1000] w-full h-full bg-[#FDFBF9] overflow-y-auto flex flex-col p-6 md:p-16 animate-in fade-in duration-500">
          <div className="max-w-[1200px] w-full mx-auto relative flex flex-col">

            {/* Back Button */}
            <button
              onClick={() => setActiveCategoryModal(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-brand-orange text-xs font-extrabold uppercase tracking-wider mb-8 cursor-pointer select-none w-fit transition duration-200"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
              <span>Back to Products</span>
            </button>

            {/* Title / Description */}
            <div className="mb-12 text-left max-w-3xl">
              <span className="text-brand-orange text-xs font-extrabold uppercase tracking-widest block mb-1">
                Shivshakti Manufactured Division
              </span>
              <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight capitalize">
                Our Manufactured {activeCategoryModal === "layout-cabin" ? "Layout Cabins" : activeCategoryModal + "s"}
              </h3>
              <p className="text-slate-500 text-[0.92rem] leading-relaxed mt-3">
                Handcrafted at our Surat factory with premium structural alignments, specialized finishes, and standard quality warranties.
              </p>
            </div>

            {/* Subcategories Lists */}
            <div className="flex flex-col gap-12">
              {Object.entries(inHouseGrouped[activeCategoryModal] || {}).map(([subcat, list]) => {
                if (list.length === 0) return null;
                return (
                  <div key={subcat} className="flex flex-col gap-6">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2.5 text-left">
                      {subcat} ({list.length})
                    </h4>

                    {/* Cards Subgrid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                      {list.map((item) => (
                        <Link
                          key={item._id}
                          href={`/products/${item.slug}`}
                          onClick={() => setActiveCategoryModal(null)}
                          className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left"
                        >
                          <div>
                            {/* Product Thumbnail */}
                            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-100 relative">
                              <ProductImage
                                src={item.featuredImage}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {item.badge && (
                                <span className="absolute top-3.5 right-3.5 bg-brand-orange-pale text-brand-orange border border-brand-orange/20 text-[0.62rem] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                  {item.badge}
                                </span>
                              )}
                            </div>

                            <div className="p-5">
                              <h5 className="font-bold text-slate-800 text-[1rem] leading-snug group-hover:text-brand-orange transition-colors">
                                {item.title}
                              </h5>
                              <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                                {item.shortDescription}
                              </p>
                            </div>
                          </div>

                          {/* CTAs */}
                          <div className="p-5 pt-0 flex gap-2.5">
                            <span className="flex-grow text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-[0.72rem] transition uppercase tracking-wider">
                              View Details
                            </span>
                            <button
                              onClick={(e) => openInquiry(item, e)}
                              suppressHydrationWarning
                              className="flex-grow bg-brand-orange hover:bg-brand-orange-light text-white font-bold py-2.5 rounded-xl text-[0.72rem] transition cursor-pointer uppercase tracking-wider shadow-sm"
                            >
                              Inquire
                            </button>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}

              {Object.keys(inHouseGrouped[activeCategoryModal] || {}).length === 0 && (
                <div className="text-center py-16 text-slate-400 italic bg-white border border-slate-200 rounded-2xl">
                  No manufactured products found in this category.
                </div>
              )}
            </div>

            {/* Bottom Back Button */}
            <div className="flex justify-center mt-16 border-t border-slate-200/60 pt-8">
              <button
                onClick={() => setActiveCategoryModal(null)}
                className="bg-[#0a1128] hover:bg-black text-white font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 group shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <ArrowLeft className="w-4.5 h-4.5 transition-transform group-hover:-translate-x-1" />
                <span>Back to Products</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL GLASSMORPHIC INQUIRY MODAL */}
      {activeInquiryProduct && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-[#FDFBF9] rounded-[2rem] shadow-2xl p-1 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Embedded close button */}
            <button
              onClick={() => setActiveInquiryProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition cursor-pointer z-50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Inner Wrapper */}
            <div className="p-5 max-h-[90vh] overflow-y-auto">
              <ProductInquiryForm
                productId={activeInquiryProduct._id}
                productTitle={activeInquiryProduct.title}
                productSlug={activeInquiryProduct.slug}
              />
            </div>
          </div>
        </div>
      )}

      {/* Exit transit overlay */}
      {showExitOverlay && (
        <div
          className="fixed inset-0 z-[100000] pointer-events-none flex flex-col items-center justify-center"
          style={{
            background: "radial-gradient(circle at 15% 20%, rgba(30,10,5,0.25) 0%, transparent 50%), radial-gradient(circle at 85% 80%, rgba(249,115,22,0.15) 0%, transparent 45%), #0A0A0A",
            opacity: exitOverlayOpacity,
            transition: "opacity 0.8s ease-out",
          }}
        >
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
              className="overflow-hidden animate-pulse"
            >
              <rect x="10" y="10" width="160" height="240" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" />
              <line x1="25" y1="10" x2="25" y2="250" stroke="#F97316" strokeWidth="3" />
              <line x1="155" y1="10" x2="155" y2="250" stroke="#F97316" strokeWidth="3" />
              <g>
                <line x1="70" y1="10" x2="70" y2="82" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <line x1="90" y1="10" x2="90" y2="82" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <rect x="30" y="80" width="120" height="140" stroke="#FFFFFF" strokeWidth="2.5" fill="rgba(255,255,255,0.03)" />
                <line x1="90" y1="85" x2="90" y2="215" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                <line x1="20" y1="82" x2="160" y2="82" stroke="#F97316" strokeWidth="3" />
                <line x1="20" y1="218" x2="160" y2="218" stroke="#F97316" strokeWidth="3" />
              </g>
            </svg>
            <div className="text-[10px] text-slate-400 tracking-wider uppercase text-center mt-3">
              Loading digital showroom...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsListingPage(props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
          <div className="text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium tracking-wide">Initializing digital showroom...</p>
          </div>
        </div>
      }
    >
      <ProductsListingClient {...props} />
    </Suspense>
  );
}
