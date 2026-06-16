"use client";

import React, { useState } from "react";
import { createInquiryAction } from "@/actions/inquiries";
import { PhoneIcon, MailIcon } from "@/components/ui/Icons";
import { AlertTriangle } from "lucide-react";

export const Contact = ({ settings }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inquiryError, setInquiryError] = useState("");

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryError("");
    setFormSubmitted(false);

    const formData = new FormData(e.target);
    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const elevatorType = formData.get("elevatorType")?.toString();
    const componentNeeded = formData.get("componentNeeded")?.toString();
    const quantity = formData.get("quantity")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    // Client-side validations
    if (!name || name.length < 2) {
      setInquiryError("Full name must be at least 2 characters.");
      return;
    }
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setInquiryError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInquiryError("Please enter a valid email address.");
      return;
    }
    if (!elevatorType) {
      setInquiryError("Please select the target Elevator Type.");
      return;
    }
    if (!componentNeeded) {
      setInquiryError("Please select the required component.");
      return;
    }
    const qtyVal = parseInt(quantity, 10);
    if (isNaN(qtyVal) || qtyVal <= 0) {
      setInquiryError("Quantity must be a positive integer.");
      return;
    }
    if (!message || message.length < 5) {
      setInquiryError("Please add a detailed description of your request.");
      return;
    }

    const res = await createInquiryAction(formData);

    if (res.success) {
      setFormSubmitted(true);
      e.target.reset();
    } else {
      setInquiryError(res.error || "Submission failed.");
    }
  };

  const primaryPhone = settings.phones?.[0] || "+91 9737171100";
  const primaryEmail = settings.emails?.[0] || "sales.shivshakti22@gmail.com";

  return (
    <section className="w-full px-4 lg:px-8 py-8 bg-transparent">
      {/* Highly Rounded Dark Container Block */}
      <div id="contact" className="mx-auto max-w-[1300px] rounded-[2.5rem] lg:rounded-[3.5rem] bg-[#0d0d0d] text-white p-8 md:p-12 lg:p-16 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Inquiry Form */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-text-secondary text-[0.82rem] font-bold uppercase tracking-[0.2em] block mb-2">Smart Quote request</span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">Request a Quotation</h2>
              <p className="text-[0.95rem] text-text-secondary">
                Select your technical specifications to receive a detailed breakdown from our sales engineering team.
              </p>
            </div>

            {inquiryError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{inquiryError}</span>
              </div>
            )}

            {formSubmitted ? (
              <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center flex flex-col items-center justify-center gap-4 transition-all duration-500">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white mb-2 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-[1.3rem] font-bold text-white">Quotation Request Received!</h3>
                <p className="text-[0.95rem] text-text-secondary max-w-[24rem]">
                  Our logistics and production estimators are generating your cost breakdown. Expect a follow-up shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="flex flex-col gap-5">
                <input type="hidden" name="isSmartForm" value="true" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    required
                    suppressHydrationWarning
                    className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white text-[0.95rem] outline-none focus:border-brand-orange focus:bg-white/[0.06] transition placeholder:text-text-secondary"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    suppressHydrationWarning
                    className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white text-[0.95rem] outline-none focus:border-brand-orange focus:bg-white/[0.06] transition placeholder:text-text-secondary"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    required
                    suppressHydrationWarning
                    className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white text-[0.95rem] outline-none focus:border-brand-orange focus:bg-white/[0.06] transition placeholder:text-text-secondary"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    suppressHydrationWarning
                    className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white text-[0.95rem] outline-none focus:border-brand-orange focus:bg-white/[0.06] transition placeholder:text-text-secondary"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <select
                    name="elevatorType"
                    required
                    suppressHydrationWarning
                    className="bg-[#120e0b] border border-white/10 rounded-xl px-5 py-3.5 text-white text-[0.95rem] outline-none focus:border-brand-orange focus:bg-white/[0.06] transition"
                    defaultValue=""
                  >
                    <option value="" disabled>Elevator Type</option>
                    <option value="passenger">Passenger Elevator</option>
                    <option value="capsule">Home / Capsule Lift</option>
                    <option value="freight">Goods / Freight Lift</option>
                    <option value="stretcher">Stretcher Elevator</option>
                    <option value="dumbwaiter">Dumbwaiter / Small Lift</option>
                  </select>

                  <select
                    name="componentNeeded"
                    required
                    suppressHydrationWarning
                    className="bg-[#120e0b] border border-white/10 rounded-xl px-5 py-3.5 text-white text-[0.95rem] outline-none focus:border-brand-orange focus:bg-white/[0.06] transition"
                    defaultValue=""
                  >
                    <option value="" disabled>Component Needed</option>
                    <option value="manual-door">Manual Door</option>
                    <option value="automatic-door">Automatic Door</option>
                    <option value="ss-ms-cabin">SS / MS Cabin</option>
                    <option value="car-frame">Elevator Car Frame</option>
                    <option value="geared-gearless">Geared / Gearless Machine</option>
                    <option value="lop-cop">LOP / COP Panels</option>
                    <option value="t-guide-rail">T-Guide Rail & Bracket</option>
                    <option value="usha-martin">Usha Martin Wire Rope</option>
                    <option value="other">Other Components</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    placeholder="Quantity Required"
                    required
                    suppressHydrationWarning
                    className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white text-[0.95rem] outline-none focus:border-brand-orange focus:bg-white/[0.06] transition placeholder:text-text-secondary"
                  />
                </div>

                <textarea
                  name="message"
                  placeholder="Your Message Details"
                  rows="4"
                  required
                  suppressHydrationWarning
                  className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white text-[0.95rem] outline-none focus:border-brand-orange focus:bg-white/[0.06] transition placeholder:text-text-secondary"
                />

                <button
                  type="submit"
                  suppressHydrationWarning
                  className="bg-brand-orange text-white w-full rounded-full py-4 font-semibold text-center hover:bg-brand-orange-light hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Send Inquiry →
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Info Cards & Map */}
          <div className="flex flex-col gap-6 w-full lg:mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
              {settings.addresses?.map((branch, index) => (
                <div
                  key={index}
                  className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[1.5rem] p-6 flex flex-col gap-3 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[1.05rem] font-bold text-white">{branch.branchName}</span>
                    <span className="text-[0.65rem] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold bg-white/10 text-white">
                      {branch.badge || "Branch"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-1.5">
                    {branch.phone.split("/").map((ph, idx) => (
                      <a
                        key={idx}
                        href={`tel:${ph.trim()}`}
                        className="flex items-center gap-2 text-[0.85rem] text-text-secondary hover:text-white transition duration-300"
                      >
                        <PhoneIcon className="w-3.5 h-3.5 text-text-secondary" /> {ph.trim()}
                      </a>
                    ))}
                    <a
                      href={`mailto:${branch.email}`}
                      className="flex items-center gap-2 text-[0.85rem] text-text-secondary hover:text-white transition duration-300"
                    >
                      <MailIcon className="w-3.5 h-3.5 text-text-secondary" /> {branch.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps Embed */}
            {settings.googleMapsEmbed && (
              <>
                <div className="relative w-full rounded-[1.5rem] overflow-hidden border border-white/10 h-[220px] mt-2 group">
                  <iframe
                    src={settings.googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="transition-opacity duration-300 group-hover:opacity-95"
                  />
                </div>
                <a
                  href="https://www.google.com/maps/place/Shiv+Shakti+Elevator+Components+Pvt+Ltd/@21.131094,72.833979,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.78rem] text-text-secondary hover:text-white transition duration-300 flex items-center gap-1.5 mt-1"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  View on Google Maps ↗
                </a>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
