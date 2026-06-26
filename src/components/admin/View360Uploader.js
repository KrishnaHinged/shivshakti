"use client";

import { useState, useRef } from "react";
import { Upload, X, RefreshCw, AlertTriangle, Eye, Loader2, ChevronDown } from "lucide-react";
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

const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const renderSlotCard = ({
  slot,
  imageUrl,
  error,
  isUploading,
  onFileSelect,
  onRemove,
  refKey,
  onTriggerClick,
  setInputRef,
  onDrop,
}) => {
  let aspectClass = "aspect-square";
  if (slot.aspectLabel === "3:5") {
    aspectClass = "aspect-[3/5]";
  } else if (slot.aspectLabel === "2:3") {
    aspectClass = "aspect-[2/3]";
  }

  return (
    <div key={refKey} className="flex flex-col gap-1.5">
      <label className="text-[0.72rem] font-bold text-slate-600 uppercase tracking-wider">
        {slot.label}
      </label>

      {imageUrl ? (
        <div className="relative group">
          <div className={`${aspectClass} rounded-xl overflow-hidden border border-slate-200 bg-slate-50`}>
            <img src={imageUrl} alt={slot.label} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onTriggerClick}
              className="bg-white text-slate-700 text-[0.68rem] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-slate-100"
            >
              <RefreshCw className="w-3 h-3" /> Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="bg-red-500 text-white text-[0.68rem] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-red-600"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${aspectClass} rounded-xl border-2 border-dashed ${
            error
              ? "border-red-300 bg-red-50/50"
              : "border-slate-200 bg-white hover:border-[#F97316]/40 hover:bg-orange-50/30"
          } flex flex-col items-center justify-center cursor-pointer transition-colors duration-200`}
          onClick={() => {
            if (!isUploading) {
              onTriggerClick();
            }
          }}
          onDrop={onDrop}
          onDragOver={handleDragOver}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-[#F97316] animate-spin" />
              <span className="text-[0.68rem] font-semibold text-slate-400">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 px-3 text-center">
              <Upload className="w-5 h-5 text-slate-300" />
              <span className="text-[0.68rem] font-semibold text-slate-400">Click or drop</span>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={setInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files?.[0])}
      />

      <p className="text-[0.62rem] text-slate-400 leading-snug">{slot.caption}</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-[0.68rem] px-2.5 py-1.5 rounded-lg flex items-start gap-1.5">
          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default function View360Uploader({
  has360View,
  setHas360View,
  view360,
  setView360,
  view360Errors,
  setView360Errors,
  productName,
  // Layout Cabin variant props (optional)
  isLayoutCabin = false,
  availableColors = [],
  availableFinishes = [],
  view360Variants = [],
  setView360Variants,
}) {
  const [uploading, setUploading] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [activeCrop, setActiveCrop] = useState(null); // { file, slot, variantKey? }
  const fileInputRefs = useRef({});

  // Variant-specific 360° states
  const [activeVariantCombo, setActiveVariantCombo] = useState(null); // "ColorName-FinishName"
  const [variantUploading, setVariantUploading] = useState({});
  const [variantErrors, setVariantErrors] = useState({});
  const [showVariantPreview, setShowVariantPreview] = useState(false);
  const [variantPreviewData, setVariantPreviewData] = useState(null);
  const variantFileInputRefs = useRef({});

  const triggerFileInputClick = (key) => {
    fileInputRefs.current[key]?.click();
  };

  const triggerVariantFileInputClick = (key) => {
    variantFileInputRefs.current[key]?.click();
  };

  const setFileInputRef = (key, el) => {
    fileInputRefs.current[key] = el;
  };

  const setVariantFileInputRef = (key, el) => {
    variantFileInputRefs.current[key] = el;
  };

  const allFilled = VIEW_360_SLOTS.every((slot) => view360[slot.key]);

  // Get active color+finish combinations for layout cabins
  const activeVariantCombos = isLayoutCabin
    ? availableColors
        .filter((c) => c.enabled)
        .flatMap((color) =>
          availableFinishes
            .filter((f) => f.enabled)
            .map((finish) => ({
              color: color.name,
              colorCode: color.code,
              finish: finish.name,
              key: `${color.name}-${finish.name}`,
            }))
        )
    : [];

  // Active variant combo computations
  const activeComboData = activeVariantCombo ? activeVariantCombos.find((c) => c.key === activeVariantCombo) : null;
  const activeVariantV360 = activeComboData ? getVariant360(activeComboData.color, activeComboData.finish) : { front: "", back: "", left: "", right: "", ceiling: "", floor: "" };
  const activeVariantFilledCount = activeComboData ? VIEW_360_SLOTS.filter((s) => activeVariantV360[s.key]).length : 0;
  const allVariantFilled = activeComboData ? activeVariantFilledCount === VIEW_360_SLOTS.length : false;

  // Helper to get variant 360 data for a combo
  const getVariant360 = (colorName, finishName) => {
    const match = view360Variants.find(
      (v) => v.color === colorName && v.finish === finishName
    );
    return match?.view360 || { front: "", back: "", left: "", right: "", ceiling: "", floor: "" };
  };

  // Helper to update variant 360 data for a combo
  const updateVariant360 = (colorName, finishName, slotKey, url, syncKey) => {
    if (!setView360Variants) return;
    setView360Variants((prev) => {
      const idx = prev.findIndex(
        (v) => v.color === colorName && v.finish === finishName
      );
      if (idx >= 0) {
        const updated = [...prev];
        const updatedView = { ...updated[idx].view360, [slotKey]: url };
        if (syncKey) updatedView[syncKey] = url;
        updated[idx] = { ...updated[idx], view360: updatedView };
        return updated;
      } else {
        const newView = { front: "", back: "", left: "", right: "", ceiling: "", floor: "", [slotKey]: url };
        if (syncKey) newView[syncKey] = url;
        return [...prev, { color: colorName, finish: finishName, view360: newView, enabled: true }];
      }
    });
  };

  // Remove a single slot image from a variant
  const removeVariantSlot = (colorName, finishName, slotKey, syncKey) => {
    if (!setView360Variants) return;
    setView360Variants((prev) => {
      const idx = prev.findIndex(
        (v) => v.color === colorName && v.finish === finishName
      );
      if (idx >= 0) {
        const updated = [...prev];
        const updatedView = { ...updated[idx].view360, [slotKey]: "" };
        if (syncKey) updatedView[syncKey] = "";
        updated[idx] = { ...updated[idx], view360: updatedView };
        return updated;
      }
      return prev;
    });
  };

  // --- Base 360° handlers ---
  const handleFileSelect = async (slot, file) => {
    if (!file) return;
    setView360Errors((prev) => ({ ...prev, [slot.key]: null }));
    const result = validate360File(file);
    if (!result.valid) {
      setView360Errors((prev) => ({ ...prev, [slot.key]: result.error }));
      return;
    }
    setActiveCrop({ file, slot });
  };

  const handleCropSave = async (croppedFile) => {
    if (!activeCrop) return;
    const { slot, variantKey } = activeCrop;
    setActiveCrop(null);

    if (variantKey) {
      // Variant 360° upload
      const [colorName, finishName] = variantKey.split("|||");
      const uploadKey = `${variantKey}-${slot.key}`;
      setVariantUploading((prev) => ({ ...prev, [uploadKey]: true }));
      try {
        const formData = new FormData();
        formData.append("file", croppedFile);
        formData.append("folder", "360-views");

        const res = await fetch("/api/media", { method: "POST", body: formData });
        const data = await res.json();

        if (res.ok && data.success) {
          updateVariant360(colorName, finishName, slot.key, data.data.url, slot.syncKey);
        } else {
          setVariantErrors((prev) => ({
            ...prev,
            [uploadKey]: data.error || "Upload failed. Please try again.",
          }));
        }
      } catch (err) {
        console.error(err);
        setVariantErrors((prev) => ({
          ...prev,
          [uploadKey]: "Network error during upload.",
        }));
      } finally {
        setVariantUploading((prev) => ({ ...prev, [uploadKey]: false }));
      }
    } else {
      // Base 360° upload
      const slotKey = slot.key;
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

  // Variant file select handler
  const handleVariantFileSelect = async (slot, file, colorName, finishName) => {
    if (!file) return;
    const uploadKey = `${colorName}|||${finishName}-${slot.key}`;
    setVariantErrors((prev) => ({ ...prev, [uploadKey]: null }));
    const result = validate360File(file);
    if (!result.valid) {
      setVariantErrors((prev) => ({ ...prev, [uploadKey]: result.error }));
      return;
    }
    setActiveCrop({ file, slot, variantKey: `${colorName}|||${finishName}` });
  };

  const handleVariantDrop = (e, slot, colorName, finishName) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleVariantFileSelect(slot, file, colorName, finishName);
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
                setView360Errors({});
              }
            }}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${has360View ? "bg-[#F97316]" : "bg-slate-300"
              }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-250 ease-in-out ${has360View ? "translate-x-5" : "translate-x-0"
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
            maxHeight: has360View ? "4000px" : "0px",
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
                  Aspect Ratio: <strong>3:5</strong> (portrait)
                </p>
                <p>
                  Recommended: <strong>900 × 1500 px</strong>
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

          {/* Default 360° Header for Layout Cabins */}
          {isLayoutCabin && activeVariantCombos.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700">
                <strong>Default 360° Images (Fallback)</strong>
                <p className="mt-0.5 text-blue-600">
                  Upload the base set of 360° images below. These will be used as the default fallback when a specific color + finish combination doesn&apos;t have its own 360° images configured.
                </p>
              </div>
            </div>
          )}

          {/* 5-Slot Upload Grid — Base 360° */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {VIEW_360_SLOTS.map((slot) => {
              const imageUrl = view360[slot.key];
              const error = view360Errors[slot.key];
              const isSlotUploading = uploading[slot.key];

              return renderSlotCard(
                slot,
                imageUrl,
                error,
                isSlotUploading,
                (file) => handleFileSelect(slot, file),
                () => handleRemove(slot),
                slot.key,
                () => triggerFileInputClick(slot.key),
                (el) => setFileInputRef(slot.key, el)
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
                Preview Default 360° View
              </button>
            </div>
          )}

          {/* ──────────────────────────────────────────────────── */}
          {/* VARIANT 360° CONFIGURATION — Layout Cabins only    */}
          {/* ──────────────────────────────────────────────────── */}
          {isLayoutCabin && activeVariantCombos.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-5">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 uppercase">
                    360° Variant Configuration
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload separate sets of 360° images for each color + finish combination.
                    Leave empty to use the default 360° images above.
                  </p>
                </div>

                {/* Combo Selector Dropdown */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Select Configuration to Edit
                  </label>
                  <div className="relative">
                    <select
                      value={activeVariantCombo || ""}
                      onChange={(e) => setActiveVariantCombo(e.target.value || null)}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-800 text-sm outline-none focus:border-[#F97316] transition w-full appearance-none cursor-pointer font-medium"
                    >
                      <option value="">— Select a color + finish combination —</option>
                      {activeVariantCombos.map((combo) => {
                        const v360 = getVariant360(combo.color, combo.finish);
                        const filledCount = VIEW_360_SLOTS.filter((s) => v360[s.key]).length;
                        const totalSlots = VIEW_360_SLOTS.length;
                        const statusLabel = filledCount === 0
                          ? "No images"
                          : filledCount === totalSlots
                          ? "✓ Complete"
                          : `${filledCount}/${totalSlots} uploaded`;
                        return (
                          <option key={combo.key} value={combo.key}>
                            {combo.color} + {combo.finish} Finish — {statusLabel}
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Variant Combos Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {activeVariantCombos.map((combo) => {
                    const v360 = getVariant360(combo.color, combo.finish);
                    const filledCount = VIEW_360_SLOTS.filter((s) => v360[s.key]).length;
                    const totalSlots = VIEW_360_SLOTS.length;
                    const isActive = activeVariantCombo === combo.key;
                    const isComplete = filledCount === totalSlots;

                    return (
                      <button
                        key={combo.key}
                        type="button"
                        onClick={() => setActiveVariantCombo(isActive ? null : combo.key)}
                        className={`p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "border-[#F97316] bg-orange-50 shadow-sm"
                            : isComplete
                            ? "border-green-200 bg-green-50/50 hover:border-green-300"
                            : filledCount > 0
                            ? "border-amber-200 bg-amber-50/50 hover:border-amber-300"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-inner shrink-0"
                            style={{ backgroundColor: combo.colorCode }}
                          />
                          <span className="text-[0.7rem] font-bold text-slate-700 truncate">
                            {combo.color}
                          </span>
                        </div>
                        <p className="text-[0.62rem] text-slate-500 capitalize">{combo.finish} Finish</p>
                        <p className={`text-[0.6rem] font-bold mt-1 ${
                          isComplete ? "text-green-600" : filledCount > 0 ? "text-amber-600" : "text-slate-400"
                        }`}>
                          {filledCount === 0
                            ? "Using defaults"
                            : isComplete
                            ? "✓ Complete set"
                            : `${filledCount}/${totalSlots} uploaded`}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Active Variant Upload Grid */}
                {activeComboData && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border border-slate-300 shadow-inner"
                          style={{ backgroundColor: activeComboData.colorCode }}
                        />
                        <div>
                          <h5 className="text-sm font-bold text-slate-800">
                            {activeComboData.color} + {activeComboData.finish} Finish
                          </h5>
                          <p className="text-[0.68rem] text-slate-400 mt-0.5">
                            {activeVariantFilledCount === 0
                              ? "No variant images — will use default 360° images"
                              : `${activeVariantFilledCount}/${VIEW_360_SLOTS.length} images uploaded`}
                          </p>
                        </div>
                      </div>
                      {activeVariantFilledCount > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            // Clear all images for this variant
                            if (setView360Variants) {
                              setView360Variants((prev) =>
                                prev.filter(
                                  (v) => !(v.color === activeComboData.color && v.finish === activeComboData.finish)
                                )
                              );
                            }
                          }}
                          className="text-red-500 hover:text-red-600 text-[0.68rem] font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* 5-Slot Upload Grid for this variant */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {VIEW_360_SLOTS.map((slot) => {
                        const imageUrl = activeVariantV360[slot.key];
                        const uploadKey = `${activeComboData.color}|||${activeComboData.finish}-${slot.key}`;
                        const error = variantErrors[uploadKey];
                        const isSlotUploading = variantUploading[uploadKey];
                        const refKey = `${activeComboData.color}|||${activeComboData.finish}-${slot.key}`;

                        return renderSlotCard({
                          slot,
                          imageUrl,
                          error,
                          isUploading: isSlotUploading,
                          onFileSelect: (file) => handleVariantFileSelect(slot, file, activeComboData.color, activeComboData.finish),
                          onRemove: () => removeVariantSlot(activeComboData.color, activeComboData.finish, slot.key, slot.syncKey),
                          refKey,
                          onTriggerClick: () => triggerVariantFileInputClick(refKey),
                          setInputRef: (el) => setVariantFileInputRef(refKey, el),
                          onDrop: (e) => handleVariantDrop(e, slot, activeComboData.color, activeComboData.finish),
                        });
                      })}
                    </div>

                    {/* Preview button for this variant */}
                    {allVariantFilled && (
                      <div className="pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setVariantPreviewData({
                              view360: activeVariantV360,
                              label: `${activeComboData.color} + ${activeComboData.finish} Finish`,
                            });
                            setShowVariantPreview(true);
                          }}
                          className="bg-[#F97316] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#FB923C] shadow-sm transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Eye className="w-4 h-4 shrink-0" />
                          Preview {activeComboData.color} + {activeComboData.finish} 360°
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
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

      {/* Base Preview Modal */}
      {showPreview && allFilled && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  360° Interior Preview — Default
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
            <div className="p-4">
              <Cabin360Viewer
                view360={view360}
                productName={productName || "Product Preview"}
              />
            </div>
          </div>
        </div>
      )}

      {/* Variant Preview Modal */}
      {showVariantPreview && variantPreviewData && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  360° Interior Preview — {variantPreviewData.label}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Variant-specific 360° view for this configuration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowVariantPreview(false);
                  setVariantPreviewData(null);
                }}
                className="text-slate-400 hover:text-slate-700 transition cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <Cabin360Viewer
                view360={variantPreviewData.view360}
                productName={`${productName} — ${variantPreviewData.label}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
