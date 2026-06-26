"use client";

import { useState } from "react";
import {
  createBlogAction,
  editBlogAction,
  deleteBlogAction,
} from "@/features/blog/services/actions";
import { Plus, AlertTriangle, Calendar, Tag, Edit, Trash2, BookOpen, User } from "lucide-react";

export default function BlogsClient({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [category, setCategory] = useState("General");
  const [author, setAuthor] = useState("Shivshakti Team");
  const [publishedAt, setPublishedAt] = useState("");

  // Editor states
  const [editorTab, setEditorTab] = useState("write"); // 'write' or 'preview'

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setFeaturedImage("");
    setShortDescription("");
    setContent("");
    setMetaTitle("");
    setMetaDescription("");
    setTags("");
    setStatus("draft");
    setCategory("General");
    setAuthor("Shivshakti Team");
    setPublishedAt("");
    setEditingItem(null);
    setEditorTab("write");
    setError("");
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!editingItem) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setFeaturedImage(item.featuredImage);
    setShortDescription(item.shortDescription);
    setContent(item.content);
    setMetaTitle(item.metaTitle || "");
    setMetaDescription(item.metaDescription || "");
    setTags(item.tags ? item.tags.join(", ") : "");
    setStatus(item.status || "draft");
    setCategory(item.category || "General");
    setAuthor(item.author || "Shivshakti Team");
    setPublishedAt(item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 16) : "");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("featuredImage", featuredImage);
    formData.append("shortDescription", shortDescription);
    formData.append("content", content);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("tags", tags);
    formData.append("status", status);
    formData.append("category", category);
    formData.append("author", author);
    formData.append("publishedAt", publishedAt);

    let res;
    if (editingItem) {
      res = await editBlogAction(editingItem._id, formData);
    } else {
      res = await createBlogAction(formData);
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
    if (confirm("Are you sure you want to delete this blog post?")) {
      const res = await deleteBlogAction(id);
      if (res.success) {
        setItems(items.filter((i) => i._id !== id));
      } else {
        alert("Failed to delete blog post.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Blog Management</h1>
          <p className="text-slate-500 text-sm mt-1">Publish news articles, press updates, and industry resources.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-brand-orange text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-orange-light shadow-sm transition cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 shrink-0" /> Create Blog Post
        </button>
      </div>

      {showForm ? (
        /* Form View */
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            {editingItem ? `Edit Post: ${editingItem.title}` : "Write Blog Post"}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Form */}
              <div className="flex flex-col gap-4.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Article Title</label>
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
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                    >
                      <option value="General">General</option>
                      <option value="Product Updates">Product Updates</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Company News">Company News</option>
                      <option value="Guides">Guides & Manuals</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Author Name</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      required
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="elevators, safety, manufacturing"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                    />
                  </div>
                </div>

                {status === "published" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Publish Scheduling (Optional Date/Time)</label>
                    <input
                      type="datetime-local"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                    />
                    <p className="text-[0.68rem] text-slate-400">Leave blank to publish immediately. Set a future date to schedule public release.</p>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Featured Image URL</label>
                  <input
                    type="text"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="Copy from Media Library"
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">SEO Meta Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">SEO Meta Description</label>
                  <input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Right Form (Textarea Content & Formatting Preview) */}
              <div className="flex flex-col gap-4.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Short Description (Excerpt)</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase">Article Body Content (Markdown/HTML)</label>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setEditorTab("write")}
                        className={`px-3 py-1 rounded-md font-bold uppercase tracking-wider cursor-pointer ${editorTab === "write" ? "bg-white text-brand-orange shadow-sm border border-slate-100" : "text-slate-500"}`}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorTab("preview")}
                        className={`px-3 py-1 rounded-md font-bold uppercase tracking-wider cursor-pointer ${editorTab === "preview" ? "bg-white text-brand-orange shadow-sm border border-slate-100" : "text-slate-500"}`}
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  {editorTab === "write" ? (
                    <div className="flex flex-col gap-2 flex-1">
                      {/* Formatting Helper Buttons */}
                      <div className="flex gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 flex-wrap text-xs select-none">
                        <button
                          type="button"
                          onClick={() => setContent(prev => prev + " **Bold Text**")}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold hover:bg-slate-50 text-slate-700 cursor-pointer"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => setContent(prev => prev + " *Italic Text*")}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg italic hover:bg-slate-50 text-slate-700 cursor-pointer"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => setContent(prev => prev + "\n## Heading 2\n")}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold hover:bg-slate-50 text-slate-700 cursor-pointer"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => setContent(prev => prev + "\n### Heading 3\n")}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold hover:bg-slate-50 text-slate-700 cursor-pointer"
                        >
                          H3
                        </button>
                        <button
                          type="button"
                          onClick={() => setContent(prev => prev + " [Link Text](https://example.com)")}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 cursor-pointer"
                        >
                          Link
                        </button>
                        <button
                          type="button"
                          onClick={() => setContent(prev => prev + "\n- List Item\n")}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 cursor-pointer"
                        >
                          List
                        </button>
                      </div>
                      <textarea
                        rows="14"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="Write article details here in Markdown or HTML..."
                        className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition font-mono"
                      />
                    </div>
                  ) : (
                    <div className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 text-sm min-h-[300px] overflow-y-auto max-h-[450px]">
                      {content.trim() ? (
                        <div className="prose prose-slate max-w-none">
                          {content.split("\n").map((line, i) => {
                            if (!line.trim()) return <br key={i} />;
                            let text = line.trim();
                            if (text.startsWith("### ")) return <h4 key={i} className="text-sm font-bold uppercase tracking-wider text-slate-900 mt-4 mb-2">{text.replace("### ", "")}</h4>;
                            if (text.startsWith("## ")) return <h3 key={i} className="text-base font-bold text-slate-900 mt-5 mb-2">{text.replace("## ", "")}</h3>;
                            if (text.startsWith("# ")) return <h2 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-3">{text.replace("# ", "")}</h2>;
                            
                            let html = line;
                            const boldReg = /\*\*(.*?)\*\*/g;
                            html = html.replace(boldReg, "<strong>$1</strong>");
                            return <p key={i} className="mb-2 leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: html }} />;
                          })}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic text-center py-20">Nothing to preview yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

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
                {loading ? "Saving..." : editingItem ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Blog posts table list */
        <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-lg">Published Articles</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="py-12 text-slate-400 text-center italic">
                No blog posts recorded. Click "Create Blog Post" to add new articles.
              </div>
            ) : (
              items.map((blog) => (
                <div key={blog._id} className="p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center hover:bg-slate-50/20 transition">
                  <div className="flex items-start gap-4">
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-100"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800 text-[1.05rem] leading-snug">{blog.title}</h4>
                      <p className="text-slate-400 text-xs mt-1 max-w-[480px] truncate">{blog.shortDescription}</p>
                      
                      {/* Meta Tags Row */}
                      <div className="flex flex-wrap items-center gap-3.5 mt-2.5 text-[0.7rem] text-slate-400 font-bold uppercase tracking-wide">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "Draft"}
                        </span>
                        <span className="flex items-center gap-1 text-brand-blue">
                          <BookOpen className="w-3.5 h-3.5 shrink-0" />
                          {blog.category || "General"}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {blog.author || "Shivshakti Team"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {blog.tags ? blog.tags.join(", ") : "None"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs shrink-0 self-end sm:self-center mt-3 sm:mt-0">
                    <span className={`text-[0.68rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      blog.status === "published" ? "bg-green-50 text-green-700 border border-green-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>
                      {blog.status}
                    </span>
                    <button
                      onClick={() => handleOpenEdit(blog)}
                      className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 px-3.5 py-1.5 rounded-lg font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5 shrink-0" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-3.5 py-1.5 rounded-lg font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" /> Delete
                    </button>
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
