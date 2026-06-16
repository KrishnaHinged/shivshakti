"use client";

import React from "react";
import Counter from "@/components/ui/Counter";

export const About = () => {
  return (
    <section id="about" className="bg-transparent text-text-light-primary px-6 py-20 lg:py-32 lg:px-20 flex flex-col gap-20 relative">
      
      {/* 1. Header & Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-6 flex flex-col gap-5">
          <span className="text-brand-orange text-xs font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-4 py-1.5 rounded-full w-fit">
            About Shivshakti
          </span>
          <h2 className="text-4xl lg:text-[2.8rem] font-extrabold leading-[1.15] text-text-light-primary tracking-tight">
            Redefining Elevator Components Through Precision Engineering
          </h2>
        </div>
        <div className="lg:col-span-6 flex flex-col gap-6 text-[1.05rem] text-text-light-secondary leading-[1.75]">
          <p>
            Shivshakti Elevator Components Pvt. Ltd. is a premier manufacturer of heavy-duty elevator cabins, automatic doors, car frames, and associated elevator components. Headquartered in Surat with a state-of-the-art 40,000 sq ft facility, we deliver customized structural solutions that comply with rigorous safety standards across India.
          </p>
          <p className="font-semibold text-text-light-primary border-l-2 border-brand-orange pl-4 italic">
            "Our ultimate commitment is simple: We deliver promised specifications, engineering safety and trust into every weld."
          </p>
        </div>
      </div>

      {/* 2. Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Card 1: Quality of Product */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.015)] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(30,58,138,0.05)] hover:-translate-y-1.5 flex flex-col gap-5 group">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue-pale flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-[1.25rem] font-bold text-text-light-primary group-hover:text-brand-blue transition-colors duration-300">Quality of Product</h3>
            <p className="text-sm text-text-light-secondary leading-relaxed">
              We employ automated laser cutting, precise bending, and high-tensile materials to verify structural loads and finish quality on every cabin component.
            </p>
          </div>
        </div>

        {/* Card 2: Advanced Safety */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.015)] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(30,58,138,0.05)] hover:-translate-y-1.5 flex flex-col gap-5 group">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange-pale flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-[1.25rem] font-bold text-text-light-primary group-hover:text-brand-orange transition-colors duration-300">Safety &amp; Compliance</h3>
            <p className="text-sm text-text-light-secondary leading-relaxed">
              All structural components, car frames, and door systems are built with fire-retardant parts and comply with standard elevator load rules.
            </p>
          </div>
        </div>

        {/* Card 3: Pan India Delivery */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.015)] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(30,58,138,0.05)] hover:-translate-y-1.5 flex flex-col gap-5 group">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue-pale flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-[1.25rem] font-bold text-text-light-primary group-hover:text-brand-blue transition-colors duration-300">Pan India Delivery</h3>
            <p className="text-sm text-text-light-secondary leading-relaxed">
              With branch operations in Indore and Lucknow, we guarantee swift dispatch, logistics support, and reliable steel certifications across the country.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Callout Card & Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-4">
        
        {/* Left Side: Dynamic Stats Panel */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200/60 rounded-3xl p-8 md:p-10 flex flex-col justify-center gap-8 shadow-sm">
          <div className="grid grid-cols-2 gap-8 text-center sm:text-left">
            {/* Stat 1 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[2.2rem] md:text-[2.8rem] font-extrabold text-brand-blue leading-none">
                <Counter value={40000} />
              </span>
              <span className="text-[0.75rem] font-bold text-text-light-secondary uppercase tracking-wider">Sq Ft Factory</span>
              <span className="text-xs text-text-light-secondary/80">State-of-the-art CNC setups</span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[2.2rem] md:text-[2.8rem] font-extrabold text-brand-orange leading-none">
                <Counter value={500} />+
              </span>
              <span className="text-[0.75rem] font-bold text-text-light-secondary uppercase tracking-wider">Active Clients</span>
              <span className="text-xs text-text-light-secondary/80">Elevator companies & builders</span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[2.2rem] md:text-[2.8rem] font-extrabold text-brand-blue leading-none">
                <Counter value={3} />
              </span>
              <span className="text-[0.75rem] font-bold text-text-light-secondary uppercase tracking-wider">Offices & Branches</span>
              <span className="text-xs text-text-light-secondary/80">Surat, Indore & Lucknow</span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[2.2rem] md:text-[2.8rem] font-extrabold text-brand-orange leading-none">
                100%
              </span>
              <span className="text-[0.75rem] font-bold text-text-light-secondary uppercase tracking-wider">In-House Quality</span>
              <span className="text-xs text-text-light-secondary/80">End-to-end component assurance</span>
            </div>
          </div>
        </div>

        {/* Right Side: High Impact CTA Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0a1128] to-[#1e3a8a] text-white rounded-3xl p-8 md:p-10 flex flex-col justify-between gap-8 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl group-hover:bg-brand-orange/20 transition-all duration-500" />
          <div className="flex flex-col gap-4 relative z-10">
            <h3 className="text-[1.8rem] font-bold leading-tight">
              Let's engineer something extraordinary
            </h3>
            <p className="text-sm text-text-secondary leading-[1.6]">
              From custom cabin designs to automatic doors and car frames, our manufacturing team coordinates directly with your project managers to deliver precision elevator components.
            </p>
          </div>
          <a
            href="#contact"
            className="bg-brand-orange text-white px-8 py-3.5 rounded-full text-[0.95rem] font-bold transition-all duration-300 hover:bg-brand-orange-light hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg w-fit text-center relative z-10 select-none"
          >
            Request a Quote
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
