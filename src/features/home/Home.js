"use client";

import React from "react";
import { Header, Footer } from "@/shared/layouts";
import Hero from "./components/Hero";
import WhyChooseUs from "./components/WhyChooseUs";
import { HomeGallery } from "@/features/gallery";
import { HomeProducts } from "@/features/products";
import { HomeTestimonials } from "@/features/testimonials";
import { ContactFormSection } from "@/features/contact";

/**
 * Home page orchestrator component assembling all visual sections of the homepage.
 */
export function Home({ products, testimonials, gallery, settings }) {
  return (
    <main className="relative isolate bg-[#F9F9FB] selection:bg-brand-orange selection:text-white min-h-screen flex flex-col">
      {/* Navigation Header — rendered at root level so z-[9999] is global */}
      <Header logoUrl={settings?.logoUrl} />

      <div className="flex flex-col gap-6 lg:gap-10 w-full">
        {/* Hero / Landing Section */}
        <Hero settings={settings} />

        {/* Gallery Section */}
        <HomeGallery gallery={gallery} />
        
        {/* Products Catalog Section */}
        <HomeProducts products={products.slice(0, 3)} />

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* Testimonials Section */}
        <HomeTestimonials testimonials={testimonials} />

        {/* Contact Form Section */}
        <ContactFormSection settings={settings} />
      </div>

      {/* Footer Section */}
      <Footer products={products} settings={settings} />
    </main>
  );
}

export default Home;
