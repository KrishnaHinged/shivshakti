import React from "react";
import { capacities } from "@/features/about/constants";
import * as Icons from "@/features/about/icons";

/**
 * ProductionCapacity displays monthly manufacturing capacities and partnerships.
 */
export function ProductionCapacity() {
  return (
    <div className="lg:col-span-5 flex flex-col gap-6">
      <div className="bg-white border-[0.5px] border-slate-100 shadow-sm rounded-xl p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.2em]">
            Monthly Capacity
          </span>
          <h4 className="text-lg font-bold text-slate-900 leading-tight">
            Production at Scale
          </h4>
        </div>

        <div className="flex flex-col gap-3">
          {capacities.map((cap, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-lg border-[0.5px] border-slate-100">
              <span className="text-xs font-semibold text-slate-700">
                {cap.label}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-brand-blue">
                  {cap.value}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {cap.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-3">
          <p className="text-xs text-text-light-secondary leading-relaxed">
            Operating from a state-of-the-art 4,000 sq. meter manufacturing
            facility equipped with advanced CNC machinery and automated
            production systems.
          </p>
        </div>
      </div>

      {/* Authorized Dealer Badge */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl p-5 flex flex-col gap-4 text-white border-[0.5px] border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Icons.DealerIcon className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <p className="text-sm font-bold">Authorized Dealer</p>
            <p className="text-[10px] text-slate-400">South Gujarat Region</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 pl-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            <span className="text-xs text-slate-300">
              Usha Martin Wire Ropes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" style={{ background: "#3B5FBB" }} />
            <span className="text-xs text-slate-300">
              Torin Drive Machine
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductionCapacity;
