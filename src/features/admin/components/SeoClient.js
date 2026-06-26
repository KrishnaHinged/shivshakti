"use client";

import { useState } from "react";
import { updateSeoAction } from "../services/seoActions";
import { Plus, AlertTriangle, Edit, Info } from "lucide-react";

export default function SeoClient({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Form states
  const [pagePath, setPagePath] = useState("/");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [openGraphImage, setOpenGraphImage] = useState("");
  const [schemaMarkup, setSchemaMarkup] = useState("");

  const resetForm = () => {
    setPagePath("/");
    setMetaTitle("");
    setMetaDescription("");
    setOpenGraphImage("");
    setSchemaMarkup("");
    setEditingItem(null);
    setError("");
    setMessage("");
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setPagePath(item.pagePath);
    setMetaTitle(item.metaTitle);
    setMetaDescription(item.metaDescription);
    setOpenGraphImage(item.openGraphImage || "");
    setSchemaMarkup(item.schemaMarkup || "");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("pagePath", pagePath);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("openGraphImage", openGraphImage);
    formData.append("schemaMarkup", schemaMarkup);

    const res = await updateSeoAction(formData);
    setLoading(false);

    if (res.success) {
      const exists = items.some((i) => i.pagePath === pagePath);
      if (exists) {
        setItems(items.map((i) => (i.pagePath === pagePath ? res.data : i)));
      } else {
        setItems([res.data, ...items]);
      }
      setMessage("SEO metadata configurations saved successfully!");
      setShowForm(false);
      resetForm();
    } else {
      setError(res.error || "Saving failed.");
    }
  };

  const pages = [
    { value: "/", label: "Homepage (/)" },
    { value: "/#about", label: "About Us Section" },
    { value: "/#catalog", label: "Products Catalog" },
    { value: "/#gallery", label: "Gallery Section" },
    { value: "/#contact", label: "Contact Page" },
  ];

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">SEO Optimization</h1>
          <p className="text-slate-500 text-sm mt-1">Configure search meta tags, OpenGraph cards, and local business JSON-LD schemas.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-brand-orange text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-orange-light shadow-sm transition cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 shrink-0" /> Configure Page SEO
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
          <Info className="w-4 h-4 text-green-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {showForm ? (
        /* Form Card */
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm max-w-2xl">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            {editingItem ? `Edit SEO: ${editingItem.pagePath}` : "Configure Page SEO Details"}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Page Route Path</label>
              <select
                value={pagePath}
                onChange={(e) => setPagePath(e.target.value)}
                disabled={editingItem !== null}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
              >
                {pages.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Meta Title Tag</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                required
                placeholder="Target SEO Title"
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Meta Description Summary</label>
              <textarea
                rows="3"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                required
                placeholder="Target Description summary..."
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">OpenGraph share image URL</label>
              <input
                type="text"
                value={openGraphImage}
                onChange={(e) => setOpenGraphImage(e.target.value)}
                placeholder="Copy URL from Media Library"
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Structured Schema Markup (JSON-LD)</label>
              <textarea
                rows="6"
                value={schemaMarkup}
                onChange={(e) => setSchemaMarkup(e.target.value)}
                placeholder='{ "@context": "https://schema.org", "@type": "LocalBusiness", ... }'
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition font-mono"
              />
              <span className="text-[0.65rem] text-slate-400">Must be valid JSON formatting. Used for Manufacturer / Local Business snippets.</span>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="border border-slate-200 px-5 py-2.5 rounded-xl text-slate-600 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-brand-orange text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-orange-light shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Saving Configs..." : "Save SEO Config"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Pages List Table */
        <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-lg">SEO Page Configurations</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="py-12 text-slate-400 text-center italic">
                No routes configured. Click &quot;Configure Page SEO&quot; to set meta details.
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-slate-50/20 transition">
                  <div>
                    <span className="text-[0.68rem] font-bold text-brand-orange bg-brand-orange-pale px-2.5 py-0.5 rounded border border-brand-orange/20 uppercase tracking-widest font-mono">
                      {item.pagePath}
                    </span>
                    <h4 className="font-bold text-slate-800 text-[1rem] leading-snug mt-2.5">{item.metaTitle}</h4>
                    <p className="text-slate-400 text-xs mt-1 max-w-[560px] truncate">{item.metaDescription}</p>
                    {item.schemaMarkup && (
                      <span className="text-[0.62rem] font-bold text-brand-blue bg-brand-blue-pale border border-brand-blue-pale px-2 py-0.5 rounded uppercase mt-2 inline-block">
                        ✓ Schema JSON-LD Attached
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 px-4 py-2 rounded-lg text-xs font-bold shrink-0 self-end sm:self-center cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5 shrink-0" /> Edit Configurations
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
