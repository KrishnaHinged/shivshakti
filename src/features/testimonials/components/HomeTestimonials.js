"use client";

import React from "react";

const FALLBACK_TESTIMONIALS = [
  {
    _id: "t1",
    name: "Rajesh Mehta",
    role: "MD, Mehta Elevators, Ahmedabad",
    rating: 5,
    review: "Shivshakti has been our trusted supplier for over 5 years. Their cabin quality and on-time delivery is unmatched in Gujarat.",
  },
  {
    _id: "t2",
    name: "Suresh Patel",
    role: "Director, Patel Lifts, Surat",
    rating: 5,
    review: "Excellent product quality and outstanding after-sales support. The SS cabins we ordered exceeded our client expectations completely.",
  },
  {
    _id: "t3",
    name: "Vikram Singh",
    role: "Owner, Singh Elevator Co., Indore",
    rating: 5,
    review: "We source all our automatic doors and car frames from Shivshakti. Competitive pricing with zero compromise on quality.",
  },
];

export const HomeTestimonials = ({ testimonials }) => {
  const items = testimonials?.length ? testimonials : FALLBACK_TESTIMONIALS;

  return (
    <section id="testimonials" className="bg-transparent text-text-light-primary py-12 lg:py-16">
      
      {/* Centered Section Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="text-brand-orange text-[0.85rem] font-bold uppercase tracking-[0.2em] block mb-2">What Clients Say</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-light-primary tracking-tight">
          Trusted by Elevator Companies Across India
        </h2>
      </div>

      {/* Grid of Testimonial Cards */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 pb-6 w-full md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-slate-100 rounded-[1.8rem] md:rounded-[2.2rem] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(30,58,138,0.04)] flex flex-col justify-between shrink-0 w-[85%] sm:w-[48%] snap-center md:w-auto md:shrink"
          >
            <div>
              {/* Star Ratings */}
              <div className="flex gap-1 text-brand-orange text-[0.95rem] mb-4">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-[0.95rem] leading-[1.7] text-text-light-secondary italic relative pl-4 border-l-2 border-brand-orange/30 mb-6">
                &ldquo;{item.review}&rdquo;
              </p>
            </div>
            
            <div>
              <h4 className="font-extrabold text-text-light-primary text-[1.05rem]">{item.name}</h4>
              <p className="text-[0.85rem] text-brand-blue uppercase tracking-wider font-semibold mt-0.5">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeTestimonials;
