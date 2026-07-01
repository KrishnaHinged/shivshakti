"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Search, Clock, Mail, BookOpen, Tag } from "lucide-react";

export default function BlogListingClient({ posts, categories, activeCategory, query }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const categoryTabRefs = useRef({});

  // Read time calculator
  const getReadTime = (contentText) => {
    const wordCount = contentText ? contentText.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(wordCount / 225));
  };

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  // Auto-scroll active categories tab into view
  useEffect(() => {
    const activeKey = activeCategory || "all";
    const activeEl = categoryTabRefs.current[activeKey];
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeCategory]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  // Mock popular articles using existing posts or placeholder data
  const popularPosts = posts.slice(0, 3);
  const tags = ["Elevator Design", "Traction Cabin", "Surat Factory", "Safety Standards", "B2B Showcase", "Steel Alignment"];

  return (
    <main className="flex-grow bg-[#FDFBF9]">
      {/* Premium Hero Header Section */}
      <section className="w-full px-4 lg:px-8 pt-24 lg:pt-28 pb-4 bg-transparent">
        <div className="relative w-full rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden bg-neutral-950 flex flex-col justify-center p-8 md:p-12 lg:p-16 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          {/* Background Image & Radial Glow Overlay */}
          <div className="absolute inset-0 bg-[url('/images/hero.jpeg')] bg-cover bg-center bg-no-repeat opacity-30 z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(10,17,40,0.4)_0%,rgba(10,17,40,0.92)_100%)] z-10" />

          {/* Content Details */}
          <div className="relative z-20 max-w-[1300px] flex flex-col gap-6">
            {/* Breadcrumb */}
            <nav className="text-xs lg:text-sm font-semibold tracking-wide text-slate-400 flex items-center gap-2">
              <Link href="/" className="hover:text-brand-orange transition duration-200">
                Home
              </Link>
              <span className="text-white/20 font-mono">/</span>
              <span className="text-brand-blue font-semibold">Blog</span>
            </nav>

            <div className="max-w-3xl flex flex-col gap-4">
              <span className="text-brand-orange text-[0.82rem] font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-4 py-1.5 rounded-full border border-brand-orange/20 select-none w-fit">
                Insights & Updates
              </span>
              <h1 className="text-4xl lg:text-[3.2rem] font-extrabold tracking-tight leading-[1.15] text-white font-sans mt-2">
                Shivshakti <span className="italic text-brand-blue font-medium font-serif">Technical</span> Blog
              </h1>
              <p className="text-[1rem] lg:text-[1.12rem] text-text-secondary leading-[1.6] mt-1 opacity-90 max-w-2xl">
                Stay up to date with industrial elevator cabin designs, door system advancements, and manufacturing standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar Section (Unified Magazines Bar) */}
      <section className="w-full max-w-[1300px] mx-auto px-4 md:px-8 lg:px-12 pt-6 pb-2">
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-between border-b border-slate-200/60 pb-6">
          {/* Scrollable Categories List */}
          <div className="relative bg-slate-100 p-1.5 rounded-full flex items-center gap-1 max-w-full overflow-x-auto scrollbar-none border border-slate-200/20 shadow-sm">
            <Link
              href="/blog"
              ref={(el) => (categoryTabRefs.current["all"] = el)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                !activeCategory ? "bg-[#0a1128] text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
              }`}
            >
              All Articles
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog?category=${encodeURIComponent(cat)}`}
                ref={(el) => (categoryTabRefs.current[cat] = el)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                  activeCategory === cat ? "bg-[#0a1128] text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Elegant Search Form */}
          <form action="/blog" method="GET" className="relative flex w-full sm:max-w-xs px-2 sm:px-0">
            <span className="absolute inset-y-0 left-2 sm:left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              name="query"
              defaultValue={query}
              placeholder="Search articles..."
              className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-slate-200/50 focus:border-brand-orange rounded-full py-2.5 pl-11 pr-4 text-xs font-medium text-slate-800 outline-none transition placeholder:text-slate-400 shadow-sm"
            />
          </form>
        </div>
      </section>

      {/* Core Layout Grid Wrapper */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 lg:px-12 py-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Blog Grid */}
          <div className="flex flex-col gap-10">
            {posts.length === 0 ? (
              /* Custom Premium Empty State */
              <div className="w-full flex flex-col items-center justify-center text-center py-20 px-6 bg-slate-50 rounded-[1.8rem] md:rounded-[2.2rem] border border-slate-200/50 shadow-sm gap-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 animate-pulse">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-slate-800">No Articles Found</h3>
                  <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                    We couldn't find any editorial insights matching your search query. Try typing something else or clear the filters.
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="bg-[#0a1128] hover:bg-brand-orange text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full shadow hover:scale-105 active:scale-100 transition-all"
                >
                  Clear Filters & Search
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                {/* FEATURED POST */}
                {featuredPost && (
                  <article className="bg-white border border-slate-200/60 rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col lg:flex-row group w-full shadow-sm">
                    <Link href={`/blog/${featuredPost.slug}`} className="relative block lg:w-[55%] aspect-[16/9] lg:aspect-auto min-h-[260px] overflow-hidden">
                      <img
                        src={featuredPost.featuredImage || "/images/placeholder.jpg"}
                        alt={featuredPost.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </Link>

                    <div className="lg:w-[45%] p-6 sm:p-8 flex flex-col justify-between gap-6 text-left">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                          <span className="text-brand-orange font-bold">{featuredPost.category || "General"}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {getReadTime(featuredPost.content)} Min Read
                          </span>
                        </div>

                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 group-hover:text-brand-orange transition-colors duration-200 leading-snug">
                          <Link href={`/blog/${featuredPost.slug}`}>
                            {featuredPost.title}
                          </Link>
                        </h2>
                        
                        <p className="text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-4">
                          {featuredPost.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        
                        <Link
                          href={`/blog/${featuredPost.slug}`}
                          className="text-brand-orange font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:text-brand-orange-light transition-colors duration-150 cursor-pointer"
                        >
                          Read Article <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )}

                {/* REMAINING POSTS GRID */}
                {remainingPosts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {remainingPosts.map((post) => (
                      <article
                        key={post._id}
                        className="bg-white border border-slate-200/60 rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group shadow-sm"
                      >
                        <div>
                          <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-slate-100 border-b border-slate-100">
                            <img
                              src={post.featuredImage || "/images/placeholder.jpg"}
                              alt={post.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          </Link>

                          <div className="p-6 text-left">
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-3">
                              <span className="text-brand-orange font-bold">{post.category || "General"}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {getReadTime(post.content)} Min Read
                              </span>
                            </div>

                            <h2 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-brand-orange transition-colors duration-200 leading-snug">
                              <Link href={`/blog/${post.slug}`}>
                                {post.title}
                              </Link>
                            </h2>
                            
                            <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-2 line-clamp-3">
                              {post.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="p-6 pt-0 text-left">
                          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>

                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-brand-orange font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:text-brand-orange-light transition-colors duration-150 cursor-pointer"
                            >
                              Read Article <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Sidebar (Sticky) */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-36">
            {/* Newsletter Subscription Box */}
            <div className="bg-[#0a1128] text-white border border-white/5 p-6 rounded-[1.8rem] md:rounded-[2.2rem] shadow-xl text-left flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-orange">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">Technical Newsletter</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Receive specialized engineering logs, layout configurator tips, and Surat factory design updates directly in your inbox.
                </p>
              </div>

              {subscribed ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-xs font-semibold text-center">
                  Successfully subscribed!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5 mt-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter business email"
                    className="w-full bg-white/10 hover:bg-white/15 focus:bg-white border border-white/15 focus:border-brand-orange rounded-full px-5 py-3 text-white focus:text-slate-800 text-xs outline-none transition placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="w-full bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-extrabold uppercase tracking-wider py-3 rounded-full shadow cursor-pointer transition select-none"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Popular Articles */}
            {popularPosts.length > 0 && (
              <div className="bg-white border border-slate-200/60 p-6 rounded-[1.8rem] md:rounded-[2.2rem] shadow-sm text-left">
                <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-brand-orange" />
                  <span>Popular Articles</span>
                </h3>
                <div className="flex flex-col gap-4">
                  {popularPosts.map((post) => (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug}`}
                      className="flex gap-3 items-center group pb-3 border-b border-slate-100 last:border-b-0 last:pb-0"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                        <img
                          src={post.featuredImage || "/images/placeholder.jpg"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-brand-orange leading-snug line-clamp-2 transition-colors duration-200">
                          {post.title}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tag Cloud */}
            <div className="bg-white border border-slate-200/60 p-6 rounded-[1.8rem] md:rounded-[2.2rem] shadow-sm text-left">
              <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-brand-orange" />
                <span>Trending Tags</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200/20 px-3 py-1.5 rounded-full select-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
