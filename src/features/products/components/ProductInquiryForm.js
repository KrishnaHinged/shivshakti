"use client";

import React, { useState } from "react";
import { createInquiryAction } from "@/features/crm/services/actions";
import { AlertTriangle } from "lucide-react";
import { Button, Card, Input, Textarea } from "@/shared/ui";

export const ProductInquiryForm = ({ productId, productTitle, productSlug, customizationColor, customizationFinish }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryError("");
    setFormSubmitted(false);
    setLoading(true);

    const formData = new FormData(e.target);
    const res = await createInquiryAction(formData);
    setLoading(false);

    if (res.success) {
      setFormSubmitted(true);
      e.target.reset();
    } else {
      setInquiryError(res.error || "Submission failed.");
    }
  };

  const defaultMessage = customizationColor && customizationFinish
    ? `Hello, I am interested in inquiring about specifications, lead times, and pricing details for the ${productTitle} (Color: ${customizationColor}, Finish: ${customizationFinish} Finish). Please share the brochure and catalog.`
    : `Hello, I am interested in inquiring about specifications, lead times, and pricing details for the ${productTitle}. Please share the brochure and catalog.`;

  return (
    <Card className="border-border-light rounded-[1.5rem] p-6 lg:p-8 flex flex-col gap-6 shadow-sm">
      <div>
        <h3 className="text-[1.25rem] font-bold text-text-light-primary">Request Details & Pricing</h3>
        <p className="text-[0.85rem] text-text-light-secondary mt-1">
          Inquire about <span className="font-semibold text-brand-blue">{productTitle}</span>. Our technical team will respond within 24 hours.
        </p>
      </div>

      {inquiryError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{inquiryError}</span>
        </div>
      )}

      {formSubmitted ? (
        <div className="bg-brand-orange-pale border border-brand-orange/20 p-6 rounded-2xl text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center text-white mb-1 shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-[1.1rem] font-bold text-text-light-primary">Inquiry Sent!</h4>
          <p className="text-xs text-text-light-secondary max-w-[20rem]">
            Your request has been successfully registered. We will contact you soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4">
          <input type="hidden" name="productId" value={productId || ""} />
          <input type="hidden" name="productSlug" value={productSlug || ""} />
          <input type="hidden" name="productTitle" value={productTitle || ""} />
          <input type="hidden" name="productInterest" value={productSlug || ""} />
          <input type="hidden" name="customizationColor" value={customizationColor || ""} />
          <input type="hidden" name="customizationFinish" value={customizationFinish || ""} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              suppressHydrationWarning
              inputClassName="bg-white border-border-light rounded-xl px-4 py-3 text-text-light-primary text-[0.9rem] outline-none placeholder:text-text-light-secondary/60"
            />
            <Input
              type="text"
              name="company"
              placeholder="Company Name"
              suppressHydrationWarning
              inputClassName="bg-white border-border-light rounded-xl px-4 py-3 text-text-light-primary text-[0.9rem] outline-none placeholder:text-text-light-secondary/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              suppressHydrationWarning
              inputClassName="bg-white border-border-light rounded-xl px-4 py-3 text-text-light-primary text-[0.9rem] outline-none placeholder:text-text-light-secondary/60"
            />
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              suppressHydrationWarning
              inputClassName="bg-white border-border-light rounded-xl px-4 py-3 text-text-light-primary text-[0.9rem] outline-none placeholder:text-text-light-secondary/60"
            />
          </div>

          <Input
            type="text"
            name="city"
            placeholder="Your City"
            required
            suppressHydrationWarning
            inputClassName="bg-white border-border-light rounded-xl px-4 py-3 text-text-light-primary text-[0.9rem] outline-none placeholder:text-text-light-secondary/60"
          />

          <Textarea
            key={customizationColor && customizationFinish ? `${customizationColor}-${customizationFinish}` : "default"}
            name="message"
            placeholder="Your Message"
            rows="3"
            required
            suppressHydrationWarning
            defaultValue={defaultMessage}
            inputClassName="bg-white border-border-light rounded-xl px-4 py-3 text-text-light-primary text-[0.9rem] outline-none placeholder:text-text-light-secondary/60"
          />

          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            radius="full"
            className="w-full py-3.5 shadow-md hover:shadow-lg text-[0.9rem]"
          >
            Submit Inquiry →
          </Button>
        </form>
      )}
    </Card>
  );
};

export default ProductInquiryForm;
