"use client";

import React from "react";
import {
  FactoryIcon,
  ShieldCheckIcon,
  LocationIcon,
  ClockIcon,
  CertificateIcon,
  HandshakeIcon
} from "@/components/ui/Icons";

export const WhyChooseUs = () => {
  return (
    <section id="why-us" className="bg-transparent text-text-light-primary px-6 pb-12 lg:px-20 pt-8">
      
      {/* Centered Section Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="text-brand-orange text-[0.85rem] font-bold uppercase tracking-[0.2em] block mb-2">Why Choose Us</span>
        <h2 className="text-4xl lg:text-5xl font-extrabold text-text-light-primary tracking-tight">
          Built Different. Delivered Better.
        </h2>
      </div>

      {/* Grid of Rounded Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-100 rounded-[2.2rem] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(30,58,138,0.04)] hover:border-brand-blue/20 group">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-brand-blue-pale group-hover:scale-110 transition-transform duration-300 text-brand-blue shrink-0">
            <FactoryIcon />
          </div>
          <h3 className="text-[1.25rem] font-bold text-text-light-primary mb-3">40,000 Sq Ft Factory</h3>
          <p className="text-[0.92rem] text-text-light-secondary leading-relaxed">
            State-of-the-art manufacturing facility in Surat, Gujarat with dedicated divisions for each product category.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-100 rounded-[2.2rem] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(249,115,22,0.04)] hover:border-brand-orange/20 group">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-brand-orange-pale group-hover:scale-110 transition-transform duration-300 text-brand-orange shrink-0">
            <ShieldCheckIcon />
          </div>
          <h3 className="text-[1.25rem] font-bold text-text-light-primary mb-3">In-House Manufacturing</h3>
          <p className="text-[0.92rem] text-text-light-secondary leading-relaxed">
            Complete control over quality — from raw material to finished product. No outsourcing, no compromise.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-100 rounded-[2.2rem] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(30,58,138,0.04)] hover:border-brand-blue/20 group">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-brand-blue-pale group-hover:scale-110 transition-transform duration-300 text-brand-blue shrink-0">
            <LocationIcon />
          </div>
          <h3 className="text-[1.25rem] font-bold text-text-light-primary mb-3">Pan India Presence</h3>
          <p className="text-[0.92rem] text-text-light-secondary leading-relaxed">
            Head office in Surat with branches in Indore and Lucknow to serve clients across India efficiently.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-100 rounded-[2.2rem] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(249,115,22,0.04)] hover:border-brand-orange/20 group">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-brand-orange-pale group-hover:scale-110 transition-transform duration-300 text-brand-orange shrink-0">
            <ClockIcon />
          </div>
          <h3 className="text-[1.25rem] font-bold text-text-light-primary mb-3">Cabin in 7 Days</h3>
          <p className="text-[0.92rem] text-text-light-secondary leading-relaxed">
            Fast turnaround — elevator cabins delivered within 7 working days. Auto doors and frames dispatched same day of order.
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-white border border-slate-100 rounded-[2.2rem] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(30,58,138,0.04)] hover:border-brand-blue/20 group">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-brand-blue-pale group-hover:scale-110 transition-transform duration-300 text-brand-blue shrink-0">
            <CertificateIcon />
          </div>
          <h3 className="text-[1.25rem] font-bold text-text-light-primary mb-3">Authorized Dealer</h3>
          <p className="text-[0.92rem] text-text-light-secondary leading-relaxed">
            Official authorized dealer for Usha Martin — the world&apos;s No. 1 wire rope brand trusted globally.
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-white border border-slate-100 rounded-[2.2rem] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(249,115,22,0.04)] hover:border-brand-orange/20 group">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-brand-orange-pale group-hover:scale-110 transition-transform duration-300 text-brand-orange shrink-0">
            <HandshakeIcon />
          </div>
          <h3 className="text-[1.25rem] font-bold text-text-light-primary mb-3">Work With Honesty</h3>
          <p className="text-[0.92rem] text-text-light-secondary leading-relaxed">
            Our founding principle. We deliver exactly what we promise — on specification, on time, every time.
          </p>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
