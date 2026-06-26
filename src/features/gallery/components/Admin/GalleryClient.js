"use client";

import { useState } from "react";
import {
  createGalleryAction,
  editGalleryAction,
  deleteGalleryAction,
} from "@/features/gallery/services/actions";
import { Plus, AlertTriangle, Edit, Trash2 } from "lucide-react";

export default function GalleryClient({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("projects");
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState("0");

  const resetForm = () => {
    setTitle("");
    setImage("");
    setCategory("projects");
    setFeatured(false);
    setSortOrder("0");
    setEditingItem(null);
    setError("");
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setImage(item.image);
    setCategory(item.category);
    setFeatured(item.featured || false);
    setSortOrder(String(item.sortOrder || 0));
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("category", category);
    formData.append("featured", featured ? "true" : "false");
    formData.append("sortOrder", sortOrder);

    let res;
    if (editingItem) {
      res = await editGalleryAction(editingItem._id, formData);
    } else {
      res = await createGalleryAction(formData);
    }

    setLoading(false);
    if (res.success) {
      if (editingItem) {
        setItems(items.map((i) => (i._id === editingItem._id ? res.data : i)));
      } else {
        setItems([res.data, ...items]);
      }
      setShowForm(false);
      resetForm();
    } else {
      setError(res.error || "Action failed.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this gallery item?")) {
      const res = await deleteGalleryAction(id);
      if (res.success) {
        setItems(items.filter((i) => i._id !== id));
      } else {
        alert("Failed to delete gallery item.");
      }
    }
  };

  const categories = [
    { value: "factory", label: "Factory & Facility" },
    { value: "cabins", label: "Elevator Cabins" },
    { value: "doors", label: "Automatic Doors" },
    { value: "projects", label: "Landmark Projects" },
    { value: "installations", label: "Installations" },
    { value: "wire_rope", label: "Wire Ropes" },
    { value: "events", label: "Events & Exhibitions" },
  ];

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gallery Management</h1>
          <p className="text-slate-500 text-sm mt-1">Configure layout categories and showcase images on the landing page.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-brand-orange text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-orange-light shadow-sm transition cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 shrink-0" /> Add Gallery Image
        </button>
      </div>

      {showForm ? (
        /* Form view */
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm max-w-xl">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            {editingItem ? "Edit Gallery Details" : "Add Image to Gallery"}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Image Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Surat office front facade"
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                placeholder="Copy URL from Media Library"
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Display Order Sequence</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                />
              </div>

            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4.5 h-4.5 accent-brand-orange rounded"
              />
              <label htmlFor="featured" className="text-xs font-bold text-slate-600 cursor-pointer">
                Feature on Public Landing Showcase
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="border border-slate-200 px-5 py-2 rounded-xl text-slate-600 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-brand-orange text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-orange-light shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Saving..." : "Save Image"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Grid view */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.length === 0 ? (
            <div className="col-span-full bg-white border border-slate-150 rounded-2xl py-16 text-slate-400 text-center italic">
              No gallery images configured. Click "Add Gallery Image" to publish items.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group"
              >
                <div className="relative aspect-video bg-slate-100 border-b border-slate-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 text-[0.62rem] font-extrabold uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                    {categories.find((c) => c.value === item.category)?.label || item.category}
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-[0.88rem] truncate flex items-center gap-1.5 justify-between">
                      {item.title}
                      {item.featured && <span className="text-[0.65rem] text-brand-orange">★</span>}
                    </h4>
                    <p className="text-[0.68rem] text-slate-400 font-bold uppercase mt-1">
                      Display Order: {item.sortOrder || 0}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-50 pt-3">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="bg-slate-100 text-slate-700 hover:bg-slate-200 py-1.5 rounded-lg font-semibold text-center cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5 shrink-0 text-slate-500" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 py-1.5 rounded-lg font-semibold text-center cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0 text-red-500" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
