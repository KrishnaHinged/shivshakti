"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Counter from "@/components/ui/Counter";

/* ───────────────────────── Intersection Observer Hook ───────────────────────── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

/* ───────────────────────── Animated Section Wrapper ───────────────────────── */
function AnimatedSection({ children, className = "", delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        filter: inView ? "blur(0px)" : "blur(4px)",
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, filter 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────── Animated Timeline Item Wrapper ───────────────────────── */
function AnimatedTimelineItem({ children, index }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className="relative group pl-10 transition-all duration-300"
      style={{
        opacity: inView ? 1 : 0,
        filter: inView ? "blur(0px)" : "blur(4px)",
        transform: inView ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s, filter 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ABOUT COMPONENT — ShivShakti Elevator Components Pvt. Ltd.
   ═══════════════════════════════════════════════════════════════════════════════ */
export const About = () => {
  const [activeTab, setActiveTab] = useState("mission");

  /* ── Core strengths data ── */
  const coreStrengths = [
    {
      icon: (
        <svg className="w-6 h-6 transition-transform duration-150 group-hover:rotate-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "20+ Years of Experience",
      desc: "Pioneering in elevator door and cabin manufacturing since 1998.",
      color: "brand-blue",
      isFeatured: true,
    },
    {
      icon: (
        <svg className="w-6 h-6 transition-transform duration-150 group-hover:rotate-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "4,000 Sq.m Manufacturing",
      desc: "State-of-the-art facility with advanced CNC machinery and automated production systems.",
      color: "brand-orange",
      isMedium: true,
    },
    {
      icon: (
        <svg className="w-6 h-6 transition-transform duration-150 group-hover:rotate-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Quality & Innovation",
      desc: "Commitment to delivering precision-engineered products meeting highest safety standards.",
      color: "brand-blue",
      isMedium: true,
    },
    {
      icon: (
        <svg className="w-6 h-6 transition-transform duration-150 group-hover:rotate-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "1,500+ Customers",
      desc: "A trusted partner for elevator companies seeking dependable products and consistent quality.",
      color: "brand-orange",
      isSmall: true,
    },
    {
      icon: (
        <svg className="w-6 h-6 transition-transform duration-150 group-hover:rotate-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Complete Solutions",
      desc: "From cabins and auto doors to elevator kits — everything under one roof.",
      color: "brand-blue",
      isSmall: true,
    },
    {
      icon: (
        <svg className="w-6 h-6 transition-transform duration-150 group-hover:rotate-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: "Authorized Dealer",
      desc: "Authorized dealer of Usha Martin Wire Ropes & Torin Drive Machine for South Gujarat.",
      color: "brand-orange",
      isSmall: true,
    },
  ];

  /* ── Mission / Vision tabs ── */
  const tabs = {
    mission: {
      title: "Our Mission",
      desc: "To deliver world-class elevator components and solutions that enhance safety, reliability, and performance. We are committed to creating value for our customers by providing innovative elevator solutions that support their growth and success.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    vision: {
      title: "Our Vision",
      desc: "To be the most trusted and preferred elevator component manufacturer, driving innovation and excellence in the vertical transportation industry worldwide.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  };

  /* ── Product portfolio with staggered classes, visual rotations, and NEW badges ── */
  const products = [
    {
      name: "M.S. Elevator Cabins",
      staggerClass: "min-h-[135px]",
      bgTint: "bg-[#F4F8FC]",
      icon: (
        <svg className="w-8 h-8 text-brand-blue transition-colors duration-150" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18M15 3v18M4 9h16M4 15h16" />
        </svg>
      )
    },
    {
      name: "S.S. Elevator Cabins",
      staggerClass: "min-h-[148px] mt-2",
      bgTint: "bg-[#FFF9F5]",
      icon: (
        <svg className="w-8 h-8 text-slate-500 transition-colors duration-150" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-3-3M6 20l14-14M4 11h16" />
          <circle cx="8" cy="7" r="1" fill="currentColor" className="opacity-60" />
          <circle cx="16" cy="16" r="1" fill="currentColor" className="opacity-60" />
        </svg>
      )
    },
    {
      name: "PVC-Coated Cabins",
      staggerClass: "min-h-[135px]",
      bgTint: "bg-white",
      rotateIcon: true,
      icon: (
        <svg className="w-8 h-8 text-brand-orange transition-colors duration-150" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12h16M4 8h16M4 4h16" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12M8 12l4 4 4-4" />
        </svg>
      )
    },
    {
      name: "Auto Doors",
      staggerClass: "min-h-[135px]",
      bgTint: "bg-[#F4F8FC]",
      icon: (
        <svg className="w-8 h-8 text-brand-blue transition-colors duration-150" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v18M16 3v18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h2M19 12h-2M10 9l-2 3 2 3M14 9l2-3-2 3" />
        </svg>
      )
    },
    {
      name: "Imperforated Doors",
      staggerClass: "min-h-[148px] mt-2",
      bgTint: "bg-[#FFF9F5]",
      icon: (
        <svg className="w-8 h-8 text-slate-500 transition-colors duration-150" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 11h.01M9 11h.01M15 11h.01" />
          <rect x="7" y="6" width="10" height="12" rx="1" className="opacity-20" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    },
    {
      name: "Auto Imperforated Doors",
      staggerClass: "min-h-[135px]",
      bgTint: "bg-white",
      icon: (
        <svg className="w-8 h-8 text-brand-orange transition-colors duration-150" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 3v18M14 3v18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10l-2 3h3l-2 3" />
        </svg>
      )
    },
    {
      name: "Elevator Kits",
      staggerClass: "min-h-[135px]",
      bgTint: "bg-[#F4F8FC]",
      isNew: true,
      icon: (
        <svg className="w-8 h-8 text-brand-blue transition-colors duration-150" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      name: "Elevator Components",
      staggerClass: "min-h-[148px] mt-2",
      bgTint: "bg-[#FFF9F5]",
      rotateIcon: true,
      icon: (
        <svg className="w-8 h-8 text-brand-orange transition-colors duration-150" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
  ];

  /* ── Production capacity ── */
  const capacities = [
    { label: "Auto Doors", value: "2,000", unit: "/month" },
    { label: "Imperforated Doors", value: "1,200", unit: "/month" },
    { label: "Cabins", value: "200", unit: "/month" },
  ];

  /* ── Corporate Milestones Timeline ── */
  const milestones = [
    {
      year: "1998",
      title: "Corporate Inception",
      desc: "Founded ShivShakti Elevator Components with a bold vision to engineer high-durability vertical transport products.",
    },
    {
      year: "2018",
      title: "Scale Auto Door Launch",
      desc: "Successfully introduced high-performance auto doors, rapidly expanding service across South Gujarat.",
    },
    {
      year: "2022",
      title: "4,000 Sq.m Facility",
      desc: "Inaugurated our advanced manufacturing facility in Surat, equipped with modern CNC machinery and automated lines.",
    },
    {
      year: "2026",
      title: "Auto Imperforated Door",
      desc: "Introduced our latest breakthrough product, engineering the perfect synergy of automation, structural durability, and aesthetics.",
    },
  ];

  return (
    <section
      id="about"
      className="bg-transparent text-text-light-primary px-4 md:px-8 py-16 flex flex-col gap-12 md:gap-16 max-w-[1300px] mx-auto relative select-none"
    >
      {/* ═══════════════════ 1. COMPANY INTRODUCTION ═══════════════════ */}
      <AnimatedSection className="mb-12 md:mb-[48px]">
        {/* Top of intro section: 2px solid brand-blue, aligned left, 200px wide only */}
        <div className="w-[200px] h-[2px] bg-brand-blue mb-8 rounded-full" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Text */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-3 py-1 rounded-full border border-brand-orange/15 w-fit mb-1">
                Established 1998
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-[1.1] text-slate-900 tracking-tight">
                Behind Every Elevator: India&apos;s Premier <span className="text-brand-blue">Elevator Component</span> Solutions
              </h2>
            </div>

            <p className="text-[0.95rem] md:text-base text-text-light-secondary leading-[1.7] mt-1">
              Established in 1998, ShivShakti Elevator Components Pvt. Ltd. is one
              of India&apos;s leading manufacturers and suppliers of elevator components,
              recognized for quality, innovation, and reliability in the vertical
              transportation industry. As pioneers in elevator door and cabin
              manufacturing, we have built a strong reputation for delivering
              precision-engineered products that meet the highest standards of
              safety, performance, and durability.
            </p>

            {/* Guiding Principle Quote Box */}
            <div className="relative bg-gradient-to-r from-brand-blue-pale/20 to-white/95 border-[0.5px] border-slate-100 rounded-xl p-5 mt-2 overflow-hidden shadow-sm">
              {/* Left border gradient (orange -> blue), 4px thick */}
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-brand-orange to-brand-blue rounded-full" />
              
              {/* Quotation mark icon (SVG) in top-right corner (16px, 10% opacity) */}
              <svg className="absolute right-4 top-4 w-6 h-6 text-slate-900 opacity-[0.08]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.988zm-12 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              <div className="pl-4">
                <p className="text-lg md:text-xl font-bold text-slate-900 italic leading-snug">
                  &quot;Work with Honesty.&quot;
                </p>
                <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                  Our guiding principle that drives everything we do — delivering
                  excellence through superior quality, timely service, and
                  long-term customer partnerships.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Factory Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] group border-[0.5px] border-brand-blue/20 hover:border-brand-orange transition-colors duration-150 ease-out">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/factory-exterior.jpg"
                  alt="ShivShakti Elevator Components Manufacturing Facility in Surat, Gujarat"
                  fill
                  className="object-cover transition-transform duration-150 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                  <div>
                    <p className="text-white text-sm font-bold leading-tight">
                      Manufacturing Facility
                    </p>
                    <p className="text-white/80 text-[11px] mt-0.5">
                      4,000 sq. meter • Surat, Gujarat
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-2.5 py-1">
                    <p className="text-white text-[10px] font-bold">Since 1998</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>


      {/* ═══════════════════ 2. KEY STATS BANNER ═══════════════════ */}
      <AnimatedSection delay={0.1} className="mb-12 md:mb-[48px]">
        {/* Stats section: Add top accent line */}
        <div className="relative w-full h-[1px] bg-gradient-to-r from-brand-blue/30 via-brand-orange/30 to-transparent mb-6" />

        <div className="bg-[#0F172A] rounded-2xl p-6 md:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.25)] border-[0.5px] border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
            {/* Stat 1 (40% width, left-aligned) */}
            <div className="lg:col-span-4 flex flex-col gap-1 text-left relative lg:pr-8 border-b lg:border-b-0 pb-6 lg:pb-0 lg:border-r border-brand-blue/30">
              <span className="text-4xl md:text-5xl font-extrabold text-white leading-none tracking-tight tabular-nums font-mono">
                <Counter value={20} />+
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
                Years Experience
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                Industry pioneers since 1998
              </span>
            </div>

            {/* Stat 2 (40% width, left-aligned) */}
            <div className="lg:col-span-4 flex flex-col gap-1 text-left relative lg:pr-8 border-b lg:border-b-0 pb-6 lg:pb-0 lg:border-r border-brand-orange/30">
              <span className="text-4xl md:text-5xl font-extrabold text-brand-orange leading-none tracking-tight tabular-nums font-mono">
                1,50,000+
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
                Imperforated Doors
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                Supplied across India
              </span>
            </div>

            {/* Stat 3 & 4 (30% width total, right-aligned, staggered) */}
            <div className="lg:col-span-2 flex flex-col gap-6 lg:justify-end text-left lg:text-right lg:pl-4">
              <div className="flex flex-col gap-1">
                <span className="text-2xl md:text-3xl font-extrabold text-white leading-none tracking-tight tabular-nums font-mono">
                  85,000+
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  Auto Doors Installed
                </span>
              </div>
              <div className="flex flex-col gap-1 lg:mt-2">
                <span className="text-2xl md:text-3xl font-extrabold text-brand-orange leading-none tracking-tight tabular-nums font-mono">
                  <Counter value={1500} />+
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  Satisfied Customers
                </span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>


      {/* ═══════════════════ NEW: MANUFACTURING EXCELLENCE / PHILOSOPHY ═══════════════════ */}
      <AnimatedSection className="mb-12 md:mb-[48px] relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Manufacturing copy */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-brand-blue text-xs font-bold uppercase tracking-[0.2em] bg-brand-blue-pale px-3 py-1 rounded border border-brand-blue/10 w-fit">
              Manufacturing Excellence
            </span>
            <h3 className="text-3xl md:text-4xl font-bold leading-[1.1] text-slate-900 tracking-tight">
              Precision Engineering & Material Integrity
            </h3>
            <p className="text-sm text-text-light-secondary leading-relaxed mt-1">
              At ShivShakti, we operate under a rigorous manufacturing philosophy. Every elevator cabin, car frame, and automatic door assembly undergoes strict stress-testing and alignment procedures. Using highly advanced CNC systems, fiber lasers, and robotic sheet metal folding equipment, we maintain spatial tolerances within micro-millimeters, ensuring perfect fitments, structural reliability, and long-term durability in B2B environments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-800">Advanced Fiber Laser Cutting</span>
                  <p className="text-[11px] text-text-light-secondary mt-0.5">High-speed processing with dimensional precision up to ±0.05mm.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-800">Multi-Axis Bending & Folding</span>
                  <p className="text-[11px] text-text-light-secondary mt-0.5">Hydraulic press brakes calculate structural lines with extreme consistency.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-800">Heavy-Duty MIG/TIG Welding</span>
                  <p className="text-[11px] text-text-light-secondary mt-0.5">Certified high-tensile structural welds tested under dynamic weight shifts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-800">Automated Finishing & Coating</span>
                  <p className="text-[11px] text-text-light-secondary mt-0.5">Automated powder line layers protect metals from rust and ambient humidity.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Premium close-up photo frame */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] border-[0.5px] border-slate-200">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/factory_cnc.png"
                  alt="High precision CNC Laser Cutting & Material Processing inside ShivShakti Surat Factory"
                  fill
                  className="object-cover transition-transform duration-150 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                  <p className="text-white text-xs font-bold uppercase tracking-wider">Surat Headquarters</p>
                  <p className="text-white/80 text-[10px] mt-0.5">Advanced CNC Bending & Laser Floor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>


      {/* ═══════════════════ 3. PRODUCT PORTFOLIO & MANUFACTURING ═══════════════════ */}
      <AnimatedSection delay={0.1} className="mb-12 md:mb-[48px] relative">
        {/* Subtle background dots pattern overlay on visual zone */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.06] -z-10 rounded-2xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Product Portfolio in Staggered Grid */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-brand-blue text-xs font-bold uppercase tracking-[0.2em] bg-brand-blue-pale px-3 py-1 rounded border border-brand-blue/10 w-fit">
                Product Portfolio
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1 leading-[1.1]">
                Comprehensive Elevator Solutions
              </h3>
              <p className="text-sm text-text-light-secondary leading-relaxed max-w-2xl mt-1">
                Our extensive product portfolio includes M.S., S.S., and PVC-coated
                elevator cabins, auto doors, imperforated doors, elevator kits, and
                a wide range of elevator components designed to serve residential,
                commercial, and industrial projects.
              </p>
            </div>

            {/* Staggered Grid Layout (not uniform) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-start">
              {products.map((product, idx) => (
                <div
                  key={idx}
                  className={`relative ${product.staggerClass} ${product.bgTint} border-[0.5px] border-slate-100 hover:border-brand-blue/30 rounded-xl p-4 flex flex-col items-center gap-3 text-center transition-all duration-150 ease-out group cursor-pointer hover:shadow-[inset_0_0_8px_rgba(30,58,138,0.02),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden`}
                >
                  {/* Subtle 1px accent line (top) on hover in brand color */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-blue scale-x-0 origin-left transition-transform duration-150 ease-out group-hover:scale-x-100" />
                  
                  {/* New badge on index 6 */}
                  {product.isNew && (
                    <span className="absolute top-2 right-2 bg-brand-orange text-white text-[8px] font-bold px-2 py-0.5 rounded-full select-none">
                      NEW
                    </span>
                  )}

                  <div className={`transition-all duration-150 ease-out group-hover:text-brand-orange ${product.rotateIcon ? 'rotate-12' : ''} group-hover:rotate-12`}>
                    {product.icon}
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">
                    {product.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Latest Innovation Highlight */}
            <div className="bg-gradient-to-r from-brand-blue-pale/10 to-brand-orange-pale/5 border-[0.5px] border-slate-100 rounded-xl p-5 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Latest Innovation — Auto Imperforated Door
                </p>
                <p className="text-xs text-text-light-secondary mt-1 leading-relaxed">
                  Driven by continuous innovation, we are proud to introduce our
                  latest advancement — the Auto Imperforated Door, engineered to
                  deliver superior functionality, reliability, and aesthetics.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Production Capacity */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border-[0.5px] border-slate-100 shadow-sm rounded-xl p-5 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.2em]">
                  Monthly Capacity
                </span>
                <h4 className="text-lg font-bold text-slate-900 leading-tight">
                  Production at Scale
                </h4>
              </div>

              <div className="flex flex-col gap-3">
                {capacities.map((cap, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-lg border-[0.5px] border-slate-100">
                    <span className="text-xs font-semibold text-slate-700">
                      {cap.label}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-extrabold text-brand-blue">
                        {cap.value}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {cap.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-text-light-secondary leading-relaxed">
                  Operating from a state-of-the-art 4,000 sq. meter manufacturing
                  facility equipped with advanced CNC machinery and automated
                  production systems.
                </p>
              </div>
            </div>

            {/* Authorized Dealer Badge */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl p-5 flex flex-col gap-4 text-white border-[0.5px] border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold">Authorized Dealer</p>
                  <p className="text-[10px] text-slate-400">South Gujarat Region</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 pl-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  <span className="text-xs text-slate-300">
                    Usha Martin Wire Ropes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" style={{ background: "#3B5FBB" }} />
                  <span className="text-xs text-slate-300">
                    Torin Drive Machine
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>


      {/* ═══════════════════ 4. CORE STRENGTHS ═══════════════════ */}
      <AnimatedSection delay={0.1} className="mb-12 md:mb-[48px]">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center max-w-2xl mx-auto">
            <span className="text-brand-blue text-xs font-bold uppercase tracking-[0.2em] bg-brand-blue-pale px-3 py-1 rounded border border-brand-blue/10 w-fit mx-auto">
              Why ShivShakti
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1 leading-[1.1]">
              Core Strengths
            </h3>
            <p className="text-sm text-text-light-secondary">
              What makes us India&apos;s trusted elevator component partner.
            </p>
          </div>

          {/* Core Strengths Grid: 1 Large Featured + 2 Medium + 3 Small card layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-3 gap-4 auto-rows-auto">
            {/* Card 1: Featured (Top-left, spans 2 rows & 2 cols) */}
            <div
              style={{ transitionDelay: '0ms' }}
              className="lg:col-span-2 lg:row-span-2 relative bg-gradient-to-r from-brand-blue-pale/80 to-brand-orange-pale/40 border-[0.5px] border-slate-200 hover:border-brand-blue/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-150 ease-out group cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:scale-[1.02]"
            >
              {/* Left border gradient accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-brand-blue to-brand-orange rounded-l-2xl" />

              <div className="flex flex-col gap-4 pl-2">
                {/* Icon container with 60x60px accent background circle */}
                <div className="w-[60px] h-[60px] rounded-xl bg-brand-blue-pale/80 flex items-center justify-center text-brand-blue relative shrink-0">
                  <div className="absolute inset-0 bg-brand-blue/10 rounded-full scale-125 opacity-60" />
                  {coreStrengths[0].icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-bold text-slate-900 leading-tight">
                    {coreStrengths[0].title}
                  </h4>
                  <p className="text-sm text-text-light-secondary leading-relaxed">
                    {coreStrengths[0].desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Medium (Top-right) */}
            <div
              style={{ transitionDelay: '80ms' }}
              className="lg:col-span-1 lg:row-span-1 bg-white border-[0.5px] border-slate-100 hover:border-brand-orange/30 rounded-xl p-5 flex flex-col gap-3 transition-all duration-150 ease-out group cursor-pointer hover:shadow-[inset_0_0_8px_rgba(30,58,138,0.02),0_4px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-orange-pale text-brand-orange flex items-center justify-center shrink-0">
                {coreStrengths[1].icon}
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-bold text-slate-900 leading-tight relative inline-block pb-1">
                  {coreStrengths[1].title}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-orange transition-all duration-200 group-hover:w-8" />
                </h4>
                <p className="text-xs text-text-light-secondary leading-relaxed mt-1">
                  {coreStrengths[1].desc}
                </p>
              </div>
            </div>

            {/* Card 4: Small (Middle-right) */}
            <div
              style={{ transitionDelay: '160ms' }}
              className="lg:col-span-1 lg:row-span-1 bg-white border-[0.5px] border-slate-100 hover:border-brand-blue/30 rounded-xl p-4 flex flex-col gap-3 transition-all duration-150 ease-out group cursor-pointer hover:shadow-[inset_0_0_8px_rgba(30,58,138,0.02),0_4px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-blue-pale text-brand-blue flex items-center justify-center shrink-0">
                {coreStrengths[3].icon}
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight relative inline-block pb-1">
                  {coreStrengths[3].title}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-blue transition-all duration-200 group-hover:w-6" />
                </h4>
                <p className="text-[11px] text-text-light-secondary leading-relaxed mt-1">
                  {coreStrengths[3].desc}
                </p>
              </div>
            </div>

            {/* Card 3: Medium (Bottom-left) */}
            <div
              style={{ transitionDelay: '240ms' }}
              className="lg:col-span-1 lg:row-span-1 bg-white border-[0.5px] border-slate-100 hover:border-brand-blue/30 rounded-xl p-5 flex flex-col gap-3 transition-all duration-150 ease-out group cursor-pointer hover:shadow-[inset_0_0_8px_rgba(30,58,138,0.02),0_4px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-blue-pale text-brand-blue flex items-center justify-center shrink-0">
                {coreStrengths[2].icon}
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-bold text-slate-900 leading-tight relative inline-block pb-1">
                  {coreStrengths[2].title}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-blue transition-all duration-200 group-hover:w-8" />
                </h4>
                <p className="text-xs text-text-light-secondary leading-relaxed mt-1">
                  {coreStrengths[2].desc}
                </p>
              </div>
            </div>

            {/* Card 5: Small (Bottom-middle) */}
            <div
              style={{ transitionDelay: '320ms' }}
              className="lg:col-span-1 lg:row-span-1 bg-white border-[0.5px] border-slate-100 hover:border-brand-orange/30 rounded-xl p-4 flex flex-col gap-3 transition-all duration-150 ease-out group cursor-pointer hover:shadow-[inset_0_0_8px_rgba(30,58,138,0.02),0_4px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-orange-pale text-brand-orange flex items-center justify-center shrink-0">
                {coreStrengths[4].icon}
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight relative inline-block pb-1">
                  {coreStrengths[4].title}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-orange transition-all duration-200 group-hover:w-6" />
                </h4>
                <p className="text-[11px] text-text-light-secondary leading-relaxed mt-1">
                  {coreStrengths[4].desc}
                </p>
              </div>
            </div>

            {/* Card 6: Small (Bottom-right) */}
            <div
              style={{ transitionDelay: '400ms' }}
              className="lg:col-span-1 lg:row-span-1 bg-white border-[0.5px] border-slate-100 hover:border-brand-blue/30 rounded-xl p-4 flex flex-col gap-3 transition-all duration-150 ease-out group cursor-pointer hover:shadow-[inset_0_0_8px_rgba(30,58,138,0.02),0_4px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-blue-pale text-brand-blue flex items-center justify-center shrink-0">
                {coreStrengths[5].icon}
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight relative inline-block pb-1">
                  {coreStrengths[5].title}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-blue transition-all duration-200 group-hover:w-6" />
                </h4>
                <p className="text-[11px] text-text-light-secondary leading-relaxed mt-1">
                  {coreStrengths[5].desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>


      {/* ═══════════════════ 5. KEY CORPORATE MILESTONES (Timeline Section) ═══════════════════ */}
      <section className="mb-16 md:mb-[64px] relative bg-[#FAF9F6]/20 p-5 rounded-2xl border-[0.5px] border-slate-100">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-3 py-1 rounded border border-brand-orange/10 w-fit">
              Our Journey
            </span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 leading-[1.1]">
              Key Corporate Milestones
            </h3>
          </div>

          <div className="relative ml-3 pl-2 py-2">
            {/* Timeline left border: Slightly thicker (1.2px), subtle gradient */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[1.2px] bg-gradient-to-b from-brand-blue to-brand-orange" />

            <div className="flex flex-col gap-8">
              {milestones.map((item, idx) => (
                <AnimatedTimelineItem key={idx} index={idx}>
                  {/* Timeline dot: Make larger on hover (6px -> 8px) + animated stroke effect */}
                  <div className="absolute left-0 top-[18px] w-6 h-6 flex items-center justify-center bg-white rounded-full z-10 border border-slate-200">
                    <div className="w-[6px] h-[6px] rounded-full bg-brand-orange transition-all duration-150 group-hover:w-[10px] group-hover:h-[10px] group-hover:bg-brand-blue ring-2 ring-transparent group-hover:ring-brand-blue/20" />
                  </div>

                  {/* Milestone background card: Subtle opacity behind text */}
                  <div className="bg-slate-500/[0.01] hover:bg-slate-900/[0.02] border-[0.5px] border-slate-100/50 hover:border-slate-200 rounded-xl p-4 transition-all duration-150 ease-out">
                    <div className="flex items-center gap-3">
                      {/* Year number: Subtle background circle (brand-blue-pale), 24px, centered */}
                      <div className="w-8 h-8 rounded-full bg-brand-blue-pale flex items-center justify-center text-xs font-bold text-brand-blue shrink-0">
                        {item.year}
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                        {item.title}
                      </h4>
                    </div>
                    {/* Horizontal line accent under title */}
                    <div className="w-12 h-[1px] bg-brand-orange/40 mt-2 transition-all duration-300 group-hover:w-20" />
                    
                    <p className="text-xs text-text-light-secondary leading-relaxed mt-2 pl-11">
                      {item.desc}
                    </p>
                  </div>
                </AnimatedTimelineItem>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════ 6. MISSION & VISION ═══════════════════ */}
      <AnimatedSection delay={0.1} className="mb-12 md:mb-[48px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Awards Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] group border-[0.5px] border-slate-200">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/awards-certifications.jpg"
                  alt="ShivShakti Awards, Certifications and Industry Recognition"
                  fill
                  className="object-cover transition-transform duration-150 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                  <p className="text-white text-sm font-bold leading-tight">
                    Awards & Recognition
                  </p>
                  <p className="text-white/70 text-[10px] mt-0.5">
                    Industry certifications & accolades
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Mission / Vision Tabs */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-brand-orange text-xs font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-3 py-1 rounded border border-brand-orange/10 w-fit">
                Our Purpose
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1 leading-[1.1]">
                Driven by Purpose, Built on Trust
              </h3>
            </div>

            {/* Tab Selector */}
            <div className="bg-white border-[0.5px] border-slate-100 shadow-sm rounded-xl p-5 flex flex-col gap-5">
              <div className="flex gap-2 p-1 bg-slate-50 rounded-lg border border-slate-100 relative">
                {/* Active Tab Underline Slider */}
                <div
                  className="absolute bottom-1 h-[2px] bg-brand-orange transition-all duration-150 ease-out rounded-full"
                  style={{
                    width: 'calc(50% - 8px)',
                    left: activeTab === 'mission' ? '4px' : 'calc(50% + 4px)'
                  }}
                />

                {Object.keys(tabs).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer relative z-10 ${
                      activeTab === key
                        ? "text-slate-900 font-extrabold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 min-h-[130px] justify-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    activeTab === "mission"
                      ? "bg-brand-orange-pale text-brand-orange"
                      : "bg-brand-blue-pale text-brand-blue"
                  }`}>
                    {tabs[activeTab].icon}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {tabs[activeTab].title}
                  </h4>
                </div>
                <p className="text-[0.95rem] text-text-light-secondary leading-[1.7] pl-1">
                  {tabs[activeTab].desc}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-text-light-secondary leading-relaxed">
                  This philosophy drives everything we do. We are committed to
                  delivering excellence through superior quality, timely service,
                  and long-term customer partnerships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>


      {/* ═══════════════════ 7. ABOUT US SUMMARY & CTA ═══════════════════ */}
      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Summary */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-50/50 to-white border-[0.5px] border-slate-100 rounded-2xl p-6 md:p-8 flex flex-col justify-center gap-5">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-[1.1]">
              Over Two Decades of Trust & Excellence
            </h3>
            <p className="text-sm text-text-light-secondary leading-[1.7]">
              Over the past two decades, we have successfully supplied more than
              1,50,000+ imperforated doors across India and, in the last four years
              alone, introduced over 85,000+ auto doors that continue to deliver
              outstanding performance in the field. Today, with a network of 1,500+
              satisfied customers nationwide, ShivShakti Elevator Components has
              become a trusted partner for elevator companies seeking dependable
              products, consistent quality, and exceptional service.
            </p>

            {/* Key highlights row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Headquarters
                </span>
                <span className="text-sm font-bold text-slate-800">
                  Surat, Gujarat
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Facility Size
                </span>
                <span className="text-sm font-bold text-slate-800">
                  4,000 sq.m
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Established
                </span>
                <span className="text-sm font-bold text-slate-800">1998</span>
              </div>
            </div>
          </div>

          {/* Right: CTA (Solid brand-orange background, left-border-accent) */}
          <div className="lg:col-span-5 bg-[#0F1E36] border-l-4 border-brand-orange border-y-[0.5px] border-r-[0.5px] border-[#0F1E36] rounded-2xl p-6 md:p-8 flex flex-col justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col gap-3">
              <span className="text-brand-orange text-[10px] font-bold uppercase tracking-widest bg-brand-orange-pale border border-brand-orange/20 px-2.5 py-1 rounded-full w-fit">
                Partner With Us
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-[1.1] mt-1">
                Let&apos;s build the future of vertical transportation together
              </h3>
              <p className="text-xs text-slate-400 leading-[1.7] mt-2">
                From custom cabin designs to automatic doors and complete elevator
                kits, our manufacturing team coordinates directly with your project
                managers to deliver precision elevator components on time, every
                time.
              </p>
            </div>

            <Link
              href="/products"
              className="bg-brand-orange text-white text-center px-6 py-3 rounded-full text-xs font-bold transition-all duration-150 ease-out hover:bg-[#d03a02] hover:shadow-[0_4px_12px_rgba(248,69,2,0.2)] active:translate-y-[0.5px] shadow-sm w-fit cursor-pointer select-none"
            >
              Explore Our Products
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default About;
