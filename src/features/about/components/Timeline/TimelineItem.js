import React from "react";
import { AnimatedTimelineItem } from "@/shared/animations";

/**
 * TimelineItem component rendering a single milestone.
 */
export function TimelineItem({ item, index }) {
  const isEven = index % 2 === 0;
  return (
    <AnimatedTimelineItem index={index}>
      <div className="relative flex items-center justify-start w-full group">
        {/* Timeline dot: Centered on desktop, left-aligned on mobile */}
        <div className="absolute left-[0.25rem] lg:left-1/2 top-[18px] lg:-translate-x-1/2 w-6 h-6 flex items-center justify-center bg-white rounded-full z-10 border border-slate-200">
          <div className="w-[6px] h-[6px] rounded-full bg-brand-orange transition-all duration-150 group-hover:w-[10px] group-hover:h-[10px] group-hover:bg-brand-blue ring-2 ring-transparent group-hover:ring-brand-blue/20" />
        </div>

        {/* Milestone background card: Subtle opacity behind text */}
        <div className={`w-full lg:w-[calc(50%-2rem)] bg-slate-500/[0.01] hover:bg-slate-900/[0.02] border-[0.5px] border-slate-100/50 hover:border-slate-200 rounded-xl p-4 transition-all duration-150 ease-out pl-12 lg:pl-6 ${
          isEven 
            ? "lg:mr-auto lg:ml-0 lg:text-right lg:pr-6 lg:pl-6" 
            : "lg:ml-auto lg:mr-0 lg:text-left lg:pl-6 lg:pr-6"
        }`}>
          <div className={`flex items-center gap-3 ${isEven ? "lg:flex-row-reverse" : ""}`}>
            {/* Year number: Subtle background circle */}
            <div className="w-8 h-8 rounded-full bg-brand-blue-pale flex items-center justify-center text-xs font-bold text-brand-blue shrink-0">
              {item.year}
            </div>
            <h4 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
              {item.title}
            </h4>
          </div>
          {/* Horizontal line accent under title */}
          <div className={`w-12 h-[1px] bg-brand-orange/40 mt-2 transition-all duration-300 group-hover:w-20 ${
            isEven ? "lg:ml-auto" : ""
          }`} />
          
          <p className="text-xs text-text-light-secondary leading-relaxed mt-2 pl-11 lg:pl-0">
            {item.desc}
          </p>
        </div>
      </div>
    </AnimatedTimelineItem>
  );
}

export default TimelineItem;
