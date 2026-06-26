"use client";

import React from "react";

export const Hero = ({ settings }) => {
  return (
    <div className="w-full px-4 lg:px-8 pt-24 lg:pt-28 pb-4 bg-transparent">

      {/* Highly Rounded Hero Block Container */}
      <div id="home" className="relative w-full rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden bg-neutral-950 min-h-[70vh] lg:min-h-[80vh] flex flex-col items-center justify-center text-center p-8 lg:p-16 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">

        {/* Background Image & Radial Glow Overlay */}
        <div className="absolute inset-0 bg-[url('/images/hero.jpeg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,11,9,0.3)_0%,rgba(15,11,9,0.85)_100%)] z-10" />

        {/* Content Details */}
        <div className="relative z-20 max-w-[54rem] mx-auto flex flex-col items-center justify-center gap-6 py-10">
          <span className="text-brand-orange text-[0.82rem] font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-4 py-1.5 rounded-full border border-brand-orange/20 select-none">
            {settings.companyName || "Shivshakti Elevator Components"}
          </span>

          <h1 className="text-4xl lg:text-[4.2rem] font-extrabold leading-[1.12] tracking-tight text-white max-w-4xl font-sans">
            Work with Honesty <span className="italic text-brand-blue font-medium  font-serif">SHIV</span><span className="italic text-brand-orange font-medium font-serif">SHAKTI</span>
          </h1>

          <p className="text-[1rem] lg:text-[1.2rem] font-normal text-text-secondary max-w-[36rem] leading-[1.6] opacity-90">
            India&apos;s trusted manufacturer of premium elevator cabins, automatic doors, and elevator components. Engineered in Surat. Delivered across India.
          </p>

          <a
            href="#catalog"
            className="mt-4 bg-white text-slate-900 px-8 py-4 rounded-full text-[1rem] font-bold transition-all duration-300 hover:bg-slate-100 hover:scale-105 active:scale-100 shadow-[0_8px_30px_rgba(255,255,255,0.08)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.2)] select-none cursor-pointer"
          >
            Explore Products
          </a>
        </div>

      </div>
    </div>
  );
};

export default Hero;
