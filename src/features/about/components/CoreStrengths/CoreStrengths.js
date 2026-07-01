import React from "react";
import { AnimatedSection } from "@/shared/animations";
import { coreStrengths } from "@/features/about/constants";
import FeaturedStrength from "./FeaturedStrength";
import MediumStrength from "./MediumStrength";
import SmallStrength from "./SmallStrength";

/**
 * CoreStrengths section displaying the asymmetric grid layout of key value propositions.
 */
export function CoreStrengths() {
  // Map strengths by index to match visual order and exact layout
  const featured = coreStrengths[0];
  const medium1 = coreStrengths[1];
  const medium2 = coreStrengths[2];
  const small1 = coreStrengths[3];
  const small2 = coreStrengths[4];
  const small3 = coreStrengths[5];

  return (
    <AnimatedSection delay={0.1} className="mb-12 md:mb-[48px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center max-w-2xl mx-auto">
          <span className="text-brand-blue text-xs font-bold uppercase tracking-[0.2em] bg-brand-blue-pale px-3 py-1 rounded border border-brand-blue/10 w-fit mx-auto">
            Why ShivShakti
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1 leading-[1.1]">
            Core Strengths
          </h3>
          <p className="text-sm text-text-light-secondary">
            What makes us India&apos;s trusted elevator component partner.
          </p>
        </div>

        {/* Core Strengths Grid: 1 Featured + 2 Medium + 3 Small card layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 gap-4 auto-rows-auto">
          {/* Featured Card (Top-left, spans 2 rows & 2 cols) */}
          <FeaturedStrength strength={featured} delay={0} />

          {/* Medium Card 1 (Top-right) */}
          <MediumStrength strength={medium1} delay={80} />

          {/* Small Card 1 (Middle-right) */}
          <SmallStrength strength={small1} delay={160} />

          {/* Medium Card 2 (Bottom-left) */}
          <MediumStrength strength={medium2} delay={240} />

          {/* Small Card 2 (Bottom-middle) */}
          <SmallStrength strength={small2} delay={320} />

          {/* Small Card 3 (Bottom-right) */}
          <SmallStrength strength={small3} delay={400} />
        </div>
      </div>
    </AnimatedSection>
  );
}

export default CoreStrengths;
