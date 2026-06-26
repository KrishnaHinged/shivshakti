import React from "react";
import { AnimatedSection } from "@/shared/animations";
import ProductPortfolio from "./ProductPortfolio";
import ProductionCapacity from "./ProductionCapacity";

/**
 * ProductsAndCapacity component combining ProductPortfolio and ProductionCapacity side-by-side.
 */
export function ProductsAndCapacity() {
  return (
    <AnimatedSection delay={0.1} className="mb-12 md:mb-[48px] relative">
      {/* Subtle background dots pattern overlay on visual zone */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.06] -z-10 rounded-2xl" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <ProductPortfolio />
        <ProductionCapacity />
      </div>
    </AnimatedSection>
  );
}

export default ProductsAndCapacity;
