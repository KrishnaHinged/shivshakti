"use client";

import { useState } from "react";
import {
  createTestimonialAction,
  editTestimonialAction,
  deleteTestimonialAction,
} from "@/actions/testimonials";
import { Plus, AlertTriangle, Edit, Trash2 } from "lucide-react";

export default function TestimonialsClient({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState("5");
  const [review, setReview] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("published");
  const [displayOrder, setDisplayOrder] = useState("0");

  const resetForm = () => {
    setName("");
    setRole("");
    setRating("5");
    setReview("");
    setImage("");
    setStatus("published");
    setDisplayOrder("0");
    setEditingItem(null);
    setError("");
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setName(item.name);
    setRole(item.role);
    setRating(String(item.rating || 5));
    setReview(item.review);
    setImage(item.image || "");
    setStatus(item.status || "published");
    setDisplayOrder(String(item.displayOrder || 0));
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("rating", rating);
    formData.append("review", review);
    formData.append("image", image);
    formData.append("status", status);
    formData.append("displayOrder", displayOrder);

    let res;
    if (editingItem) {
      res = await editTestimonialAction(editingItem._id, formData);
    } else {
      res = await createTestimonialAction(formData);
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
    if (confirm("Are you sure you want to delete this testimonial?")) {
      const res = await deleteTestimonialAction(id);
      if (res.success) {
        setItems(items.filter((i) => i._id !== id));
      } else {
        alert("Failed to delete testimonial.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Testimonials CMS</h1>
          <p className="text-slate-500 text-sm mt-1">Configure client feedback quotes, roles, ratings and publishing order.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-brand-orange text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-orange-light shadow-sm transition cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 shrink-0" /> Add Testimonial
        </button>
      </div>

      {showForm ? (
        /* Form view */
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm max-w-xl">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            {editingItem ? "Edit Testimonial Details" : "Add Testimonial"}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Author Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Shadman Sheikh"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Role / Company</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  placeholder="e.g. Managing Director"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Star Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Publish Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                >
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Display Sequence</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Customer Avatar Image URL (Optional)</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Can leave blank for initials"
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Customer Review Statement</label>
              <textarea
                rows="4"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
              />
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
                {loading ? "Saving..." : "Save Testimonial"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Testimonials List view */
        <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-lg">Testimonials Registry</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="py-12 text-slate-400 text-center italic">
                No testimonials registered. Click "Add Testimonial" to configure reviews.
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-slate-50/30 transition duration-150">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-slate-950 text-base">{item.name}</h4>
                      <span className="text-[0.72rem] bg-brand-blue-pale text-brand-blue font-bold px-2.5 py-0.5 rounded">
                        {item.role}
                      </span>
                    </div>
                    
                    <div className="flex gap-0.5 text-brand-orange text-xs mt-1.5">
                      {[...Array(item.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>

                    <p className="text-slate-600 text-sm italic mt-3.5 leading-relaxed bg-slate-50 border border-slate-100 p-4.5 rounded-xl">
                      "{item.review}"
                    </p>
                  </div>

                  <div className="flex md:flex-col items-end gap-2 shrink-0">
                    <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      item.status === "published" ? "bg-green-50 text-green-700 border border-green-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-[0.68rem] text-slate-400 font-bold uppercase tracking-wide mt-1">
                      Order: {item.displayOrder || 0}
                    </span>
                    
                    <div className="flex gap-2 mt-4 text-xs">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 px-3 py-1.5 rounded-lg font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5 shrink-0" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
