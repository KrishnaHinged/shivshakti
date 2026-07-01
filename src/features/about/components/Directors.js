"use client";

import React from "react";
import Image from "next/image";
import { AnimatedSection } from "@/shared/animations";

const directors = [
  {
    id: 1,
    name: "⁠Chetan Siddhapura ",
    role: "Director",
    image: "/images/director-2.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 2,
    name: "Dharmesh Siddhapura ",
    role: "Director",
    image: "/images/director-3.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 3,
    name: "Devarsh Siddhapura",
    role: "Director",
    image: "/images/director-1.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

export function Directors() {
  return (
    <section className="mb-16 md:mb-[64px] relative">
      <div className="flex flex-col gap-12">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <span className="text-brand-orange text-xs font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-3 py-1 rounded border border-brand-orange/10 w-fit">
            Leadership
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1 leading-[1.1]">
            Our Directors
          </h3>
          <p className="text-sm text-text-light-secondary max-w-2xl mt-1">
            Meet the visionary leadership guiding ShivShakti Elevator Components toward quality, innovation, and long-term customer partnership.
          </p>
        </div>

        {/* Directors List */}
        <div className="flex flex-col gap-16 md:gap-24">
          {directors.map((director, index) => {
            const isEven = index % 2 === 0;
            return (
              <AnimatedSection
                key={director.id}
                delay={index * 0.1}
                className="w-full"
              >
                <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-16 items-center w-full`}>
                  {/* Image Column */}
                  <div className="w-full lg:w-[33%] flex justify-center shrink-0">
                    <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] group border border-slate-100 hover:border-brand-blue/30 transition-all duration-300 w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none">
                      <Image
                        src={director.image}
                        alt={director.name}
                        width={400}
                        height={500}
                        className="object-cover w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 30vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Text/Description Column */}
                  <div className="w-full lg:w-[67%] flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                        {director.name}
                      </h4>
                      <p className="text-brand-blue text-sm font-semibold tracking-wide uppercase">
                        {director.role}
                      </p>
                    </div>
                    <div className="w-12 h-[2px] bg-gradient-to-r from-brand-blue to-brand-orange rounded-full" />
                    <p className="text-[0.95rem] md:text-base text-text-light-secondary leading-[1.8] italic font-normal text-justify">
                      {director.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Directors;
