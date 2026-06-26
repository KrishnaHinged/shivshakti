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
 * FeaturedStrength displays the main hero card of the strengths grid.
 */
export function FeaturedStrength({ strength, delay = 0 }) {
  const IconComponent = iconMap[strength.iconKey];

  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className="lg:col-span-2 lg:row-span-2 relative bg-gradient-to-r from-brand-blue-pale/80 to-brand-orange-pale/40 border-[0.5px] border-slate-200 hover:border-brand-blue/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-150 ease-out group cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:scale-[1.02]"
    >
      {/* Left border gradient accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-brand-blue to-brand-orange rounded-l-2xl" />

      <div className="flex flex-col gap-4 pl-2">
        {/* Icon container with 60x60px accent background circle */}
        <div className="w-[60px] h-[60px] rounded-xl bg-brand-blue-pale/80 flex items-center justify-center text-brand-blue relative shrink-0">
          <div className="absolute inset-0 bg-brand-blue/10 rounded-full scale-125 opacity-60" />
          {IconComponent ? <IconComponent className="w-6 h-6 transition-transform duration-150 group-hover:rotate-8" /> : null}
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-bold text-slate-900 leading-tight">
            {strength.title}
          </h4>
          <p className="text-sm text-text-light-secondary leading-relaxed">
            {strength.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeaturedStrength;
