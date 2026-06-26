"use client";

import React, { useState } from "react";
import Link from "next/link";
import { subscribeNewsletterAction } from "@/features/admin/services/newsletterActions";
import { PhoneIcon, MailIcon, FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/shared/icons/Icons";

/**
 * Global Footer component.
 * Displays brand logo, social media links, product links, company navigation, and newsletter subscription form.
 * @param {object} props
 * @param {Array} props.products - List of products to display
 * @param {object} props.settings - Global settings configuration
 */
export function Footer({ products, settings }) {
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [newsletterErr, setNewsletterErr] = useState("");

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterMsg("");
    setNewsletterErr("");

    const formData = new FormData(e.target);
    const res = await subscribeNewsletterAction(formData);

    if (res.success) {
      setNewsletterMsg(res.message);
      e.target.reset();
    } else {
      setNewsletterErr(res.error || "Subscription failed.");
    }
  };

  const primaryPhone = settings.phones?.[0] || "+91 9737171100";
  const primaryEmail = settings.emails?.[0] || "sales.shivshakti22@gmail.com";

  return (
    <footer id="footer" className="bg-[#0a1128] text-white px-6 py-20 lg:px-16 pb-10 border-t border-white/10">
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1.5fr] gap-16 mb-16">

        {/* Column 1: Brand details */}
        <div className="flex flex-col gap-6">
          <a href="#home" className="inline-block hover:scale-105 transition-transform duration-300">
            <img
              src={settings.logoUrl || "/images/logo.png"}
              alt="SHIVSHAKTI Logo"
              className="h-14 md:h-16 w-auto object-contain p-2 bg-white/50 rounded-xl "
            />
          </a>
          <p className="text-[0.95rem] text-text-secondary leading-[1.6] max-w-[20rem]">
            {settings.footerDescription || "Manufacturer of premium elevator cabins, automatic doors, car frames and components."}
          </p>

          <div className="flex gap-4 mt-2">
            {settings.socialLinks?.facebook && (
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border-glass flex items-center justify-center text-text-secondary transition-all duration-300 hover:bg-brand-orange hover:text-white hover:border-brand-orange hover:-translate-y-0.5"
                title="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
            )}
            {settings.socialLinks?.instagram && (
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border-glass flex items-center justify-center text-text-secondary transition-all duration-300 hover:bg-brand-orange hover:text-white hover:border-brand-orange hover:-translate-y-0.5"
                title="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            )}
            {settings.socialLinks?.whatsapp && (
              <a
                href={settings.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border-glass flex items-center justify-center text-text-secondary transition-all duration-300 hover:bg-brand-orange hover:text-white hover:border-brand-orange hover:-translate-y-0.5"
                title="WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Products */}
        <div>
          <h4 className="text-base font-bold uppercase tracking-[0.1em] text-white mb-7 border-l-2 border-brand-orange pl-3">Products</h4>
          <ul className="flex flex-col gap-4">
            {products.filter(p => p.featured).slice(0, 6).map(p => (
              <li key={p._id}>
                <a href="#catalog" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-brand-orange hover:pl-1">
                  {p.title}
                </a>
              </li>
            ))}
            {products.filter(p => p.featured).length === 0 && (
              <>
                <li><a href="#catalog" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-brand-orange hover:pl-1">Manual Door</a></li>
                <li><a href="#catalog" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-brand-orange hover:pl-1">Automatic Door</a></li>
                <li><a href="#catalog" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-brand-orange hover:pl-1">SS / MS Cabin</a></li>
              </>
            )}
          </ul>
        </div>

        {/* Column 3: Company */}
        <div>
          <h4 className="text-base font-bold uppercase tracking-[0.1em] text-white mb-7 border-l-2 border-brand-blue pl-3">Company</h4>
          <ul className="flex flex-col gap-4">
            <li><a href="#about" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-brand-blue hover:pl-1">About Us</a></li>
            <li><a href="#gallery" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-brand-blue hover:pl-1">Gallery</a></li>
            <li><a href="#why-us" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-brand-blue hover:pl-1">Certificates</a></li>
            <li><Link href="/blog" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-brand-blue hover:pl-1">Blog</Link></li>
            <li><a href="#contact" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-brand-blue hover:pl-1">Career</a></li>
            <li><a href="#about" className="text-text-secondary text-[0.95rem] transition-all duration-300 hover:text-brand-blue hover:pl-1">CSR</a></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h4 className="text-base font-bold uppercase tracking-[0.1em] text-white mb-7 border-l-2 border-brand-orange pl-3">Newsletter</h4>
          <p className="text-[0.9rem] text-text-secondary leading-[1.5] mb-5">
            Receive exclusive design guides, architecture tips, and collection updates.
          </p>

          {newsletterMsg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-300 text-xs px-3.5 py-2 rounded-xl mb-4 leading-normal">
              {newsletterMsg}
            </div>
          )}
          {newsletterErr && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-3.5 py-2 rounded-xl mb-4 leading-normal">
              {newsletterErr}
            </div>
          )}

          <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="flex-1 bg-white/5 border border-border-glass px-4 py-3 rounded-full text-white text-[0.9rem] outline-none transition-all duration-300 focus:border-brand-orange"
              required
              suppressHydrationWarning
            />
            <button
              type="submit"
              suppressHydrationWarning
              className="bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-3 rounded-full text-[0.9rem] font-semibold transition-all duration-300 cursor-pointer"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[0.85rem] text-text-secondary gap-6 md:gap-0 max-w-[1300px] mx-auto">
        <p>© 2026 {settings.companyName || "Shivshakti Elevator Components Pvt. Ltd."} All Rights Reserved.</p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-center">
          <a
            href={`tel:${primaryPhone}`}
            className="flex items-center gap-2 hover:text-brand-orange transition duration-300"
          >
            <PhoneIcon className="w-3.5 h-3.5 text-brand-orange" /> {primaryPhone}
          </a>
          <a
            href={`mailto:${primaryEmail}`}
            className="flex items-center gap-2 hover:text-brand-orange transition duration-300"
          >
            <MailIcon className="w-3.5 h-3.5 text-brand-blue" /> {primaryEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
