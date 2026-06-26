"use client";

import React from "react";
import { PhoneIcon, MailIcon } from "@/shared/icons/Icons";

/**
 * Locations displays branch and head office contact information cards.
 * @param {object} props
 * @param {object} props.settings - Global company settings config
 */
export function Locations({ settings }) {
  return (
    <section id="locations" className="bg-transparent text-text-light-primary px-6 py-20 lg:px-20 pt-16">
      {/* Centered Section Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="text-brand-blue text-[0.85rem] font-bold uppercase tracking-[0.2em] block mb-2">Our Offices</span>
        <h2 className="text-4xl lg:text-5xl font-extrabold text-text-light-primary tracking-tight">
          Present Across India
        </h2>
      </div>

      {/* Grid of Location Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {settings?.addresses?.map((branch, index) => (
          <div
            key={index}
            className="bg-white border border-slate-100 rounded-[2.2rem] p-8 lg:p-10 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(30,58,138,0.04)] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <span className={`text-[0.75rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block ${
                branch.badge === "Head Office" ? "bg-brand-orange text-white" : "bg-brand-blue text-white"
              }`}>
                {branch.badge || "Branch Office"}
              </span>
              <h3 className="text-[1.45rem] font-extrabold mt-5 text-text-light-primary">{branch.branchName}</h3>
              <hr className="border-slate-100 my-5" />
              <p className="text-[0.92rem] text-text-light-secondary leading-relaxed mb-6">
                {branch.addressLine}, {branch.cityState}
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              {branch.phone.split("/").map((ph, idx) => (
                <a
                  key={idx}
                  href={`tel:${ph.trim()}`}
                  className="flex items-center gap-2.5 text-[0.9rem] text-text-light-secondary hover:text-brand-orange transition duration-300 font-medium"
                >
                  <PhoneIcon className="w-4 h-4 text-brand-orange shrink-0" /> {ph.trim()}
                </a>
              ))}
              <a
                href={`mailto:${branch.email}`}
                className="flex items-center gap-2.5 text-[0.9rem] text-text-light-secondary hover:text-brand-orange transition duration-300 font-medium"
              >
                <MailIcon className="w-4 h-4 text-brand-blue shrink-0" /> {branch.email}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Locations;
