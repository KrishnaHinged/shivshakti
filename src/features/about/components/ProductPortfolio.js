import React from "react";
import * as Icons from "@/features/about/icons";

/**
 * ProductPortfolio renders the staggered product grid and the latest innovation highlights.
 */
export function ProductPortfolio() {
  return (
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

      {/* Product Innovation Video Showcase */}
      <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-slate-100 group aspect-[16/9] w-full bg-slate-950">
        <video
          src="/center-opening-door.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />
        {/* Subtle Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
        
        {/* Video Caption */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
          <div>
            <p className="text-white text-sm font-bold leading-tight">
              Center Opening Automatic Elevator Door
            </p>
            <p className="text-white/80 text-[11px] mt-0.5">
              Precision engineering • Smooth & silent operation
            </p>
          </div>
          <div className="bg-brand-blue text-white rounded-lg px-2.5 py-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Live Demo</span>
          </div>
        </div>
      </div>

      {/* Latest Innovation Highlight */}
      <div className="bg-gradient-to-r from-brand-blue-pale/10 to-brand-orange-pale/5 border-[0.5px] border-slate-100 rounded-xl p-5 flex items-start gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center shrink-0">
          <Icons.LightningIcon className="w-5 h-5 text-white" strokeWidth={2} />
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
  );
}

export default ProductPortfolio;
