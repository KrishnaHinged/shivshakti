"use client";

import { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import { ZoomIn, ZoomOut } from "lucide-react";
import getCroppedImg from "@/shared/lib/cropImage";
import { Modal, Button } from "@/shared/ui";

export default function CropModal({ file, aspect, slotLabel, onClose, onSave }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <Modal isOpen={!!file} onClose={onClose} size="lg" className="max-h-[90vh]">
      <Modal.Header showClose={!isProcessing}>
        <h3 className="font-bold text-slate-900 text-sm md:text-base">
          Adjust & Crop: {slotLabel}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 font-medium leading-none">
          Drag, zoom, and adjust the image to fit the required ratio.
        </p>
      </Modal.Header>

      <Modal.Body className="p-0">
        {/* Cropper area */}
        <div className="relative w-full h-[360px] md:h-[420px] bg-slate-950">
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
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
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
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!imageSrc}
          loading={isProcessing}
        >
          Crop & Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

