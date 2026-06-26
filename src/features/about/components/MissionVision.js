"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatedSection } from "@/shared/animations";
import { missionVision } from "@/features/about/constants";
import * as Icons from "@/features/about/icons";

const iconMap = {
  mission: Icons.LightningIcon,
  vision: Icons.EyeIcon,
};

/**
 * MissionVision component showcasing the company purpose, vision, and recognition.
 */
export function MissionVision() {
  const [activeTab, setActiveTab] = useState("mission");
  const currentTab = missionVision[activeTab];
  const IconComponent = iconMap[currentTab.iconKey];

  return (
    <AnimatedSection delay={0.1} className="mb-12 md:mb-[48px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Awards Image */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] group border-[0.5px] border-slate-200">
            <div className="aspect-[4/3] relative">
              <Image
                src="/images/awards-certifications.jpg"
                alt="ShivShakti Awards, Certifications and Industry Recognition"
                fill
                className="object-cover transition-transform duration-150 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 z-10">
                <p className="text-white text-sm font-bold leading-tight">
                  Awards & Recognition
                </p>
                <p className="text-white/70 text-[10px] mt-0.5">
                  Industry certifications & accolades
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Mission / Vision Tabs */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-3 py-1 rounded border border-brand-orange/10 w-fit">
              Our Purpose
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1 leading-[1.1]">
              Driven by Purpose, Built on Trust
            </h3>
          </div>

          {/* Tab Selector */}
          <div className="bg-white border-[0.5px] border-slate-100 shadow-sm rounded-xl p-5 flex flex-col gap-5">
            <div className="flex gap-2 p-1 bg-slate-50 rounded-lg border border-slate-100 relative">
              {/* Active Tab Underline Slider */}
              <div
                className="absolute bottom-1 h-[2px] bg-brand-orange transition-all duration-150 ease-out rounded-full"
                style={{
                  width: 'calc(50% - 8px)',
                  left: activeTab === 'mission' ? '4px' : 'calc(50% + 4px)'
                }}
              />

              {Object.keys(missionVision).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer relative z-10 ${
                    activeTab === key
                      ? "text-slate-900 font-extrabold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 min-h-[130px] justify-center">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg shrink-0 ${
                  activeTab === "mission"
                    ? "bg-brand-orange-pale text-brand-orange"
                    : "bg-brand-blue-pale text-brand-blue"
                }`}>
                  {IconComponent ? <IconComponent className="w-6 h-6" /> : null}
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  {currentTab.title}
                </h4>
              </div>
              <p className="text-[0.95rem] text-text-light-secondary leading-[1.7] pl-1">
                {currentTab.desc}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs text-text-light-secondary leading-relaxed">
                This philosophy drives everything we do. We are committed to
                delivering excellence through superior quality, timely service,
                and long-term customer partnerships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default MissionVision;
