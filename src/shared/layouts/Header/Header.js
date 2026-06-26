"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { WhatsAppIcon } from "@/shared/icons/Icons";

/**
 * Global Header navigation bar component.
 * Uses a glassmorphic background capsule overlay layout.
 * @param {object} props
 * @param {string} [props.logoUrl] - Custom logo URL override
 */
export function Header({ logoUrl }) {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor window scroll coordinates
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

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

  // Dynamic link text class with glassmorphic capsule design (Apple Finish)
  const linkClass = (isActive) => {
    const baseClass = "text-[0.92rem] font-semibold px-4.5 py-2 rounded-full transition-all duration-300 flex items-center gap-1 cursor-pointer border border-transparent";
    if (isActive) {
      return `${baseClass} text-brand-orange bg-black/5 border-black/10 shadow-sm`;
    }
    return `${baseClass} text-slate-900 hover:text-slate-900 hover:bg-black/5 hover:border-black/10`;
  };

  return (
    <>
      <header
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-[1300px] z-[9999] transition-all duration-300 py-4 bg-white/10 backdrop-blur-xl rounded-4xl border border-1 border-white/20 border-opacity-40"
      >
        <div className="flex justify-between items-center w-full px-6 lg:px-12">

          {/* Logo */}
          <Link
            href="/"
            onClick={() => handleLinkClick("")}
            className="flex items-center hover:scale-105 transition-transform duration-300 select-none shrink-0"
            aria-label="SHIVSHAKTI Homepage"
          >
            <img
              src={logoUrl || "/images/logo.png"}
              alt="SHIVSHAKTI Logo"
              className="h-11 md:h-12 w-auto object-contain transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex gap-2.5 items-center" aria-label="Desktop Navigation">
            <Link href="/" onClick={(e) => handleNavigation(e, "/")} className={linkClass(isHomeActive)}>
              Home
            </Link>

            <Link href="/about" onClick={(e) => handleNavigation(e, "/about")} className={linkClass(isAboutActive)}>
              About
            </Link>

            <Link href="/products" onClick={(e) => handleNavigation(e, "/products")} className={linkClass(isProductsActive)}>
              Products
            </Link>

            <Link href="/gallery" onClick={(e) => handleNavigation(e, "/gallery")} className={linkClass(isGalleryActive)}>
              Gallery
            </Link>

            <Link href="/blog" onClick={(e) => handleNavigation(e, "/blog")} className={linkClass(pathname.startsWith("/blog"))}>
              Blog
            </Link>

            <Link href="/#contact" onClick={(e) => handleNavigation(e, "/#contact")} className={linkClass(isContactActive)}>
              Contact
            </Link>
          </nav>

          {/* Desktop Right Side: WhatsApp & Quote Button */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            {/* WhatsApp Link Icon with hover action & tooltip */}
            <div className="relative group/whatsapp">
              <a
                href="https://api.whatsapp.com/send/?phone=6352699700"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${isScrolled
                  ? "border-slate-200 text-slate-600 hover:bg-green-500 hover:border-green-500 hover:text-white hover:-translate-y-0.5"
                  : "border-border-glass text-text-secondary hover:bg-green-500 hover:border-green-500 hover:text-white hover:-translate-y-0.5"
                  }`}
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              <div className="absolute top-full right-1/2 translate-x-1/2 mt-2.5 px-3 py-1.5 bg-slate-900 text-white text-[0.7rem] font-bold rounded-lg opacity-0 pointer-events-none group-hover/whatsapp:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md z-50">
                Chat on WhatsApp
              </div>
            </div>

            <Link
              href="/#contact"
              onClick={(e) => handleNavigation(e, "/#contact")}
              className="bg-brand-orange text-white px-6 py-2.5 rounded-full text-[0.9rem] font-semibold transition-all duration-300 hover:bg-brand-orange-light hover:-translate-y-0.5 shadow-sm active:translate-y-0 select-none cursor-pointer"
            >
              Get Quote
            </Link>
          </div>

          {/* Hamburger Menu Toggle Button (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            suppressHydrationWarning
            className={`lg:hidden p-2 rounded-xl transition duration-300 cursor-pointer ${isScrolled
              ? "bg-black/5 text-slate-800 border border-black/10 hover:bg-black/10"
              : "bg-white/5 text-white border border-border-glass hover:bg-white/10"
              }`}
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6 shrink-0" />
          </button>
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[9998] transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-[#120e0b]/95 backdrop-blur-xl border-l border-white/10 z-[9999] p-6 flex flex-col gap-8 transform transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center">
          <Link href="/" onClick={() => { setMobileMenuOpen(false); setCurrentHash(""); }}>
            <img
              src="/images/logo.png"
              alt="SHIVSHAKTI Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Mobile Menu"
            className="text-text-secondary hover:text-white p-2 rounded-full border border-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Links Accordions */}
        <nav className="flex flex-col gap-6" aria-label="Mobile Navigation">
          <Link
            href="/"
            onClick={(e) => handleNavigation(e, "/")}
            className={`text-[1.1rem] font-medium transition duration-200 ${isHomeActive ? "text-brand-orange" : "text-text-secondary hover:text-white"
              }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={(e) => handleNavigation(e, "/about")}
            className={`text-[1.1rem] font-medium transition duration-200 ${isAboutActive ? "text-brand-orange" : "text-text-secondary hover:text-white"
              }`}
          >
            About
          </Link>

          {/* Products Accordion trigger */}
          <Link
            href="/products"
            onClick={(e) => handleNavigation(e, "/products")}
            className={`text-[1.1rem] font-medium transition duration-200 ${isProductsActive ? "text-brand-orange" : "text-text-secondary hover:text-white"
              }`}
          >
            Products
          </Link>

          <Link
            href="/gallery"
            onClick={(e) => handleNavigation(e, "/gallery")}
            className={`text-[1.1rem] font-medium transition duration-200 ${isGalleryActive ? "text-brand-orange" : "text-text-secondary hover:text-white"
              }`}
          >
            Gallery
          </Link>

          <Link
            href="/blog"
            onClick={(e) => handleNavigation(e, "/blog")}
            className={`text-[1.1rem] font-medium transition duration-200 ${pathname.startsWith("/blog") ? "text-brand-orange" : "text-text-secondary hover:text-white"
              }`}
          >
            Blog
          </Link>

          <Link
            href="/#contact"
            onClick={(e) => handleNavigation(e, "/#contact")}
            className={`text-[1.1rem] font-medium transition duration-200 ${isContactActive ? "text-brand-orange" : "text-text-secondary hover:text-white"
              }`}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile CTA */}
        <div className="mt-auto flex flex-col gap-4">
          <Link
            href="/#contact"
            onClick={(e) => handleNavigation(e, "/#contact")}
            className="bg-brand-orange text-white py-3.5 rounded-full text-center text-[1rem] font-bold uppercase tracking-wider hover:bg-brand-orange-light shadow-md transition-all cursor-pointer"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </>
  );
}

export default Header;
