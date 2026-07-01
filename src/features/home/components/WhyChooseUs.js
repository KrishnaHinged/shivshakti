"use client";

import React from "react";
import { whyChooseUsCards } from "../constants/whyChooseUs";
import * as Icons from "@/shared/icons/Icons";

const iconMap = {
  factory: Icons.FactoryIcon,
  shield: Icons.ShieldCheckIcon,
  location: Icons.LocationIcon,
  clock: Icons.ClockIcon,
  certificate: Icons.CertificateIcon,
  handshake: Icons.HandshakeIcon,
};

/**
 * WhyChooseUs section detailing the core corporate advantages on the homepage.
 */
export function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-transparent text-text-light-primary pb-12 pt-8">
      {/* Centered Section Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="text-brand-orange text-[0.85rem] font-bold uppercase tracking-[0.2em] block mb-2">Why Choose Us</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-light-primary tracking-tight">
          Built Different. Delivered Better.
        </h2>
      </div>

      {/* Grid of Rounded Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {whyChooseUsCards.map((card, idx) => {
          const IconComponent = iconMap[card.iconKey];
          return (
            <div
              key={idx}
              className={`bg-white border border-slate-100 rounded-[1.8rem] md:rounded-[2.2rem] p-8 transition-all duration-300 hover:-translate-y-1.5 ${card.shadowClass} group`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${card.bgClass} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                {IconComponent ? <IconComponent /> : null}
              </div>
              <h3 className="text-[1.25rem] font-bold text-text-light-primary mb-3">{card.title}</h3>
              <p className="text-[0.92rem] text-text-light-secondary leading-relaxed">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WhyChooseUs;
