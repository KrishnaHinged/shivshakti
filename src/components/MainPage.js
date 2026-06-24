"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Products from "@/components/sections/Products";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import Locations from "@/components/sections/Locations";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function MainPage({ products, testimonials, gallery, settings }) {
  return (
    <main className="relative isolate bg-[#F9F9FB] selection:bg-brand-orange selection:text-white min-h-screen flex flex-col">
      {/* Navigation Header — rendered at root level so z-[9999] is global */}
      <Header logoUrl={settings?.logoUrl} />

      <div className="flex flex-col gap-6 lg:gap-10 w-full">
        {/* Hero / Landing Section */}
        <Hero settings={settings} />

        {/* Gallery Section */}
        <Gallery gallery={gallery} />
        
        {/* Products Catalog Section */}
        <Products products={products.slice(0, 3)} />

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* Testimonials Section */}
        <Testimonials testimonials={testimonials} />

        {/* Contact Form Section */}
        <Contact settings={settings} />
      </div>

      {/* Footer Section */}
      <Footer products={products} settings={settings} />
    </main>
  );
}
