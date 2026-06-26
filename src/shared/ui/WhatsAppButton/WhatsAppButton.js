"use client";

import React from "react";
import { WhatsAppIcon } from "@/shared/icons/Icons";

/**
 * WhatsAppFloatingButton float button displaying a quick link support trigger.
 * @param {object} props
 * @param {string} [props.whatsappNumber] - WhatsApp number
 */
export const WhatsAppButton = ({ whatsappNumber = "916352699700" }) => {
  return (
    <a
      href={`https://api.whatsapp.com/send/?phone=${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300"
      title="WhatsApp Support"
    >
      <WhatsAppIcon className="w-7 h-7 text-white" />
    </a>
  );
};

export default WhatsAppButton;
