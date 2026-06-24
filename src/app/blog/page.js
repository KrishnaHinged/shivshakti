import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Setting from "@/models/Setting";
import Link from "next/link";
import { Calendar, User, Tag, ArrowRight, Search } from "lucide-react";
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

  // Fetch unique categories
  const allPublished = await Blog.find({ status: "published", publishedAt: { $lte: new Date() } });
  const categories = Array.from(new Set(allPublished.map((p) => p.category || "General").filter(Boolean)));

  return (
    <div className="bg-white text-black min-h-screen flex flex-col font-sans select-none overflow-x-hidden">
      {/* Navbar wrapper */}
      <Header logoUrl={settings.logoUrl} />

      <main className="flex-grow">
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
                <p className="text-[1rem] lg:text-[1.1rem] text-text-secondary leading-[1.6] mt-1 opacity-90 max-w-2xl">
                  Stay up to date with industrial elevator cabin designs, door system advancements, and manufacturing standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Layout Grid Wrapper */}
        <div className="max-w-[1300px] mx-auto px-6 lg:px-12 py-12">
          {/* Core Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">

            {/* Left: Blog Grid */}
            <div className="flex flex-col gap-8">
              {posts.length === 0 ? (
                <div className="bg-white/[0.02] border border-white/5 p-16 rounded-[2rem] text-center">
                  <p className="text-text-secondary text-base italic">
                    No articles matched your search filters. Try clearing your filters or changing your query.
                  </p>
                  <Link
                    href="/blog"
                    className="bg-brand-orange text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-brand-orange-light inline-block mt-6"
                  >
                    Reset All Filters
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {posts.map((post) => (
                    <article
                      key={post._id}
                      className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-1 transition-all duration-300 flex flex-col group shadow-lg"
                    >
                      <Link href={`/blog/${post.slug}`} className="relative block aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage || "/images/placeholder.jpg"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      <div className="p-6 flex flex-col flex-1 gap-4">
                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-text-secondary font-bold uppercase tracking-wider">
                          <span className="text-brand-orange">{post.category || "General"}</span>
                          <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>

                        {/* Content details */}
                        <div className="flex flex-col gap-2 flex-1">
                          <h2 className="text-xl font-extrabold text-white group-hover:text-brand-orange transition duration-200">
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h2>
                          <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">
                            {post.shortDescription}
                          </p>
                        </div>

                        {/* Action */}
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-brand-orange font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:text-brand-orange-light mt-2"
                        >
                          Read Article <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Sidebar filters */}
            <aside className="flex flex-col gap-8 lg:sticky lg:top-36">

              {/* Search Box */}
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] shadow-sm">
                <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Search Articles</h3>
                <form action="/blog" method="GET" className="relative flex">
                  <input
                    type="text"
                    name="query"
                    defaultValue={query}
                    placeholder="Fuzzy search..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-full px-5 py-3 text-white text-xs outline-none focus:border-brand-orange focus:bg-white/[0.06] transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Categories filter */}
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] shadow-sm">
                <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Categories</h3>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/blog"
                    className={`px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider transition ${!activeCategory ? "bg-brand-orange text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/blog?category=${encodeURIComponent(cat)}`}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider transition ${activeCategory === cat ? "bg-brand-orange text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}
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
