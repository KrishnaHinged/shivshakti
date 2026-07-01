import React from "react";
import Counter from "@/shared/ui/Counter/Counter";
import { AnimatedSection } from "@/shared/animations";

/**
 * CompanyStats component displaying key numeric achievements with counters.
 */
export function CompanyStats() {
  return (
    <AnimatedSection delay={0.1} className="mb-12 md:mb-[48px]">
      {/* Stats section: Add top accent line */}
      <div className="relative w-full h-[1px] bg-gradient-to-r from-brand-blue/30 via-brand-orange/30 to-transparent mb-6" />

      <div className="bg-[#0F172A] rounded-2xl p-6 md:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.25)] border-[0.5px] border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Stat 1 */}
          <div className="flex flex-col gap-1 text-left relative md:pr-6 border-b md:border-b-0 md:border-r border-brand-blue/30 pb-6 md:pb-0">
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

          {/* Stat 2 */}
          <div className="flex flex-col gap-1 text-left relative lg:pr-6 border-b md:border-b-0 lg:border-r border-brand-orange/30 pb-6 md:pb-0">
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

          {/* Stat 3 */}
          <div className="flex flex-col gap-1 text-left relative md:pr-6 border-b md:border-b-0 md:border-r lg:border-r-0 border-brand-blue/30 pb-6 md:pb-0">
            <span className="text-4xl md:text-5xl font-extrabold text-white leading-none tracking-tight tabular-nums font-mono">
              85,000+
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
              Auto Doors Installed
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              Supplied in last four years
            </span>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col gap-1 text-left relative">
            <span className="text-4xl md:text-5xl font-extrabold text-brand-orange leading-none tracking-tight tabular-nums font-mono">
              <Counter value={1500} />+
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
              Satisfied Customers
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              Nationwide B2B clientele
            </span>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default CompanyStats;
