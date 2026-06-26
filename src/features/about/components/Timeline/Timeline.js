import React from "react";
import { milestones } from "@/features/about/constants";
import TimelineItem from "./TimelineItem";

/**
 * Timeline component orchestrating the key milestones list.
 */
export function Timeline() {
  return (
    <section className="mb-16 md:mb-[64px] relative bg-[#FAF9F6]/20 p-5 rounded-2xl border-[0.5px] border-slate-100">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-brand-orange text-xs font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-3 py-1 rounded border border-brand-orange/10 w-fit">
            Our Journey
          </span>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 leading-[1.1]">
            Key Corporate Milestones
          </h3>
        </div>

        <div className="relative ml-3 pl-2 py-2">
          {/* Timeline left border: Slightly thicker (1.2px), subtle gradient */}
          <div className="absolute left-[11px] top-2 bottom-2 w-[1.2px] bg-gradient-to-b from-brand-blue to-brand-orange" />

          <div className="flex flex-col gap-8">
            {milestones.map((item, idx) => (
              <TimelineItem key={idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Timeline;
