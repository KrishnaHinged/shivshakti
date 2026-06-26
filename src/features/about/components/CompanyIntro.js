import React from "react";
import Image from "next/image";
import { AnimatedSection } from "@/shared/animations";
import { QuotationMarkIcon } from "@/features/about/icons";

/**
 * CompanyIntro component displaying the introductory narrative and values.
 */
export function CompanyIntro() {
  return (
    <AnimatedSection className="mb-12 md:mb-[48px]">
      {/* Top of intro section: 2px solid brand-blue, aligned left, 200px wide only */}
      <div className="w-[200px] h-[2px] bg-brand-blue mb-8 rounded-full" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Text */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-3 py-1 rounded-full border border-brand-orange/15 w-fit mb-1">
              Established 1998
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-[1.1] text-slate-900 tracking-tight">
              Behind Every Elevator: India&apos;s Premier <span className="text-brand-blue">Elevator Component</span> Solutions
            </h2>
          </div>

          <p className="text-[0.95rem] md:text-base text-text-light-secondary leading-[1.7] mt-1">
            Established in 1998, ShivShakti Elevator Components Pvt. Ltd. is one
            of India&apos;s leading manufacturers and suppliers of elevator components,
            recognized for quality, innovation, and reliability in the vertical
            transportation industry. As pioneers in elevator door and cabin
            manufacturing, we have built a strong reputation for delivering
            precision-engineered products that meet the highest standards of
            safety, performance, and durability.
          </p>

          {/* Guiding Principle Quote Box */}
          <div className="relative bg-gradient-to-r from-brand-blue-pale/20 to-white/95 border-[0.5px] border-slate-100 rounded-xl p-5 mt-2 overflow-hidden shadow-sm">
            {/* Left border gradient (orange -> blue), 4px thick */}
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-brand-orange to-brand-blue rounded-full" />
            
            {/* Quotation mark icon (SVG) in top-right corner (16px, 10% opacity) */}
            <QuotationMarkIcon className="absolute right-4 top-4 w-6 h-6 text-slate-900 opacity-[0.08]" />

            <div className="pl-4">
              <p className="text-lg md:text-xl font-bold text-slate-900 italic leading-snug">
                &quot;Work with Honesty.&quot;
              </p>
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                Our guiding principle that drives everything we do — delivering
                excellence through superior quality, timely service, and
                long-term customer partnerships.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Factory Image */}
        <div className="lg:col-span-6">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] group border-[0.5px] border-brand-blue/20 hover:border-brand-orange transition-colors duration-150 ease-out">
            <div className="aspect-[4/3] relative">
              <Image
                src="/images/factory-exterior.jpg"
                alt="ShivShakti Elevator Components Manufacturing Facility in Surat, Gujarat"
                fill
                className="object-cover transition-transform duration-150 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                <div>
                  <p className="text-white text-sm font-bold leading-tight">
                    Manufacturing Facility
                  </p>
                  <p className="text-white/80 text-[11px] mt-0.5">
                    4,000 sq. meter • Surat, Gujarat
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-2.5 py-1">
                  <p className="text-white text-[10px] font-bold">Since 1998</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default CompanyIntro;
