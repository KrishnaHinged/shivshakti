import React from "react";
import Link from "next/link";
import { AnimatedSection } from "@/shared/animations";

/**
 * SummaryAndCTA component displaying the final textual summary and a call-to-action block.
 */
export function SummaryAndCTA() {
  return (
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
  );
}

export default SummaryAndCTA;
