"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { WhatsAppIcon } from "@/shared/icons/Icons";

/**
 * Global Header navigation bar component.
 * Completely redesigned following Apple visionOS/iOS frosted glass floating island aesthetics.
 * @param {object} props
 * @param {string} [props.logoUrl] - Custom logo URL override
 */
export function Header({ logoUrl }) {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerRef = useRef(null);
  const [activeStyle, setActiveStyle] = useState({ left: 0, width: 0, opacity: 0 });

  // Monitor window scroll coordinates
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Auto-clear contact hash if scrolled back near top of homepage
      if (window.scrollY < 200 && window.location.hash === "#contact") {
        window.history.pushState(null, "", window.location.pathname);
        setCurrentHash("");
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    // Set initial hash values
    setTimeout(() => setCurrentHash(window.location.hash), 0);
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (hash) => {
    setCurrentHash(hash);
    setMobileMenuOpen(false);
  };

  const handleGetQuoteClick = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "#contact");
      setCurrentHash("#contact");
      setMobileMenuOpen(false);
    }
  };

  const handleNavigation = (e, url) => {
    // If navigating to Home ("/") and we are already on Home ("/"), clear hash and scroll to top
    if (url === "/" && pathname === "/") {
      e.preventDefault();
      window.history.pushState(null, "", "/");
      setCurrentHash("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMobileMenuOpen(false);
      return;
    }

    const isCurrentPageHash = url.startsWith("#") || (url.startsWith("/#") && pathname === "/");
    if (isCurrentPageHash) {
      if (url.includes("#contact")) {
        handleGetQuoteClick(e);
      }
      return;
    }

    e.preventDefault();
    setMobileMenuOpen(false);
    window.dispatchEvent(
      new CustomEvent("trigger-page-load-transition", {
        detail: { targetUrl: url },
      })
    );
  };

  // Determine if a route is currently active
  const isHomeActive = pathname === "/" && currentHash !== "#contact";
  const isAboutActive = pathname === "/about";
  const isProductsActive = pathname.startsWith("/products");
  const isGalleryActive = pathname.startsWith("/gallery");
  const isContactActive = pathname === "/" && currentHash === "#contact";
  const isBlogActive = pathname.startsWith("/blog");

  const getActiveItem = () => {
    if (isContactActive) return "nav-contact";
    if (isHomeActive) return "nav-home";
    if (isAboutActive) return "nav-about";
    if (isProductsActive) return "nav-products";
    if (isGalleryActive) return "nav-gallery";
    if (isBlogActive) return "nav-blog";
    return null;
  };

  const navItems = [
    { id: "nav-home", label: "Home", href: "/", url: "/" },
    { id: "nav-about", label: "About", href: "/about", url: "/about" },
    { id: "nav-products", label: "Products", href: "/products", url: "/products" },
    { id: "nav-gallery", label: "Gallery", href: "/gallery", url: "/gallery" },
    { id: "nav-blog", label: "Blog", href: "/blog", url: "/blog" },
    { id: "nav-contact", label: "Contact", href: "/#contact", url: "/#contact" }
  ];

  // Measure and update active tab sliding indicator position
  useEffect(() => {
    const updateActiveIndicator = () => {
      const activeId = getActiveItem();
      if (!activeId || !containerRef.current) {
        setActiveStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }
      const activeEl = document.getElementById(activeId);
      if (activeEl) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        setActiveStyle({
          left: activeRect.left - containerRect.left,
          width: activeRect.width,
          opacity: 1
        });
      } else {
        setActiveStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    // Ensure DOM layout is ready before measuring
    const animationFrameId = requestAnimationFrame(() => {
      requestAnimationFrame(updateActiveIndicator);
    });

    window.addEventListener("resize", updateActiveIndicator);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateActiveIndicator);
    };
  }, [pathname, currentHash, isScrolled, isHomeActive, isAboutActive, isProductsActive, isGalleryActive, isContactActive, isBlogActive]);

  return (
    <>
      <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-[1300px] z-[9999] transition-all duration-500 ease-out py-4 px-5 md:px-6 bg-white/80 backdrop-blur-2xl border border-slate-200/60 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.02)] rounded-full flex items-center justify-between gap-4">
        {/* CSS Noise Overlay */}
        <div className="apple-noise rounded-full" />

        {/* Logo Area */}
        <Link
          href="/"
          onClick={(e) => handleNavigation(e, "/")}
          className="flex items-center hover:scale-105 active:scale-95 transition-transform duration-300 relative group select-none shrink-0"
          aria-label="SHIVSHAKTI Homepage"
        >
          {/* Subtle light glow behind logo */}
          <div className="absolute -inset-2 bg-white/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <img
            src={logoUrl || "/images/logo.png"}
            alt="SHIVSHAKTI Logo"
            className="h-7 sm:h-8 md:h-8.5 w-auto object-contain relative z-10 transition-all duration-300"
          />
        </Link>

        {/* Centered Desktop Navigation links */}
        <nav
          ref={containerRef}
          className="hidden lg:flex relative items-center gap-0.5 rounded-full"
          aria-label="Desktop Navigation"
        >
          {/* iPadOS Segmented Control Sliding active indicator capsule */}
          <div
            className="absolute top-0 bottom-0 rounded-full pointer-events-none z-0 transition-all duration-500"
            style={{
              left: `${activeStyle.left}px`,
              width: `${activeStyle.width}px`,
              opacity: activeStyle.opacity,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.04)"
            }}
          />

          {navItems.map((item) => {
            const isActive = getActiveItem() === item.id;
            return (
              <Link
                key={item.id}
                id={item.id}
                href={item.href}
                onClick={(e) => handleNavigation(e, item.url)}
                className={`relative z-10 px-4.5 py-1.5 rounded-full text-[0.95rem] font-medium transition-all duration-250 active:scale-[0.97] cursor-pointer select-none ${isActive
                    ? "text-brand-orange font-semibold"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-900/[0.04]"
                  }`}
                style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Side: WhatsApp & Quote Button, Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          {/* WhatsApp circle button with hover liquid morph */}
          <div className="relative group/whatsapp select-none hidden lg:block">
            <a
              href="https://api.whatsapp.com/send/?phone=6352699700"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="w-9 h-9 flex items-center justify-center border border-slate-200/60 bg-white/80 animate-liquid-morph rounded-full text-slate-700 hover:bg-[#25D366] hover:border-[#25D366] hover:text-white hover:shadow-[0_4px_12px_rgba(37,211,102,0.2)]"
            >
              <WhatsAppIcon className="w-4 h-4 transition-transform duration-300 group-hover/whatsapp:scale-110" />
            </a>
            <div className="absolute top-[120%] right-1/2 translate-x-1/2 px-2.5 py-1 bg-[#120e0b]/90 text-[#eae1d8] text-[0.65rem] font-bold rounded-md opacity-0 pointer-events-none group-hover/whatsapp:opacity-100 transition-all duration-300 scale-95 group-hover/whatsapp:scale-100 whitespace-nowrap shadow-xl z-50 border border-white/5 backdrop-blur-md">
              Chat on WhatsApp
            </div>
          </div>

          {/* Apple premium Get Quote CTA with highlights */}
          <div className="hidden lg:block">
            <Link
              href="/#contact"
              onClick={(e) => handleNavigation(e, "/#contact")}
              className="highlight-sweep-container group/btn flex items-center gap-1.5 px-4.5 py-1.5 rounded-full text-[0.82rem] font-semibold transition-all duration-300 cursor-pointer select-none border border-brand-orange bg-brand-orange text-white hover:bg-brand-orange-light hover:shadow-[0_4px_12px_rgba(248,69,2,0.25)] shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="highlight-sweep" />
              <span>Get Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </div>

          {/* Hamburger Menu Toggle Button (Mobile) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              suppressHydrationWarning
              className="w-9 h-9 flex items-center justify-center border border-slate-200/60 bg-white/80 rounded-full animate-liquid-morph transition-all duration-300 cursor-pointer text-slate-800 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Translucent Overlay Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 w-screen h-screen z-[10000] lg:hidden flex flex-col justify-between p-8 bg-[#120e0b]/80 backdrop-blur-2xl transition-all duration-500 ease-out"
          suppressHydrationWarning
        >
          {/* CSS Noise Overlay */}
          <div className="apple-noise" />

          {/* Top Bar: Logo & Close Button */}
          <div className="flex justify-between items-center w-full relative z-10">
            <Link
              href="/"
              onClick={() => { setMobileMenuOpen(false); setCurrentHash(""); }}
              className="hover:scale-105 active:scale-95 transition-transform duration-300 shrink-0"
            >
              <img
                src="/images/logo.png"
                alt="SHIVSHAKTI Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Mobile Menu"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Middle: Large Navigation Links */}
          <nav className="flex flex-col items-center justify-center gap-6 relative z-10 my-auto text-center" aria-label="Mobile Navigation">
            {navItems.map((item, idx) => {
              const isActive = getActiveItem() === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavigation(e, item.url)}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className={`animate-fade-slide-up block text-3xl font-light tracking-tight transition-all duration-300 ${isActive
                    ? "text-brand-orange font-normal scale-105"
                    : "text-white/70 hover:text-white"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom: Utilities */}
          <div className="flex flex-col gap-4 w-full max-w-sm mx-auto relative z-10 mt-auto">
            {/* WhatsApp Link button */}
            <a
              href="https://api.whatsapp.com/send/?phone=6352699700"
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: `${navItems.length * 60}ms` }}
              className="animate-fade-slide-up flex items-center justify-center gap-2 border border-white/10 bg-white/5 text-white py-3.5 rounded-full text-[0.95rem] font-medium transition-all duration-300 hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_8px_20px_rgba(37,211,102,0.3)] cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 text-white" />
              <span>Chat on WhatsApp</span>
            </a>

            {/* Get Quote button */}
            <Link
              href="/#contact"
              onClick={(e) => handleNavigation(e, "/#contact")}
              style={{ animationDelay: `${(navItems.length + 1) * 60}ms` }}
              className="animate-fade-slide-up highlight-sweep-container bg-brand-orange text-white py-3.5 rounded-full text-center text-[0.95rem] font-semibold transition-all duration-300 hover:bg-brand-orange-light shadow-[0_8px_20px_rgba(248,69,2,0.3)] cursor-pointer border border-brand-orange"
            >
              <div className="highlight-sweep" />
              <span>Get Quote</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;

