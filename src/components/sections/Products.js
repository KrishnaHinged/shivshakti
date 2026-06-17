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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {products.map((product) => {
          return (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="relative rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden h-[380px] group shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-end text-left"
            >
              {/* Product Background Image */}
              <div className="absolute inset-0 z-0">
                <ProductImage
                  src={product.featuredImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Floating Badge */}
              {product.badge && (
                <span
                  className={`absolute top-4 right-4 text-white px-3 py-1.5 rounded-lg text-[0.72rem] font-bold backdrop-blur-[4px] z-20 ${product.badgeColor === "brand-orange" ? "bg-brand-orange/85" : "bg-brand-blue/85"
                    }`}
                >
                  {product.badge}
                </span>
              )}

              {/* Text Content overlay at bottom */}
              <div className="relative z-20 p-8 flex flex-col justify-end">
                {/* <span className="text-brand-orange text-[0.75rem] font-bold uppercase tracking-widest mb-1.5">
                  {product.category === "in-house" ? "In-House Made" : product.category === "trading" ? "Trading Component" : "Authorized"}
                </span> */}
                <h3 className="text-white text-[1.3rem] font-extrabold leading-[1.2] group-hover:text-brand-orange-light transition-colors duration-300">
                  {product.title}
                </h3>
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
