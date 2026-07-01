"use client";

import React from "react";
import CompanyIntro from "./components/CompanyIntro";
import CompanyStats from "./components/CompanyStats";
import ManufacturingExcellence from "./components/ManufacturingExcellence";
import ProductsAndCapacity from "./components/ProductsAndCapacity";
import CoreStrengths from "./components/CoreStrengths/CoreStrengths";
import Timeline from "./components/Timeline/Timeline";
import MissionVision from "./components/MissionVision";
import Directors from "./components/Directors";
import SummaryAndCTA from "./components/SummaryAndCTA";

/**
 * About root feature component representing the redesigned ShivShakti About page.
 */
export const About = () => {
  return (
    <section
      id="about"
      className="bg-transparent text-text-light-primary pl-4 pr-12 md:pl-8 md:pr-16 lg:px-8 py-16 flex flex-col gap-12 md:gap-16 max-w-[1300px] mx-auto relative select-none"
    >
      <CompanyIntro />
      <CompanyStats />
      <ManufacturingExcellence />
      <ProductsAndCapacity />
      <Directors />
      <Timeline />
      <MissionVision />
      <SummaryAndCTA />
    </section>
  );
};

export default About;
