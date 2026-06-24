"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/ui/ProductImage";

export const Products = ({ products }) => {
  const router = useRouter();

  // Pre-fetch route for elevator transit smooth loading
  useEffect(() => {
    router.prefetch("/products");
  }, [router]);

  const handleViewAllClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("trigger-elevator-transition", {
        detail: { targetUrl: "/products" },
      })
    );
  };

  return (
    <section id="catalog" className="bg-transparent text-text-light-primary px-6 pb-10 lg:px-20 pt-6">

      {/* Section Header */}
      <div className="text-left mb-16">
        <span className="text-brand-blue text-[0.85rem] font-bold uppercase tracking-[0.2em] block mb-2">Portfolio</span>
        <h2 className="text-4xl lg:text-5xl font-extrabold text-text-light-primary tracking-tight">Featured Products</h2>
      </div>

      {/* Grid of Rounded Cards with Full Image Backgrounds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
        {products.map((product) => {
          const categoryLabel = product.category === "in-house"
            ? "IN-HOUSE"
            : product.category === "trading"
              ? "TRADING"
              : "AUTHORIZED";

          return (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="relative w-full aspect-square rounded-[2.2rem] overflow-hidden border border-white/10 flex flex-col justify-end transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 group text-white"
            >
              {/* Product Background Image */}
              <div className="absolute inset-0 z-0">
                <ProductImage
                  src={product.featuredImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              {/* Premium Bluish Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128]/95 via-[#0a1128]/45 to-transparent z-10 transition-opacity duration-300 group-hover:via-[#0a1128]/55" />

              {/* Glassmorphic Pill Badge */}
              {product.badge && (
                <span className="absolute top-6 right-6 px-5 py-2.5 rounded-full backdrop-blur-md bg-white/15 border border-white/20 text-white font-extrabold text-[0.7rem] tracking-wider uppercase shadow-md z-20">
                  {product.badge}
                </span>
              )}

              {/* Text Content overlay at bottom */}
              <div className="relative z-20 p-8 flex flex-col gap-1 text-left">
                <h3 className="text-2xl font-extrabold tracking-wide uppercase text-white mb-0.5">
                  {categoryLabel}
                </h3>
                <p className="text-[1rem] font-medium text-white/90">
                  {product.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Centered CTA Pill Button */}
      <div className="flex justify-center mt-16">
        <Link
          href="/products"
          onClick={handleViewAllClick}
          className="bg-[#0a1128] text-white hover:bg-black px-8 py-4 rounded-full text-[1rem] font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
        >
          View All Products
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default Products;
