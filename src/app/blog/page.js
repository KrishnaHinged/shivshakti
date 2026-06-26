import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Setting from "@/models/Setting";
import Link from "next/link";
import { ArrowRight, Search, Clock, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Product from "@/models/Product"; // For footer products

export const revalidate = 0; // Dynamic server rendering

export async function generateMetadata() {
  await dbConnect();
  const settings = await Setting.findOne() || {};
  return {
    title: `Elevator Industry Blog & Engineering News | ${settings.companyName || "Shivshakti"}`,
    description: "Explore industry trends, tech insights, maintenance guides, and product announcements from the leading elevator components manufacturer.",
    alternates: {
      canonical: "https://www.shivshaktielevatorcomponents.com/blog",
    },
    openGraph: {
      title: "Elevator Industry Blog & Engineering News | Shivshakti",
      description: "Explore industry trends, tech insights, maintenance guides, and product announcements from the leading elevator components manufacturer.",
      url: "https://www.shivshaktielevatorcomponents.com/blog",
      siteName: settings.companyName || "Shivshakti Elevator Components",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Elevator Industry Blog & Engineering News | Shivshakti",
      description: "Explore industry trends, tech insights, maintenance guides, and product announcements from the leading elevator components manufacturer.",
    }
  };
}

export default async function BlogListingPage({ searchParams }) {
  await dbConnect();

  // Await search params in Next.js 15+
  const params = await searchParams;
  const activeCategory = params.category || "";
  const query = params.query || "";

  const [settingsDoc, featuredProducts] = await Promise.all([
    Setting.findOne(),
    Product.find({ featured: true }).limit(6)
  ]);

  const settings = JSON.parse(JSON.stringify(settingsDoc || {}));

  // Query to filter out drafts and scheduled posts
  const dbQuery = {
    status: "published",
    publishedAt: { $lte: new Date() },
  };

  if (activeCategory) {
    dbQuery.category = activeCategory;
  }

  if (query) {
    dbQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { shortDescription: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
      { tags: { $in: [new RegExp(query, "i")] } }
    ];
  }

  const posts = await Blog.find(dbQuery).sort({ publishedAt: -1 });

  // Separate featured post (first post) from remaining posts for asymmetric B2B layout
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  // Fetch unique categories
  const allPublished = await Blog.find({ status: "published", publishedAt: { $lte: new Date() } });
  const categories = Array.from(new Set(allPublished.map((p) => p.category || "General").filter(Boolean)));

  // Read time helper function
  const getReadTime = (contentText) => {
    const wordCount = contentText ? contentText.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(wordCount / 225));
  };

  return (
    <div className="bg-[#F9F9FB] text-slate-800 min-h-screen flex flex-col font-sans select-none overflow-x-hidden">
      {/* Navbar wrapper */}
      <Header logoUrl={settings.logoUrl} />

      <main className="flex-grow">
        {/* Premium Hero Header Section (Kept exactly as is) */}
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
                <p className="text-[1rem] lg:text-[1.1rem] text-text-secondary leading-[1.6] mt-1 opacity-90 max-w-2xl">
                  Stay up to date with industrial elevator cabin designs, door system advancements, and manufacturing standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Layout Grid Wrapper with extra padding top for breathing room */}
        <div className="max-w-[1300px] mx-auto px-4 md:px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-16 items-start">

            {/* Left: Blog Grid */}
            <div className="flex flex-col gap-10">
              {posts.length === 0 ? (
                <div className="bg-white border border-slate-100 p-12 rounded-xl text-center shadow-[0_4px_12px_rgba(0,0,0,0.015)]">
                  <p className="text-slate-500 text-sm italic">
                    No articles matched your search filters. Try clearing your filters or changing your query.
                  </p>
                  <Link
                    href="/blog"
                    className="bg-brand-orange text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-brand-orange-light inline-block mt-6 transition-colors duration-150 cursor-pointer"
                  >
                    Reset All Filters
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-10">
                  
                  {/* FEATURED POST (Asymmetric top element) */}
                  {featuredPost && (
                    <article className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.015)] transition-colors duration-150 flex flex-col lg:flex-row group w-full">
                      <Link href={`/blog/${featuredPost.slug}`} className="relative block lg:w-[55%] aspect-video lg:aspect-auto min-h-[260px] overflow-hidden">
                        <img
                          src={featuredPost.featuredImage || "/images/placeholder.jpg"}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:opacity-95 transition-opacity duration-200"
                        />
                      </Link>

                      <div className="lg:w-[45%] p-6 md:p-8 flex flex-col justify-between gap-5">
                        <div className="flex flex-col gap-3">
                          {/* Category & Read Time Row */}
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                            <span className="text-brand-orange font-semibold">{featuredPost.category || "General"}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {getReadTime(featuredPost.content)} Min Read
                            </span>
                          </div>

                          <h2 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors duration-150 leading-snug">
                            <Link href={`/blog/${featuredPost.slug}`}>
                              {featuredPost.title}
                            </Link>
                          </h2>
                          
                          <p className="text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-4">
                            {featuredPost.shortDescription}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                            {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          
                          <Link
                            href={`/blog/${featuredPost.slug}`}
                            className="text-brand-orange font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:text-brand-orange-light transition-colors duration-150 cursor-pointer"
                          >
                            Read Article <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  )}

                  {/* REMAINING POSTS GRID */}
                  {remainingPosts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {remainingPosts.map((post) => (
                        <article
                          key={post._id}
                          className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.015)] transition-colors duration-150 flex flex-col group"
                        >
                          <Link href={`/blog/${post.slug}`} className="relative block aspect-video overflow-hidden">
                            <img
                              src={post.featuredImage || "/images/placeholder.jpg"}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                            />
                          </Link>

                          <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                            <div className="flex flex-col gap-2">
                              {/* Meta Info Row */}
                              <div className="flex items-center gap-3.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                <span className="text-brand-orange font-semibold">{post.category || "General"}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {getReadTime(post.content)} Min Read
                                </span>
                              </div>

                              <h2 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-brand-orange transition-colors duration-150 leading-snug">
                                <Link href={`/blog/${post.slug}`}>
                                  {post.title}
                                </Link>
                              </h2>
                              
                              <p className="text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-3">
                                {post.shortDescription}
                              </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-2">
                              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </span>

                              <Link
                                href={`/blog/${post.slug}`}
                                className="text-brand-orange font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:text-brand-orange-light transition-colors duration-150 cursor-pointer"
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

            {/* Right: Sidebar filters (Sticky) */}
            <aside className="flex flex-col gap-6 lg:sticky lg:top-36">

              {/* Search Box */}
              <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.015)]">
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-3.5">Search Articles</h3>
                <form action="/blog" method="GET" className="relative flex">
                  <input
                    type="text"
                    name="query"
                    defaultValue={query}
                    placeholder="Search articles..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 text-slate-800 text-xs outline-none focus:border-brand-orange focus:bg-white transition-all duration-150"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Categories filter with Left-Accent active borders */}
              <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.015)]">
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-3.5">Categories</h3>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/blog"
                    className={`px-4 py-2 rounded-r text-xs font-bold tracking-wider transition-colors duration-150 border-l-2 ${
                      !activeCategory
                        ? "bg-slate-950 text-white border-brand-orange"
                        : "bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/blog?category=${encodeURIComponent(cat)}`}
                      className={`px-4 py-2 rounded-r text-xs font-bold tracking-wider transition-colors duration-150 border-l-2 ${
                        activeCategory === cat
                          ? "bg-slate-950 text-white border-brand-orange"
                          : "bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

            </aside>

          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer products={JSON.parse(JSON.stringify(featuredProducts))} settings={settings} />
    </div>
  );
}
