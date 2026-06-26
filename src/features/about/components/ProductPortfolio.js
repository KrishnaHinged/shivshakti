import React from "react";
import { products } from "@/features/about/constants";
import * as Icons from "@/features/about/icons";

const iconMap = {
  msCabins: Icons.MsCabinsIcon,
  ssCabins: Icons.SsCabinsIcon,
  pvcCabins: Icons.PvcCabinsIcon,
  autoDoors: Icons.AutoDoorsIcon,
  imperforatedDoors: Icons.ImperforatedDoorsIcon,
  autoImperforatedDoors: Icons.AutoImperforatedDoorsIcon,
  elevatorKits: Icons.ElevatorKitsIcon,
  elevatorComponents: Icons.ElevatorComponentsIcon,
};

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

      {/* Staggered Grid Layout (not uniform) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-start">
        {products.map((product, idx) => {
          const IconComponent = iconMap[product.iconKey];
          return (
            <div
              key={idx}
              className={`relative ${product.staggerClass} ${product.bgTint} border-[0.5px] border-slate-100 hover:border-brand-blue/30 rounded-xl p-4 flex flex-col items-center gap-3 text-center transition-all duration-150 ease-out group cursor-pointer hover:shadow-[inset_0_0_8px_rgba(30,58,138,0.02),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden`}
            >
              {/* Subtle 1px accent line (top) on hover in brand color */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-blue scale-x-0 origin-left transition-transform duration-150 ease-out group-hover:scale-x-100" />
              
              {/* New badge on index 6 */}
              {product.isNew && (
                <span className="absolute top-2 right-2 bg-brand-orange text-white text-[8px] font-bold px-2 py-0.5 rounded-full select-none">
                  NEW
                </span>
              )}

              <div className={`transition-all duration-150 ease-out group-hover:text-brand-orange ${product.rotateIcon ? 'rotate-12' : ''} group-hover:rotate-12`}>
                {IconComponent ? <IconComponent className="w-8 h-8 transition-colors duration-150" /> : null}
              </div>
              <span className="text-[11px] font-bold text-slate-700 leading-tight">
                {product.name}
              </span>
            </div>
          );
        })}
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
