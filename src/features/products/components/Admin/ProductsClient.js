"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useMemo, useEffect } from "react";
import {
  createProductAction,
  editProductAction,
  deleteProductAction,
  duplicateProductAction,
  archiveProductAction,
} from "../../services/actions";
import { Plus, AlertTriangle, Archive, Copy, Edit, Trash2, Eye, Upload } from "lucide-react";
import { View360Uploader } from "@/features/configurator";
import { Button } from "@/shared/ui";

export default function ProductsClient({ products: initialProducts, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  // Redesign List Tabs State
  const [listMainTab, setListMainTab] = useState("our-product"); // 'our-product' | 'dealer-product' | 'elevator-kit'
  const [ourProductsSubTab, setOurProductsSubTab] = useState("all"); // 'all' | 'door' | 'cabin' | 'frame'
  const [dealerBrandFilter, setDealerBrandFilter] = useState("all");

  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("door");
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

  // Redesign Form States
  const [productType, setProductType] = useState("our-product"); // 'our-product' | 'dealer-product' | 'elevator-kit'
  const [brand, setBrand] = useState("");
  const [subCategory, setSubCategory] = useState("Automatic Doors");
  const [inquiryEnabled, setInquiryEnabled] = useState(true);
  
  // PDF Downloads States
  const [brochureUrl, setBrochureUrl] = useState("");
  const [techSpecsUrl, setTechSpecsUrl] = useState("");
  const [installGuideUrl, setInstallGuideUrl] = useState("");
  
  // 360° View States
  const [has360View, setHas360View] = useState(false);
  const [view360, setView360] = useState({ front: "", back: "", left: "", right: "", ceiling: "", floor: "" });
  const [view360Errors, setView360Errors] = useState({});
  
  // Specs Editor States
  const [specs, setSpecs] = useState({});
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");

  // Upload States
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Customization Configuration States
  const [availableColors, setAvailableColors] = useState([
    { name: "Dark Grey", code: "#4B5563", enabled: true },
    { name: "Gold", code: "#D4AF37", enabled: true },
    { name: "Rose Gold", code: "#B76E79", enabled: true },
  ]);
  const [availableFinishes, setAvailableFinishes] = useState([
    { name: "Mirror", code: "mirror", enabled: true },
    { name: "Hairline", code: "hairline", enabled: true },
  ]);
  const [defaultColor, setDefaultColor] = useState("Dark Grey");
  const [defaultFinish, setDefaultFinish] = useState("Mirror");
  const [customizationVariants, setCustomizationVariants] = useState([]);
  const [view360Variants, setView360Variants] = useState([]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorCode, setNewColorCode] = useState("");
  const [newFinishName, setNewFinishName] = useState("");

  // Normalization helper for backward compatibility
  const normalizeProduct = (p) => {
    const type = p.productType || (p.category === "in-house" ? "our-product" : p.category === "elevator-kit" ? "elevator-kit" : "dealer-product");
    let category = p.category;
    let subCategory = p.subCategory;
    if (p.category === "in-house") {
      category = p.title.toLowerCase().includes("cabin") ? "cabin" : p.title.toLowerCase().includes("frame") ? "frame" : "door";
      subCategory = p.title.toLowerCase().includes("cabin") ? "SS Cabins" : p.title.toLowerCase().includes("frame") ? "Door Frames" : p.title.toLowerCase().includes("automatic") ? "Automatic Doors" : "Manual Doors";
    }
    return {
      ...p,
      productType: type,
      category,
      subCategory: subCategory || "",
    };
  };

  const normalizedProducts = useMemo(() => {
    return products.map(normalizeProduct);
  }, [products]);

  // Filters for display
  const displayedProducts = useMemo(() => {
    return normalizedProducts.filter((p) => {
      if (listMainTab !== p.productType) return false;

      if (listMainTab === "our-product") {
        if (ourProductsSubTab !== "all") {
          return p.category === ourProductsSubTab;
        }
      }

      if (listMainTab === "dealer-product") {
        if (dealerBrandFilter !== "all") {
          return p.brand === dealerBrandFilter;
        }
      }

      return true;
    });
  }, [normalizedProducts, listMainTab, ourProductsSubTab, dealerBrandFilter]);

  // Distinct Brands filter
  const dealerBrands = useMemo(() => {
    const brands = new Set();
    normalizedProducts
      .filter((p) => p.productType === "dealer-product")
      .forEach((p) => {
        if (p.brand) brands.add(p.brand);
      });
    return Array.from(brands);
  }, [normalizedProducts]);

  // Subcategory list mapping for manufactured products
  const subCategoryOptions = useMemo(() => {
    if (category === "door") {
      return ["Automatic Doors", "Manual Doors", "Telescopic Doors", "Center Opening Doors"];
    }
    if (category === "cabin") {
      return ["SS Cabins", "Glass Cabins", "Designer Cabins"];
    }
    if (category === "frame") {
      return ["Door Frames", "Special Frames"];
    }
    if (category === "layout-cabin") {
      return ["Layout Cabins"];
    }
    return [];
  }, [category]);

  // Dynamic Tabs based on Product Type selection
  const tabs = useMemo(() => {
    if (productType === "elevator-kit") {
      return [
        { id: "general", label: "General" },
        { id: "gallery", label: "Gallery" },
        { id: "publish", label: "Publish" },
      ];
    }
    if (productType === "dealer-product") {
      return [
        { id: "general", label: "General" },
        { id: "specs", label: "Specifications" },
        { id: "gallery", label: "Gallery" },
        { id: "seo", label: "SEO" },
        { id: "publish", label: "Publish" },
      ];
    }
    const baseTabs = [
      { id: "general", label: "General" },
      { id: "specs", label: "Specifications" },
      { id: "gallery", label: "Gallery" },
    ];
    if (category === "layout-cabin") {
      baseTabs.push({ id: "customization", label: "Variants Configuration" });
    }
    baseTabs.push(
      { id: "360", label: "360° View" },
      { id: "downloads", label: "Downloads" },
      { id: "seo", label: "SEO" },
      { id: "publish", label: "Publish" }
    );
    return baseTabs;
  }, [productType, category]);

  // Watch productType to adjust defaults
  useEffect(() => {
    if (editingProduct) return;
    if (productType === "our-product") {
      setCategory("door");
      setSubCategory("Automatic Doors");
    } else if (productType === "dealer-product") {
      setCategory("Safety Components");
      setSubCategory("");
    } else if (productType === "elevator-kit") {
      setCategory("elevator-kit");
      setSubCategory("");
    }
  }, [productType, editingProduct]);

  // Watch category under Our Products
  useEffect(() => {
    if (productType === "our-product") {
      if (category === "door") setSubCategory("Automatic Doors");
      else if (category === "cabin") setSubCategory("SS Cabins");
      else if (category === "frame") setSubCategory("Door Frames");
      else if (category === "layout-cabin") setSubCategory("Layout Cabins");
    }
  }, [category, productType]);

  const handleUploadFeaturedImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingFeatured(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.success) {
        setFeaturedImage(data.data.url);
      } else {
        setError(data.error || "Featured image upload failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error during featured image upload.");
    } finally {
      setUploadingFeatured(false);
    }
  };

  const handleUploadGalleryImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setUploadingGallery(true);
    setError("");
    
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "products");

        const res = await fetch("/api/media", { method: "POST", body: formData });
        const data = await res.json();

        if (res.ok && data.success) {
          uploadedUrls.push(data.data.url);
        } else {
          console.error(`Failed to upload ${file.name}:`, data.error);
        }
      }
      
      if (uploadedUrls.length > 0) {
        const currentList = images
          ? images.split(",").map(i => i.trim()).filter(Boolean)
          : [];
        const newList = [...currentList, ...uploadedUrls];
        setImages(newList.join(", "));
      }
    } catch (err) {
      console.error(err);
      setError("Network error during gallery upload.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleUploadVariantImage = async (color, finish, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok && data.success) {
        const imageUrl = data.data.url;
        setCustomizationVariants((prev) => {
          const exists = prev.some((v) => v.color === color && v.finish === finish);
          if (exists) {
            return prev.map((v) =>
              v.color === color && v.finish === finish ? { ...v, image: imageUrl } : v
            );
          } else {
            return [...prev, { color, finish, image: imageUrl, enabled: true }];
          }
        });
      } else {
        setError(data.error || "Variant image upload failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error during variant image upload.");
    }
  };

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
    setCategory("door");
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
    setHas360View(false);
    setView360({ front: "", back: "", left: "", right: "", ceiling: "", floor: "" });
    setView360Errors({});
    setEditingProduct(null);
    setError("");
    setActiveTab("general");
    
    // New fields
    setProductType("our-product");
    setBrand("");
    setSubCategory("Automatic Doors");
    setInquiryEnabled(true);

    // Reset Customization states
    setAvailableColors([
      { name: "Dark Grey", code: "#4B5563", enabled: true },
      { name: "Gold", code: "#D4AF37", enabled: true },
      { name: "Rose Gold", code: "#B76E79", enabled: true },
    ]);
    setAvailableFinishes([
      { name: "Mirror", code: "mirror", enabled: true },
      { name: "Hairline", code: "hairline", enabled: true },
    ]);
    setDefaultColor("Dark Grey");
    setDefaultFinish("Mirror");
    setCustomizationVariants([]);
    setView360Variants([]);
  };

  const handleOpenEdit = (rawP) => {
    const p = normalizeProduct(rawP);
    setEditingProduct(p);
    setTitle(p.title);
    setSlug(p.slug);
    
    setProductType(p.productType);
    setCategory(p.category);
    setBrand(p.brand || "");
    setSubCategory(p.subCategory || "");
    setInquiryEnabled(p.inquiryEnabled !== false);

    setShortDescription(p.shortDescription || "");
    setDescription(p.fullDescription || p.description || "");
    setFeaturedImage(p.featuredImage || "");
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
    setHas360View(p.has360View || false);
    setView360(p.view360 || { front: "", back: "", left: "", right: "", ceiling: "", floor: "" });
    setView360Errors({});
    
    // Parse specs safely
    const originalSpecs = p.specifications || p.specs || {};
    const specsMap = originalSpecs instanceof Map ? Object.fromEntries(originalSpecs) : originalSpecs;
    setSpecs(specsMap);

    // Load customization states
    setAvailableColors(p.availableColors && p.availableColors.length > 0 ? p.availableColors : [
      { name: "Dark Grey", code: "#4B5563", enabled: true },
      { name: "Gold", code: "#D4AF37", enabled: true },
      { name: "Rose Gold", code: "#B76E79", enabled: true },
    ]);
    setAvailableFinishes(p.availableFinishes && p.availableFinishes.length > 0 ? p.availableFinishes : [
      { name: "Mirror", code: "mirror", enabled: true },
      { name: "Hairline", code: "hairline", enabled: true },
    ]);
    setDefaultColor(p.defaultColor || "Dark Grey");
    setDefaultFinish(p.defaultFinish || "Mirror");
    setCustomizationVariants(p.customizationVariants || []);
    setView360Variants(p.view360Variants || []);

    setActiveTab("general");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side 360° validation before submitting
    if (productType === "our-product" && has360View) {
      const view360Fields = ["front", "back", "left", "right", "ceiling", "floor"];
      const missing = view360Fields.filter((f) => !view360[f]);
      if (missing.length > 0) {
        setError(`Please upload all 6 view 360° images. Missing: ${missing.join(", ")}`);
        setLoading(false);
        setActiveTab("360");
        return;
      }
    }

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
    
    // Redesign Fields
    formData.append("productType", productType);
    formData.append("brand", brand);
    formData.append("subCategory", subCategory);
    formData.append("inquiryEnabled", inquiryEnabled ? "true" : "false");

    if (productType === "our-product") {
      formData.append("brochureUrl", brochureUrl);
      formData.append("techSpecsUrl", techSpecsUrl);
      formData.append("installGuideUrl", installGuideUrl);
      formData.append("has360View", has360View ? "true" : "false");
      formData.append("view360", JSON.stringify(view360));
      
      // Layout Cabin fields
      formData.append("availableColors", JSON.stringify(availableColors));
      formData.append("availableFinishes", JSON.stringify(availableFinishes));
      formData.append("defaultColor", defaultColor);
      formData.append("defaultFinish", defaultFinish);
      formData.append("customizationVariants", JSON.stringify(customizationVariants));
      formData.append("view360Variants", JSON.stringify(view360Variants));
    }

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

  return (
    <div className="flex flex-col gap-8 font-sans text-slate-800">
      
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-sans tracking-tight">Products Management CMS</h1>
          <p className="text-slate-500 text-sm mt-1">
            Organize Shivshakti manufactured components, dealer catalogs, and elevator kits.
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            variant="primary"
            icon={<Plus className="w-4 h-4 shrink-0" />}
          >
            Add New Product
          </Button>
        )}
      </div>

      {showForm ? (
        /* CONDITIONAL CMS FORM CARD */
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? `Edit Product: ${editingProduct.title}` : "Add New Product"}
              </h2>
            </div>
            
            {/* Live Preview Button */}
            {slug && productType !== "elevator-kit" && (
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

          {/* Step 1: Product Type selection (disabled if editing) */}
          <div className="mb-6 p-4.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div>
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Product Type Division</label>
              <p className="text-xs text-slate-500 mt-0.5">Categorization controls catalog layouts and CMS forms.</p>
            </div>
            <div className="flex gap-2">
              {[
                { id: "our-product", label: "Our Product (In-House)" },
                { id: "dealer-product", label: "Dealer Product" },
                { id: "elevator-kit", label: "Full Elevator Kit" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  disabled={!!editingProduct}
                  onClick={() => setProductType(t.id)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    productType === t.id
                      ? "bg-[#0a1128] text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                
                {/* LHS */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                      placeholder="e.g. Center Opening Door / Wittur Geared Lift Machine"
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

                  {/* Conditional inputs depending on Product Type */}
                  {productType === "our-product" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                        >
                          <option value="door">Doors</option>
                          <option value="cabin">Cabins</option>
                          <option value="frame">Frames</option>
                          <option value="layout-cabin">Layout Cabins</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Subcategory</label>
                        <select
                          value={subCategory}
                          onChange={(e) => setSubCategory(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                        >
                          {subCategoryOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {productType === "dealer-product" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Dealer Brand</label>
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          required
                          placeholder="e.g. Usha Martin / Wittur"
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                        >
                          <option value="Safety Components">Safety Components</option>
                          <option value="Controllers">Controllers</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {productType === "elevator-kit" && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <input
                        type="checkbox"
                        id="inquiryEnabled"
                        checked={inquiryEnabled}
                        onChange={(e) => setInquiryEnabled(e.target.checked)}
                        className="w-5 h-5 accent-brand-orange rounded cursor-pointer"
                      />
                      <label htmlFor="inquiryEnabled" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                        Inquiry Enabled CTA (Triggers global quote popup)
                      </label>
                    </div>
                  )}

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

                {/* RHS */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Short Description</label>
                    <textarea
                      rows="3"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      required
                      placeholder="1-2 sentences showing on lists."
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                    />
                  </div>

                  {productType !== "elevator-kit" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Key Highlights (One per line)</label>
                      <textarea
                        rows="3"
                        value={highlights}
                        onChange={(e) => setHighlights(e.target.value)}
                        placeholder="e.g. 304 Grade Stainless Steel&#10;Silent operations"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                      />
                    </div>
                  )}
                </div>

                {/* Full Description Editor */}
                {productType !== "elevator-kit" && (
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Specifications Description (HTML Supported)</label>
                    <textarea
                      rows="5"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      placeholder="Detailed rich text description of this component."
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition font-mono"
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Specifications List Map */}
            {activeTab === "specs" && (
              <div className="flex flex-col gap-4 max-w-2xl text-left">
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase">Technical Specifications Editor</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Define key-value technical parameters for data grids.</p>
                  </div>
                  
                  {Object.keys(specs).length === 0 ? (
                    <p className="text-slate-400 text-xs italic bg-white p-4 rounded-xl border border-slate-100">No specifications added.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-100 font-sans">
                      {Object.entries(specs).map(([k, v]) => (
                        <div key={k} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium pl-3 pr-2 py-2 rounded-lg flex justify-between items-center shadow-sm">
                          <div>
                            <span className="text-slate-400 mr-1 capitalize">{k}:</span>
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
                      placeholder="e.g. Tensile Strength"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 1770 N/mm²"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl text-left">
                {productType !== "elevator-kit" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-500 uppercase">Primary Featured Image URL</label>
                        <label className="text-xs font-bold text-[#F97316] hover:text-[#EA580C] uppercase tracking-wider cursor-pointer flex items-center gap-1 select-none">
                          <Upload className="w-3.5 h-3.5" />
                          {uploadingFeatured ? "Uploading..." : "Upload"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadFeaturedImage}
                            disabled={uploadingFeatured}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={featuredImage}
                        onChange={(e) => setFeaturedImage(e.target.value)}
                        placeholder="/images/products/example.png"
                        required
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none"
                      />
                    </div>
                    {featuredImage && (
                      <div className="border border-slate-100 rounded-xl p-3 bg-slate-50 flex items-center justify-center h-48 overflow-hidden relative group">
                        <img src={featuredImage} alt="Featured Preview" className="h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setFeaturedImage("")}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        {productType === "elevator-kit" ? "Gallery Images (Masonry Slideshow)" : "Gallery Images (Comma-separated)"}
                      </label>
                      <label className="text-xs font-bold text-[#F97316] hover:text-[#EA580C] uppercase tracking-wider cursor-pointer flex items-center gap-1 select-none">
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingGallery ? "Uploading..." : "Upload Files"}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleUploadGalleryImages}
                          disabled={uploadingGallery}
                        />
                      </label>
                    </div>
                    <textarea
                      rows="3"
                      value={images}
                      onChange={(e) => setImages(e.target.value)}
                      placeholder="/images/product-1.png, /images/product-2.png"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm outline-none font-mono"
                    />
                  </div>
                  {images && (
                    <div className="grid grid-cols-3 gap-2">
                      {images.split(",").map((i, idx) => {
                        const trimmed = i.trim();
                        if (!trimmed) return null;
                        return (
                          <div key={idx} className="border border-slate-100 rounded-lg p-1 bg-slate-50 flex items-center justify-center aspect-square overflow-hidden relative group">
                            <img src={trimmed} alt="Thumb Preview" className="h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const currentList = images
                                  .split(",")
                                  .map(item => item.trim())
                                  .filter(Boolean);
                                currentList.splice(idx, 1);
                                setImages(currentList.join(", "));
                              }}
                              className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "customization" && (
              <div className="flex flex-col gap-6 text-left">
                {/* 1. Color Variants Section */}
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase">1. Colors Configuration</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Toggle colors, define hex codes, or add custom colors.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {availableColors.map((color, index) => (
                      <div key={index} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full border border-slate-300 shadow-inner"
                            style={{ backgroundColor: color.code }}
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-700">{color.name}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">{color.code}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={color.enabled}
                            onChange={(e) => {
                              const updated = [...availableColors];
                              updated[index].enabled = e.target.checked;
                              setAvailableColors(updated);
                            }}
                            className="w-4 h-4 accent-brand-orange cursor-pointer"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setAvailableColors(availableColors.filter((_, idx) => idx !== index));
                            }}
                            className="text-slate-400 hover:text-red-500 font-bold text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Color */}
                  <div className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 items-end">
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Color Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Bronze"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Hex Code / Color Class</label>
                      <input
                        type="text"
                        placeholder="e.g. #CD7F32"
                        value={newColorCode}
                        onChange={(e) => setNewColorCode(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (newColorName.trim() && newColorCode.trim()) {
                          setAvailableColors([...availableColors, {
                            name: newColorName.trim(),
                            code: newColorCode.trim(),
                            enabled: true
                          }]);
                          setNewColorName("");
                          setNewColorCode("");
                        }
                      }}
                      className="bg-brand-blue text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand-blue-light cursor-pointer"
                    >
                      Add Color
                    </button>
                  </div>
                </div>

                {/* 2. Finishes Section */}
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase">2. Finishes Configuration</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Toggle finishes or add new options.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availableFinishes.map((finish, index) => (
                      <div key={index} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                        <div>
                          <span className="text-xs font-bold text-slate-700 capitalize">{finish.name} Finish</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={finish.enabled}
                            onChange={(e) => {
                              const updated = [...availableFinishes];
                              updated[index].enabled = e.target.checked;
                              setAvailableFinishes(updated);
                            }}
                            className="w-4 h-4 accent-brand-orange cursor-pointer"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setAvailableFinishes(availableFinishes.filter((_, idx) => idx !== index));
                            }}
                            className="text-slate-400 hover:text-red-500 font-bold text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Finish */}
                  <div className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 items-end">
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Finish Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Satin / Sandblasted"
                        value={newFinishName}
                        onChange={(e) => setNewFinishName(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (newFinishName.trim()) {
                          setAvailableFinishes([...availableFinishes, {
                            name: newFinishName.trim(),
                            code: newFinishName.trim().toLowerCase(),
                            enabled: true
                          }]);
                          setNewFinishName("");
                        }
                      }}
                      className="bg-brand-blue text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand-blue-light cursor-pointer"
                    >
                      Add Finish
                    </button>
                  </div>
                </div>

                {/* 3. Defaults Section */}
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase">3. Default Selections</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Define the initial preview state for users.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Default Color</label>
                      <select
                        value={defaultColor}
                        onChange={(e) => setDefaultColor(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none"
                      >
                        {availableColors.filter(c => c.enabled).map(c => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Default Finish</label>
                      <select
                        value={defaultFinish}
                        onChange={(e) => setDefaultFinish(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none"
                      >
                        {availableFinishes.filter(f => f.enabled).map(f => (
                          <option key={f.name} value={f.name}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Variant Image Mapping */}
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase">4. Combination Images & Assets</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Upload specific images for each active color + finish combination.</p>
                  </div>

                  <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-200">
                    {availableColors.filter(c => c.enabled).map(color => {
                      return availableFinishes.filter(f => f.enabled).map(finish => {
                        const variantKey = `${color.name}-${finish.name}`;
                        const match = customizationVariants.find(v => v.color === color.name && v.finish === finish.name);
                        const imgUrl = match ? match.image : "";
                        const isEnabled = match ? match.enabled !== false : true;

                        return (
                          <div key={variantKey} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 last:border-none pb-4 last:pb-0">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-5 h-5 rounded-full border border-slate-200"
                                style={{ backgroundColor: color.code }}
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-700">{color.name}</span>
                                <span className="text-[10px] text-slate-400 font-medium block capitalize">{finish.name} Finish</span>
                              </div>
                            </div>

                            <div className="flex-1 flex gap-3 items-center">
                              <input
                                type="text"
                                placeholder="Image URL (e.g. /images/variants/...) or upload"
                                value={imgUrl}
                                onChange={(e) => {
                                  const url = e.target.value;
                                  setCustomizationVariants(prev => {
                                    const exists = prev.some(v => v.color === color.name && v.finish === finish.name);
                                    if (exists) {
                                      return prev.map(v => v.color === color.name && v.finish === finish.name ? { ...v, image: url } : v);
                                    } else {
                                      return [...prev, { color: color.name, finish: finish.name, image: url, enabled: true }];
                                    }
                                  });
                                }}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:bg-white"
                              />

                              <label className="text-xs font-bold text-[#F97316] hover:text-[#EA580C] uppercase tracking-wider cursor-pointer flex items-center gap-1 select-none whitespace-nowrap bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg">
                                <Upload className="w-3.5 h-3.5 mr-1 inline" />
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleUploadVariantImage(color.name, finish.name, e)}
                                />
                              </label>

                              {/* Toggle for combination */}
                              <div className="flex items-center gap-1.5 ml-2">
                                <input
                                  type="checkbox"
                                  id={`toggle-${variantKey}`}
                                  checked={isEnabled}
                                  onChange={(e) => {
                                    const val = e.target.checked;
                                    setCustomizationVariants(prev => {
                                      const exists = prev.some(v => v.color === color.name && v.finish === finish.name);
                                      if (exists) {
                                        return prev.map(v => v.color === color.name && v.finish === finish.name ? { ...v, enabled: val } : v);
                                      } else {
                                        return [...prev, { color: color.name, finish: finish.name, image: "", enabled: val }];
                                      }
                                    });
                                  }}
                                  className="w-4 h-4 accent-brand-orange cursor-pointer"
                                />
                                <label htmlFor={`toggle-${variantKey}`} className="text-[10px] text-slate-500 font-bold select-none cursor-pointer">
                                  Enabled
                                </label>
                              </div>
                            </div>

                            {/* Preview thumbnail */}
                            {imgUrl && (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                                <img src={imgUrl} alt="Variant thumbnail" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        );
                      });
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: 360° Interior View */}
            {productType === "our-product" && activeTab === "360" && (
              <View360Uploader
                has360View={has360View}
                setHas360View={setHas360View}
                view360={view360}
                setView360={setView360}
                view360Errors={view360Errors}
                setView360Errors={setView360Errors}
                productName={title}
                isLayoutCabin={category === "layout-cabin"}
                availableColors={availableColors}
                availableFinishes={availableFinishes}
                view360Variants={view360Variants}
                setView360Variants={setView360Variants}
              />
            )}

            {/* TAB 4: Search Engine Optimization */}
            {productType !== "elevator-kit" && activeTab === "seo" && (
              <div className="flex flex-col gap-4 max-w-2xl text-left">
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase">SEO Custom Metatags</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Optimize search layout for Google, Facebook, Twitter.</p>
                  </div>
                  
                  <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-100">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500">Custom Title Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. Premium SS Automatic Doors | Shivshakti Elevator"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500">Custom Meta Description</label>
                      <textarea
                        rows="3"
                        placeholder="Search result page summary snippet."
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PDF Product Downloads */}
            {productType === "our-product" && activeTab === "downloads" && (
              <div className="flex flex-col gap-4 max-w-2xl text-left">
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase">Product Downloads</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Provide PDF links for brochures, guides, and specifications.</p>
                  </div>

                  <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-100">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Brochure PDF URL</label>
                      <input
                        type="text"
                        placeholder="e.g. /docs/brochures/ss-cabin.pdf"
                        value={brochureUrl}
                        onChange={(e) => setBrochureUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Technical Specs PDF URL</label>
                      <input
                        type="text"
                        placeholder="e.g. /docs/specs/ss-cabin.pdf"
                        value={techSpecsUrl}
                        onChange={(e) => setTechSpecsUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Installation Guide PDF URL</label>
                      <input
                        type="text"
                        placeholder="e.g. /docs/guides/ss-cabin.pdf"
                        value={installGuideUrl}
                        onChange={(e) => setInstallGuideUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Publish Settings */}
            {activeTab === "publish" && (
              <div className="flex flex-col gap-5 max-w-xl text-left">
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 uppercase">Publishing Controls</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Control live indexing and priority lists.</p>
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

                    {productType === "our-product" && (
                      <div className="flex items-center gap-2.5 mt-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="w-5 h-5 accent-brand-orange rounded cursor-pointer"
                        />
                        <label htmlFor="featured" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                          Feature on Homepage (Top 3 priority list)
                        </label>
                      </div>
                    )}

                    {productType !== "elevator-kit" && (
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
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions footer */}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
              >
                {editingProduct ? "Update Product" : "Publish Product"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* STRUCTURED CMS DASHBOARD LIST */
        <div className="flex flex-col gap-6">
          
          {/* Top-Level Divisions Selector */}
          <div className="flex border-b border-slate-200 gap-4 overflow-x-auto">
            {[
              { id: "our-product", label: "Manufactured (Our Products)" },
              { id: "dealer-product", label: "Authorized Dealer Products" },
              { id: "elevator-kit", label: "Full Elevator Kits" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setListMainTab(tab.id);
                  setOurProductsSubTab("all");
                  setDealerBrandFilter("all");
                }}
                className={`px-4.5 py-3.5 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  listMainTab === tab.id
                    ? "border-brand-orange text-brand-orange"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sub-Filters / Summaries Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4.5 bg-slate-50 border border-slate-200/60 rounded-2xl text-left">
            
            {/* LHS Filters */}
            <div className="flex items-center gap-3">
              {listMainTab === "our-product" && (
                <div className="flex gap-1.5">
                  {[
                    { id: "all", label: "All Items" },
                    { id: "door", label: "Doors" },
                    { id: "cabin", label: "Cabins" },
                    { id: "frame", label: "Frames" },
                    { id: "layout-cabin", label: "Layout Cabins" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setOurProductsSubTab(sub.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                        ourProductsSubTab === sub.id
                          ? "bg-brand-blue text-white shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {listMainTab === "dealer-product" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Filter by Brand:</span>
                  <select
                    value={dealerBrandFilter}
                    onChange={(e) => setDealerBrandFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="all">All Brands</option>
                    {dealerBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {listMainTab === "elevator-kit" && (
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Complete Engineering Packages ({displayedProducts.length})
                </span>
              )}
            </div>

            {/* RHS Details */}
            <span className="text-xs font-bold text-slate-400 uppercase">
              Showing {displayedProducts.length} Products
            </span>
          </div>

          {/* PRODUCTS LIST TABLE */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[0.72rem] uppercase font-bold tracking-wider border-b border-slate-100">
                    <th className="py-4.5 px-6">Image</th>
                    <th className="py-4.5 px-6">Product Details</th>
                    {listMainTab === "our-product" && <th className="py-4.5 px-6">Category / Sub</th>}
                    {listMainTab === "dealer-product" && <th className="py-4.5 px-6">Brand / Category</th>}
                    {listMainTab !== "elevator-kit" && <th className="py-4.5 px-6">Badge</th>}
                    {listMainTab === "elevator-kit" && <th className="py-4.5 px-6">Inquiry Enabled</th>}
                    <th className="py-4.5 px-6">Status</th>
                    <th className="py-4.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-slate-400 text-center italic">
                        No products found. Add new items to list them.
                      </td>
                    </tr>
                  ) : (
                    displayedProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/40 transition duration-150 text-slate-800">
                        <td className="py-4 px-6 shrink-0">
                          <img
                            src={p.featuredImage}
                            alt={p.title}
                            className="w-14 h-14 object-cover rounded-xl border border-slate-100 shadow-sm"
                          />
                        </td>
                        <td className="py-4 px-6 min-w-[200px] text-left">
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
                        
                        {/* Conditional Columns depending on Tab */}
                        {listMainTab === "our-product" && (
                          <td className="py-4 px-6 text-left">
                            <span className="text-[0.78rem] font-semibold text-brand-blue uppercase tracking-wider block">
                              {p.category}
                            </span>
                            <span className="text-[0.68rem] font-medium text-slate-400 block mt-0.5">
                              {p.subCategory}
                            </span>
                          </td>
                        )}

                        {listMainTab === "dealer-product" && (
                          <td className="py-4 px-6 text-left">
                            <span className="text-[0.78rem] font-bold text-[#0a1128] uppercase tracking-wider block">
                              {p.brand}
                            </span>
                            <span className="text-[0.68rem] font-medium text-slate-400 block mt-0.5">
                              {p.category}
                            </span>
                          </td>
                        )}

                        {listMainTab !== "elevator-kit" && (
                          <td className="py-4 px-6 text-left">
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
                        )}

                        {listMainTab === "elevator-kit" && (
                          <td className="py-4 px-6 text-left">
                            <span className={`text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              p.inquiryEnabled !== false
                                ? "bg-green-50 text-green-700 border border-green-200" 
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                              {p.inquiryEnabled !== false ? "Enabled" : "Disabled"}
                            </span>
                          </td>
                        )}

                        <td className="py-4 px-6 text-left">
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
                            {p.slug && p.productType !== "elevator-kit" && (
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
        </div>
      )}
    </div>
  );
}
