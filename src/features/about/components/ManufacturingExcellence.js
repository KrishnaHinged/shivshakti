import React from "react";
import Image from "next/image";
import { AnimatedSection } from "@/shared/animations";

/**
 * ManufacturingExcellence component outlining the factory capabilities and precision machinery.
 */
export function ManufacturingExcellence() {
  return (
    <AnimatedSection className="mb-12 md:mb-[48px] relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Manufacturing copy */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <span className="text-brand-blue text-xs font-bold uppercase tracking-[0.2em] bg-brand-blue-pale px-3 py-1 rounded border border-brand-blue/10 w-fit">
            Manufacturing Excellence
          </span>
          <h3 className="text-3xl md:text-4xl font-bold leading-[1.1] text-slate-900 tracking-tight">
            Precision Engineering & Material Integrity
          </h3>
          <p className="text-sm text-text-light-secondary leading-relaxed mt-1">
            At ShivShakti, we operate under a rigorous manufacturing philosophy. Every elevator cabin, car frame, and automatic door assembly undergoes strict stress-testing and alignment procedures. Using highly advanced CNC systems, fiber lasers, and robotic sheet metal folding equipment, we maintain spatial tolerances within micro-millimeters, ensuring perfect fitments, structural reliability, and long-term durability in B2B environments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-800">Advanced Fiber Laser Cutting</span>
                <p className="text-[11px] text-text-light-secondary mt-0.5">High-speed processing with dimensional precision up to ±0.05mm.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-800">Multi-Axis Bending & Folding</span>
                <p className="text-[11px] text-text-light-secondary mt-0.5">Hydraulic press brakes calculate structural lines with extreme consistency.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-800">Heavy-Duty MIG/TIG Welding</span>
                <p className="text-[11px] text-text-light-secondary mt-0.5">Certified high-tensile structural welds tested under dynamic weight shifts.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-800">Automated Finishing & Coating</span>
                <p className="text-[11px] text-text-light-secondary mt-0.5">Automated powder line layers protect metals from rust and ambient humidity.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Premium close-up photo frame */}
        <div className="lg:col-span-5 relative group">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] border-[0.5px] border-slate-200">
            <div className="aspect-[4/3] relative">
              <Image
                src="/images/factory_cnc.jpeg"
                alt="High precision CNC Laser Cutting & Material Processing inside ShivShakti Surat Factory"
                fill
                className="object-cover transition-transform duration-150 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 z-10">
                <p className="text-white text-xs font-bold uppercase tracking-wider">Surat Headquarters</p>
                <p className="text-white/80 text-[10px] mt-0.5">Advanced CNC Bending & Laser Floor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default ManufacturingExcellence;
