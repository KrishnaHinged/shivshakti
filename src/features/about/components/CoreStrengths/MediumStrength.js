import React from "react";
import * as Icons from "@/features/about/icons";

const iconMap = {
  experience: Icons.ExperienceIcon,
  facility: Icons.FacilityIcon,
  quality: Icons.QualityIcon,
  customers: Icons.CustomersIcon,
  solutions: Icons.SolutionsIcon,
  dealer: Icons.DealerIcon,
};

/**
 * MediumStrength displays the mid-sized cards in the strengths grid.
 */
export function MediumStrength({ strength, delay = 0 }) {
  const IconComponent = iconMap[strength.iconKey];

  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className="lg:col-span-1 lg:row-span-1 bg-white border-[0.5px] border-slate-100 hover:border-brand-orange/30 rounded-xl p-5 flex flex-col gap-3 transition-all duration-150 ease-out group cursor-pointer hover:shadow-[inset_0_0_8px_rgba(30,58,138,0.02),0_4px_12px_rgba(0,0,0,0.04)]"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
        strength.color === "brand-orange" 
          ? "bg-brand-orange-pale text-brand-orange" 
          : "bg-brand-blue-pale text-brand-blue"
      }`}>
        {IconComponent ? <IconComponent className="w-6 h-6 transition-transform duration-150 group-hover:rotate-8" /> : null}
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-base font-bold text-slate-900 leading-tight relative inline-block pb-1">
          {strength.title}
          <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-200 group-hover:w-8 ${
            strength.color === "brand-orange" ? "bg-brand-orange" : "bg-brand-blue"
          }`} />
        </h4>
        <p className="text-xs text-text-light-secondary leading-relaxed mt-1">
          {strength.desc}
        </p>
      </div>
    </div>
  );
}

export default MediumStrength;
