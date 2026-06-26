"use client";

import React from "react";

export const HomeGallery = ({ gallery, hideHeader = false }) => {
  return (
    <section id="gallery" className="bg-transparent text-text-light-primary px-6 pb-8 lg:px-20 pt-8">
      {!hideHeader && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 w-full gap-6">
          <div>
            <span className="text-brand-blue text-[0.85rem] font-bold uppercase tracking-[0.2em] block mb-2">Showcase</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-text-light-primary tracking-tight">Landmark Projects</h2>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {gallery.length > 0 ? (
          gallery.map((item) => (
            <div
              key={item._id}
              className="relative rounded-2xl overflow-hidden h-[340px] group shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end h-full">
                <span className="text-brand-orange text-[0.75rem] font-bold uppercase tracking-widest mb-1.5 capitalize">
                  {item.category.replace("_", " ")}
                </span>
                <h4 className="text-white text-[1.15rem] font-bold leading-[1.3] group-hover:text-brand-orange-light transition-colors duration-300">
                  {item.title}
                </h4>
              </div>
            </div>
          ))
        ) : (
          // Fallback to static images if DB is empty
          ["project-panoramic.png", "project-villa.png", "project-hotel.png", "project-office.png"].map((img, index) => {
            const titles = ["Panoramic Glass Cabin", "Bespoke Wooden Interior", "Automatic Metal Finish Doors", "Heavy Duty Commercial Elevator"];
            const locs = ["Luxury Penthouse, Mumbai", "Private Villa, Indore", "Grand Palace Hotel, Surat", "Hi-Tech IT Park, Lucknow"];
            return (
              <div
                key={index}
                className="relative rounded-[1.5rem] overflow-hidden h-[340px] group shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <img
                  src={`/images/${img}`}
                  alt={titles[index]}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end h-full">
                  <span className="text-brand-orange text-[0.75rem] font-bold uppercase tracking-widest mb-1.5">
                    {locs[index]}
                  </span>
                  <h4 className="text-white text-[1.15rem] font-bold leading-[1.3] group-hover:text-brand-orange-light transition-colors duration-300">
                    {titles[index]}
                  </h4>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default HomeGallery;
