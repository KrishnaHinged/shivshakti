import React from "react";
import { AnimatedTimelineItem } from "@/shared/animations";

/**
 * TimelineItem component rendering a single milestone.
 */
export function TimelineItem({ item, index }) {
  return (
    <AnimatedTimelineItem index={index}>
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
  );
}

export default TimelineItem;
