"use client";

import { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import getCroppedImg from "@/lib/cropImage";

export default function CropModal({ file, aspect, slotLabel, onClose, onSave }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, file.type);
      // Create a File object from the Blob so it behaves exactly like a uploaded file
      const croppedFile = new File([croppedBlob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
      onSave(croppedFile);
    } catch (error) {
      console.error("Failed to crop image:", error);
      alert("Failed to crop image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm md:text-base">
              Adjust & Crop: {slotLabel}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Drag, zoom, and adjust the image to fit the required ratio.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-slate-700 transition cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper area */}
        <div className="relative w-full h-[400px] md:h-[450px] bg-slate-950">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </div>

        {/* Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-b border-slate-100 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-500 w-12 flex items-center gap-1 select-none">
              Zoom
            </span>
            <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#F97316]"
            />
            <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-mono text-slate-500 w-8 text-right select-none">
              {zoom.toFixed(1)}x
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isProcessing || !imageSrc}
            className="px-5 py-2 bg-[#F97316] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#FB923C] disabled:opacity-50 shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            {isProcessing ? "Processing..." : "Crop & Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
