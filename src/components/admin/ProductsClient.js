"use client";

import { useState } from "react";
import {
  createProductAction,
  editProductAction,
  deleteProductAction,
  duplicateProductAction,
  archiveProductAction,
} from "@/actions/products";
import { Plus, AlertTriangle, Archive, Copy, Edit, Trash2, Eye } from "lucide-react";

export default function ProductsClient({ products: initialProducts, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("in-house");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [images, setImages] = useState("");
  const [badge, setBadge] = useState("");
  const [badgeColor, setBadgeColor] = useState("brand-blue");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [highlights, setHighlights] = useState("");
  
  // PDF Downloads States
  const [brochureUrl, setBrochureUrl] = useState("");
  const [techSpecsUrl, setTechSpecsUrl] = useState("");
  const [installGuideUrl, setInstallGuideUrl] = useState("");
  
  // Specs Editor States
  const [specs, setSpecs] = useState({});
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!editingProduct) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleAddSpec = (e) => {
    e.preventDefault();
    if (specKey.trim() && specVal.trim()) {
      setSpecs({ ...specs, [specKey.trim()]: specVal.trim() });
      setSpecKey("");
      setSpecVal("");
    }
  };

  const handleRemoveSpec = (keyToRemove) => {
    const updated = { ...specs };
    delete updated[keyToRemove];
    setSpecs(updated);
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setCategory("in-house");
    setShortDescription("");
    setDescription("");
    setFeaturedImage("");
    setImages("");
    setBadge("");
    setBadgeColor("brand-blue");
    setStatus("draft");
    setFeatured(false);
    setSeoTitle("");
    setSeoDescription("");
    setDisplayOrder(0);
    setHighlights("");
    setSpecs({});
    setBrochureUrl("");
    setTechSpecsUrl("");
    setInstallGuideUrl("");
    setEditingProduct(null);
    setError("");
    setActiveTab("general");
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSlug(p.slug);
    setCategory(p.category);
    setShortDescription(p.shortDescription || "");
    setDescription(p.fullDescription || p.description || "");
    setFeaturedImage(p.featuredImage);
    setImages(p.galleryImages ? p.galleryImages.join(", ") : (p.images ? p.images.join(", ") : ""));
    setBadge(p.badge || "");
    setBadgeColor(p.badgeColor || "brand-blue");
    setStatus(p.status || "draft");
    setFeatured(p.featured || false);
    setSeoTitle(p.seoTitle || "");
    setSeoDescription(p.seoDescription || "");
    setDisplayOrder(p.displayOrder || 0);
    setHighlights(p.highlights ? p.highlights.join("\n") : "");
    setBrochureUrl(p.brochureUrl || "");
    setTechSpecsUrl(p.techSpecsUrl || "");
    setInstallGuideUrl(p.installGuideUrl || "");
    
    // Parse specs safely
    const originalSpecs = p.specifications || p.specs || {};
    const specsMap = originalSpecs instanceof Map ? Object.fromEntries(originalSpecs) : originalSpecs;
    setSpecs(specsMap);

    setActiveTab("general");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("category", category);
    formData.append("shortDescription", shortDescription);
    formData.append("description", description); // represents fullDescription
    formData.append("featuredImage", featuredImage);
    formData.append("images", images);
    formData.append("badge", badge);
    formData.append("badgeColor", badgeColor);
    formData.append("status", status);
    formData.append("featured", featured ? "true" : "false");
    formData.append("seoTitle", seoTitle);
    formData.append("seoDescription", seoDescription);
    formData.append("displayOrder", displayOrder);
    formData.append("highlights", highlights);
    formData.append("specs", JSON.stringify(specs));
    formData.append("brochureUrl", brochureUrl);
    formData.append("techSpecsUrl", techSpecsUrl);
    formData.append("installGuideUrl", installGuideUrl);

    let res;
    if (editingProduct) {
      res = await editProductAction(editingProduct._id, formData);
    } else {
      res = await createProductAction(formData);
    }

    setLoading(false);
    if (res.success) {
      if (editingProduct) {
        setProducts(products.map((item) => (item._id === editingProduct._id ? res.data : item)));
      } else {
        setProducts([res.data, ...products]);
      }
      setShowForm(false);
      resetForm();
    } else {
      setError(res.error || "Action failed.");
    }
  };

  const handleDuplicate = async (id) => {
    const res = await duplicateProductAction(id);
    if (res.success) {
      setProducts([res.data, ...products]);
    } else {
      alert("Failed to duplicate product.");
    }
  };

  const handleToggleArchive = async (id, currentStatus) => {
    const isArchived = currentStatus === "archived";
    const res = await archiveProductAction(id, !isArchived);
    if (res.success) {
      setProducts(
        products.map((item) =>
          item._id === id ? { ...item, status: isArchived ? "draft" : "archived" } : item
        )
      );
    } else {
      alert("Failed to change status.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const res = await deleteProductAction(id);
      if (res.success) {
        setProducts(products.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete product.");
      }
    }
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "specs", label: "Specifications" },
    { id: "gallery", label: "Gallery" },
    { id: "downloads", label: "Downloads" },
    { id: "seo", label: "SEO" },
    { id: "publish", label: "Publish" },
  ];

  return (
    <div className="flex flex-col gap-8 font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products CMS</h1>
          <p className="text-slate-500 text-sm mt-1">Manage catalog specs, badges, images and listings status.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-brand-orange text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-orange-light shadow-sm transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 shrink-0" /> Add New Product
          </button>
        )}
      </div>

      {showForm ? (
        /* FORM CARD */
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? `Edit Product: ${editingProduct.title}` : "Add New Product"}
              </h2>
            </div>
            
            {/* Live Preview Button */}
            {slug && (
              <a
                href={`/products/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-500 shrink-0" /> Preview Product
              </a>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Tabs Bar */}
          <div className="flex border-b border-slate-200 mb-6 gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-brand-orange text-brand-orange"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* TAB 1: General Info */}
            {activeTab === "general" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Product Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Slug URL Path</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Display Sort Order</label>
                      <input
                        type="number"
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Short Card Description</label>
                    <input
                      type="text"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      required
                      placeholder="Summary shown on product listing grids."
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Key Highlights (One per line)</label>
                    <textarea
                      rows="3"
                      value={highlights}
                      onChange={(e) => setHighlights(e.target.value)}
                      placeholder="e.g. 304 Grade Stainless Steel&#10;Highly silent operations&#10;Corrosion resistant"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Full Description (HTML Supported)</label>
                  <textarea
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Provide a detailed, rich text description of the product. Standard HTML tags (headings, tables, lists) are supported."
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition font-mono"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Specifications List Map */}
            {activeTab === "specs" && (
              <div className="flex flex-col gap-4 max-w-2xl">
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase">Technical Specifications Editor</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Define clean dynamic key-value parameters. These render as a professional table on the product details view.</p>
                  </div>
                  
                  {Object.keys(specs).length === 0 ? (
                    <p className="text-slate-400 text-xs italic bg-white p-4 rounded-xl border border-slate-100">No specifications added yet. Fill in the fields below to add specs.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-100">
                      {Object.entries(specs).map(([k, v]) => (
                        <div key={k} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium pl-3 pr-2 py-2 rounded-lg flex justify-between items-center shadow-sm">
                          <div>
                            <span className="text-slate-400 capitalize mr-1">{k}:</span>
                            <strong>{v}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpec(k)}
                            className="text-slate-400 hover:text-red-500 text-base font-bold font-mono pl-1 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap sm:flex-nowrap gap-3 mt-2">
                    <input
                      type="text"
                      placeholder="e.g. Material"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Brushed Gold Steel"
                      value={specVal}
                      onChange={(e) => setSpecVal(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="bg-brand-blue text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-blue-light cursor-pointer shadow-sm"
                    >
                      Add Spec
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Gallery / Assets URLs */}
            {activeTab === "gallery" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Primary Featured Image URL</label>
                    <input
                      type="text"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="/images/products/example.png or Cloudinary URL"
                      required
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                    />
                  </div>
                  {featuredImage && (
                    <div className="border border-slate-100 rounded-xl p-3 bg-slate-50 flex items-center justify-center h-48 overflow-hidden">
                      <img src={featuredImage} alt="Featured Preview" className="h-full object-contain" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Gallery Images (Comma-separated URLs)</label>
                    <textarea
                      rows="3"
                      value={images}
                      onChange={(e) => setImages(e.target.value)}
                      placeholder="/images/product-1.png, /images/product-2.png"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition font-mono"
                    />
                  </div>
                  {images && (
                    <div className="grid grid-cols-3 gap-2">
                      {images.split(",").map((i, idx) => {
                        const trimmed = i.trim();
                        if (!trimmed) return null;
                        return (
                          <div key={idx} className="border border-slate-100 rounded-lg p-1 bg-slate-50 flex items-center justify-center aspect-square overflow-hidden">
                            <img src={trimmed} alt="Thumb Preview" className="h-full object-cover" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Search Engine Optimization */}
            {activeTab === "seo" && (
              <div className="flex flex-col gap-4 max-w-2xl">
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase">SEO Custom Metatags</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Optimize how this product is index-crawled and shared on Social Networks (Google, Facebook, Twitter).</p>
                  </div>
                  
                  <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-100">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500">Custom Title Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. Premium SS Automatic Doors | Shivshakti Elevator"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-orange focus:bg-white transition"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500">Custom Meta Description</label>
                      <textarea
                        rows="3"
                        placeholder="Write a search snippet targeting keyword queries."
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none focus:border-brand-orange focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PDF Product Downloads */}
            {activeTab === "downloads" && (
              <div className="flex flex-col gap-4 max-w-2xl">
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase">Product Downloads</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Provide links to downloadable resources for this product. Use URLs from the Cloudinary media library or any PDF path.</p>
                  </div>

                  <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-100">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Brochure PDF URL</label>
                      <input
                        type="text"
                        placeholder="e.g. https://res.cloudinary.com/demo/image/upload/v1/brochures/ss-cabin.pdf"
                        value={brochureUrl}
                        onChange={(e) => setBrochureUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-orange focus:bg-white transition font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Technical Specifications PDF URL</label>
                      <input
                        type="text"
                        placeholder="e.g. https://res.cloudinary.com/demo/image/upload/v1/specs/ss-cabin.pdf"
                        value={techSpecsUrl}
                        onChange={(e) => setTechSpecsUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-orange focus:bg-white transition font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Installation Guide PDF URL</label>
                      <input
                        type="text"
                        placeholder="e.g. https://res.cloudinary.com/demo/image/upload/v1/guides/ss-cabin.pdf"
                        value={installGuideUrl}
                        onChange={(e) => setInstallGuideUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-orange focus:bg-white transition font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Publish Settings */}
            {activeTab === "publish" && (
              <div className="flex flex-col gap-5 max-w-xl">
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase">Publishing Controls</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Control live indexing and featured homepage lists.</p>
                  </div>

                  <div className="flex flex-col gap-4 bg-white p-5 rounded-xl border border-slate-100">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Visibility Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                      >
                        <option value="draft">Draft (CMS only, hidden from public)</option>
                        <option value="published">Published (Live in catalog & search)</option>
                        <option value="archived">Archived (Deactivated list status)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2.5 mt-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-5 h-5 accent-brand-orange rounded cursor-pointer"
                      />
                      <label htmlFor="featured" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                        Feature on Homepage (Top 3 priority featured list)
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2 border-t border-slate-100 pt-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[0.65rem] font-bold text-slate-400 uppercase">Badge Text</label>
                        <input
                          type="text"
                          value={badge}
                          onChange={(e) => setBadge(e.target.value)}
                          placeholder="e.g. Best Seller"
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[0.65rem] font-bold text-slate-400 uppercase">Badge Theme</label>
                        <select
                          value={badgeColor}
                          onChange={(e) => setBadgeColor(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none"
                        >
                          <option value="brand-blue">Blue (Accent)</option>
                          <option value="brand-orange">Orange (Highlight)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions footer */}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="border border-slate-200 px-6 py-2.5 rounded-xl text-slate-600 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-brand-orange text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-orange-light shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Saving..." : editingProduct ? "Update Product" : "Publish Product"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* PRODUCTS LIST TABLE */
        <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-lg">Product Catalog Table</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[0.72rem] uppercase font-bold tracking-wider border-b border-slate-100">
                  <th className="py-4.5 px-6">Image</th>
                  <th className="py-4.5 px-6">Product Details</th>
                  <th className="py-4.5 px-6">Category</th>
                  <th className="py-4.5 px-6">Badge</th>
                  <th className="py-4.5 px-6">Status</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-slate-400 text-center italic">
                      No products found. Click "Add New Product" to publish items.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/40 transition duration-150 text-slate-800">
                      <td className="py-4 px-6 shrink-0">
                        <img
                          src={p.featuredImage}
                          alt={p.title}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-100 shadow-sm"
                        />
                      </td>
                      <td className="py-4 px-6 min-w-[200px]">
                        <h4 className="font-bold text-slate-800 text-[0.92rem] flex items-center gap-1.5">
                          {p.title}
                          {p.featured && (
                            <span className="text-[0.62rem] font-bold text-brand-orange bg-brand-orange-pale px-2 py-0.5 rounded">
                              ★ Featured
                            </span>
                          )}
                        </h4>
                        <p className="text-slate-400 text-[0.78rem] mt-0.5 max-w-[280px] truncate">
                          {p.shortDescription}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[0.78rem] font-semibold text-brand-blue uppercase tracking-wider">
                          {categories.find((c) => c.slug === p.category)?.name || p.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {p.badge ? (
                          <span className={`text-[0.7rem] font-bold px-2.5 py-0.5 rounded ${
                            p.badgeColor === "brand-orange" ? "bg-brand-orange-pale text-brand-orange" : "bg-brand-blue-pale text-brand-blue"
                          }`}>
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs italic">None</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          p.status === "active" || p.status === "published" 
                            ? "bg-green-50 text-green-700 border border-green-200" 
                            : p.status === "draft"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2 text-xs">
                          {p.slug && (
                            <a
                              href={`/products/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold cursor-pointer flex items-center gap-1"
                              title="Preview product on dynamic page"
                            >
                              <Eye className="w-3.5 h-3.5 shrink-0 text-slate-500" /> Preview
                            </a>
                          )}
                          <button
                            onClick={() => handleToggleArchive(p._id, p.status)}
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold cursor-pointer flex items-center gap-1"
                            title={p.status === "archived" ? "Activate Product" : "Archive Product"}
                          >
                            <Archive className="w-3.5 h-3.5 shrink-0" /> {p.status === "archived" ? "Activate" : "Archive"}
                          </button>
                          <button
                            onClick={() => handleDuplicate(p._id)}
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold cursor-pointer flex items-center gap-1"
                            title="Duplicate Product"
                          >
                            <Copy className="w-3.5 h-3.5 shrink-0" /> Duplicate
                          </button>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 px-3 py-1.5 rounded-lg font-semibold cursor-pointer flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5 shrink-0" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-semibold cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5 shrink-0" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
