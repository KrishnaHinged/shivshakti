"use client";

import React, { useState } from "react";

export const ProductImage = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`${className} bg-gradient-to-tr from-[rgba(30,58,138,0.05)] to-[rgba(249,115,22,0.08)] flex flex-col items-center justify-center p-6 text-center border-b border-border-light relative overflow-hidden group/fallback`}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] transition-all group-hover/fallback:scale-105 duration-300" />
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-orange mb-2.5 relative z-10 transition-transform group-hover/fallback:scale-110 duration-300">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        <span className="text-[0.85rem] font-semibold text-text-light-primary relative z-10 uppercase tracking-wider">{alt}</span>
        <span className="text-[0.7rem] text-text-light-secondary mt-1 relative z-10">Premium Finish Component</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} transition-all duration-300 group-hover:scale-105`}
      onError={() => setError(true)}
    />
  );
};

export default ProductImage;
