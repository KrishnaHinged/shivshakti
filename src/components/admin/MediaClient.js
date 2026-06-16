"use client";

import { useState } from "react";
import { deleteMediaAction } from "@/actions/media";
import { AlertTriangle, File, Copy, Trash2 } from "lucide-react";

export default function MediaClient({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState("products");
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploading(false);

      if (res.ok && data.success) {
        setItems([data.data, ...items]);
        setFile(null);
        e.target.reset();
      } else {
        setError(data.error || "Upload failed.");
      }
    } catch (err) {
      setUploading(false);
      setError("Network error occurred during upload.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this asset from the cloud?")) {
      const res = await deleteMediaAction(id);
      if (res.success) {
        setItems(items.filter((item) => item._id !== id));
      } else {
        alert(res.error || "Failed to delete asset.");
      }
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert("Asset URL copied to clipboard!");
  };

  const filteredItems = items.filter((item) =>
    item.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Media Library</h1>
        <p className="text-slate-500 text-sm mt-1">Upload and copy URLs of product images, brochures, and gallery files.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-start">
        
        {/* Upload Form Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          <h2 className="font-bold text-slate-900 text-lg mb-5">Upload Asset</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl mb-4 leading-normal flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Select File</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                required
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
              />
              <span className="text-[0.68rem] text-slate-400">PDF brochure or images only. Max 10MB.</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Destination Folder</label>
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
              >
                <option value="products">Products</option>
                <option value="gallery">Gallery</option>
                <option value="factory">Factory</option>
                <option value="brochures">PDF Brochures</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="bg-brand-orange text-white w-full rounded-xl py-3 mt-1.5 font-bold uppercase tracking-wider text-xs hover:bg-brand-orange-light transition disabled:opacity-50 cursor-pointer"
            >
              {uploading ? "Uploading to Cloudinary..." : "Start Upload"}
            </button>
          </form>
        </div>

        {/* Media Explorer Grid Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          
          {/* Filter Bar */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search assets by file name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4.5 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
            />
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-slate-400 text-sm py-16 text-center italic">
              No files found in the media library.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col justify-between group"
                >
                  <div className="relative aspect-video w-full bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100">
                    {item.fileType === "image" ? (
                      <img
                        src={item.url}
                        alt={item.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3 text-center">
                        <File className="w-8 h-8 text-slate-400" />
                        <span className="text-[0.72rem] font-bold text-red-500 uppercase mt-1">PDF</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 bg-white flex flex-col gap-2">
                    <p className="text-[0.78rem] font-bold text-slate-700 truncate" title={item.fileName}>
                      {item.fileName}
                    </p>
                    <p className="text-[0.65rem] text-slate-400 uppercase tracking-wider font-semibold">
                      {item.folder} • {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                    
                    <div className="grid grid-cols-2 gap-1.5 mt-1 border-t border-slate-50 pt-2 text-xs">
                      <button
                        onClick={() => handleCopyUrl(item.url)}
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 py-1.5 rounded font-semibold text-center text-[0.68rem] cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Copy className="w-3 h-3 text-slate-500 shrink-0" /> Copy URL
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 py-1.5 rounded font-semibold text-center text-[0.68rem] cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3 text-red-500 shrink-0" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
