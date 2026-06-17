"use client";

import { useState, useRef } from "react";
import { Upload, X, RefreshCw, AlertTriangle, Eye, Loader2 } from "lucide-react";
import { validate360File, VIEW_360_SLOTS } from "@/lib/validateAspectRatio";
import CropModal from "./CropModal";
import dynamic from "next/dynamic";

const Cabin360Viewer = dynamic(() => import("@/components/Cabin360Viewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/10] bg-slate-900 rounded-2xl flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-white animate-spin" />
    </div>
  ),
});

export default function View360Uploader({
  has360View,
  setHas360View,
  view360,
  setView360,
  view360Errors,
  setView360Errors,
  productName,
}) {
  const [uploading, setUploading] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [activeCrop, setActiveCrop] = useState(null); // { file, slot }
  const fileInputRefs = useRef({});

  const allFilled = VIEW_360_SLOTS.every((slot) => view360[slot.key]);

  const handleFileSelect = async (slot, file) => {
    if (!file) return;

    // Clear previous error for this slot
    setView360Errors((prev) => ({ ...prev, [slot.key]: null }));

    // Validate the image file (type + size only)
    const result = validate360File(file);
    if (!result.valid) {
      setView360Errors((prev) => ({ ...prev, [slot.key]: result.error }));
      return;
    }

    // Open crop modal to crop the image
    setActiveCrop({ file, slot });
  };

  const handleCropSave = async (croppedFile) => {
    if (!activeCrop) return;
    const { slot } = activeCrop;
    const slotKey = slot.key;

    // Close crop modal
    setActiveCrop(null);

    // Upload to Cloudinary via /api/media
    setUploading((prev) => ({ ...prev, [slotKey]: true }));
    try {
      const formData = new FormData();
      formData.append("file", croppedFile);
      formData.append("folder", "360-views");

      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.success) {
        const url = data.data.url;
        setView360((prev) => {
          const updated = { ...prev, [slotKey]: url };
          if (slot.syncKey) {
            updated[slot.syncKey] = url;
          }
          return updated;
        });
      } else {
        setView360Errors((prev) => ({
          ...prev,
          [slotKey]: data.error || "Upload failed. Please try again.",
        }));
      }
    } catch (err) {
      console.error(err);
      setView360Errors((prev) => ({
        ...prev,
        [slotKey]: "Network error during upload.",
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [slotKey]: false }));
    }
  };

  const handleRemove = (slot) => {
    setView360((prev) => {
      const updated = { ...prev, [slot.key]: "" };
      if (slot.syncKey) {
        updated[slot.syncKey] = "";
      }
      return updated;
    });
    setView360Errors((prev) => ({ ...prev, [slot.key]: null }));
    // Reset file input
    if (fileInputRefs.current[slot.key]) {
      fileInputRefs.current[slot.key].value = "";
    }
  };

  const handleDrop = (e, slot) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileSelect(slot, file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-5">
        <div>
          <h4 className="text-sm font-bold text-slate-700 uppercase">
            360° Interior View
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Enable this to let customers explore this lift&apos;s interior in an
            interactive 360° viewer.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={has360View}
            onClick={() => {
              setHas360View(!has360View);
              if (has360View) {
                // Turning off: clear validation errors
                setView360Errors({});
              }
            }}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
              has360View ? "bg-[#F97316]" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-250 ease-in-out ${
                has360View ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <label className="text-xs font-bold text-slate-600 select-none">
            Enable 360° View for this product
          </label>
        </div>

        {/* Conditional Upload Grid — CSS transition reveal */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: has360View ? "2000px" : "0px",
            opacity: has360View ? 1 : 0,
          }}
        >
          {/* Image Requirements Spec Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 mb-5">
            <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
              Image Requirements
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500">
              <div>
                <p className="font-semibold text-slate-700 mb-1">
                  Walls (Front / Back / Sides):
                </p>
                <p>
                  Aspect Ratio: <strong>2:3</strong> (portrait)
                </p>
                <p>
                  Recommended: <strong>800 × 1200 px</strong>
                </p>
                <p>Format: JPG or PNG</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">
                  Ceiling / Floor:
                </p>
                <p>
                  Aspect Ratio: <strong>1:1</strong> (square)
                </p>
                <p>
                  Recommended: <strong>1200 × 1200 px</strong>
                </p>
                <p>Format: JPG or PNG</p>
              </div>
            </div>
            <p className="text-[0.68rem] text-slate-400 mt-2 border-t border-slate-100 pt-2">
              Max file size: 5MB per image. You can adjust and crop any image upload directly in the editor.
            </p>
          </div>

          {/* 5-Slot Upload Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {VIEW_360_SLOTS.map((slot) => {
              const imageUrl = view360[slot.key];
              const error = view360Errors[slot.key];
              const isUploading = uploading[slot.key];
              
              let aspectClass = "aspect-square";
              if (slot.aspectLabel === "3:5") {
                aspectClass = "aspect-[3/5]";
              } else if (slot.aspectLabel === "2:3") {
                aspectClass = "aspect-[2/3]";
              }

              return (
                <div key={slot.key} className="flex flex-col gap-1.5">
                  {/* Slot Label */}
                  <label className="text-[0.72rem] font-bold text-slate-600 uppercase tracking-wider">
                    {slot.label}
                  </label>

                  {/* Upload Zone / Preview */}
                  {imageUrl ? (
                    /* Image Preview */
                    <div className="relative group">
                      <div
                        className={`${aspectClass} rounded-xl overflow-hidden border border-slate-200 bg-slate-50`}
                      >
                        <img
                          src={imageUrl}
                          alt={slot.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Overlay Buttons */}
                      <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            fileInputRefs.current[slot.key]?.click()
                          }
                          className="bg-white text-slate-700 text-[0.68rem] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-slate-100"
                        >
                          <RefreshCw className="w-3 h-3" /> Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(slot)}
                          className="bg-red-500 text-white text-[0.68rem] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-red-600"
                        >
                          <X className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Empty Drop Zone */
                    <div
                      className={`${aspectClass} rounded-xl border-2 border-dashed ${
                        error
                          ? "border-red-300 bg-red-50/50"
                          : "border-slate-200 bg-white hover:border-[#F97316]/40 hover:bg-orange-50/30"
                      } flex flex-col items-center justify-center cursor-pointer transition-colors duration-200`}
                      onClick={() =>
                        !isUploading &&
                        fileInputRefs.current[slot.key]?.click()
                      }
                      onDrop={(e) => handleDrop(e, slot)}
                      onDragOver={handleDragOver}
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 text-[#F97316] animate-spin" />
                          <span className="text-[0.68rem] font-semibold text-slate-400">
                            Uploading...
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 px-3 text-center">
                          <Upload className="w-5 h-5 text-slate-300" />
                          <span className="text-[0.68rem] font-semibold text-slate-400">
                            Click or drop
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hidden File Input */}
                  <input
                    ref={(el) => (fileInputRefs.current[slot.key] = el)}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) =>
                      handleFileSelect(
                        slot,
                        e.target.files?.[0]
                      )
                    }
                  />

                  {/* Caption */}
                  <p className="text-[0.62rem] text-slate-400 leading-snug">
                    {slot.caption}
                  </p>

                  {/* Inline Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-[0.68rem] px-2.5 py-1.5 rounded-lg flex items-start gap-1.5">
                      <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Preview 360° View Button */}
          {allFilled && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="bg-[#F97316] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#FB923C] shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 shrink-0" />
                Preview 360° View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Crop Modal */}
      {activeCrop && (
        <CropModal
          file={activeCrop.file}
          aspect={activeCrop.slot.aspect}
          slotLabel={activeCrop.slot.label}
          onClose={() => setActiveCrop(null)}
          onSave={handleCropSave}
        />
      )}

      {/* Preview Modal */}
      {showPreview && allFilled && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  360° Interior Preview
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  This is how customers will see the interactive viewer.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="text-slate-400 hover:text-slate-700 transition cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Viewer */}
            <div className="p-4">
              <Cabin360Viewer
                view360={view360}
                productName={productName || "Product Preview"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
