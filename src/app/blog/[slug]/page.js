import dbConnect from "@/shared/lib/mongodb";
import { Blog, Setting, Product } from "@/shared/models";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, Tag, ArrowLeft, Clock } from "lucide-react";
import Header from "@/shared/layouts/Header/Header";
import Footer from "@/shared/layouts/Footer/Footer";

export const revalidate = 300; // Cache on edge CDN for 5 minutes, ensuring instant page switches and reducing db queries

// Generate dynamic SEO metadata
export async function generateMetadata({ params }) {
  await dbConnect();
  const awaitedParams = await params;
  const post = await Blog.findOne({
    slug: awaitedParams.slug,
    status: "published",
    publishedAt: { $lte: new Date() }
  });

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${post.metaTitle || post.title} | Shivshakti Blog`,
    description: post.metaDescription || post.shortDescription,
    alternates: {
      canonical: `https://www.shivshaktielevatorcomponents.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.shortDescription,
      url: `https://www.shivshaktielevatorcomponents.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      images: [
        {
          url: post.featuredImage,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.shortDescription,
      images: [post.featuredImage],
    }
  };
}

// Simple Markdown/Plaintext formatter helper (Tailored for B2B Reading Comfort)
function renderContent(text) {
  if (!text) return "";
  // If text already looks like HTML, render it directly
  if (text.includes("<p>") || text.includes("</div>") || text.includes("<br")) {
    return <div dangerouslySetInnerHTML={{ __html: text }} className="prose-container text-slate-600 leading-[1.7] text-[1.02rem]" />;
  }

  // Basic Markdown inline parser for display fallback
  const lines = text.split("\n").map((line, idx) => {
    let cleanLine = line.trim();
    if (!cleanLine) return <br key={idx} />;

    // Headers
    if (cleanLine.startsWith("### ")) {
      return <h3 key={idx} className="text-lg font-bold text-slate-900 mt-6 mb-3 tracking-tight">{cleanLine.replace("### ", "")}</h3>;
    }
    if (cleanLine.startsWith("## ")) {
      return <h2 key={idx} className="text-xl font-bold text-slate-900 mt-8 mb-4 tracking-tight">{cleanLine.replace("## ", "")}</h2>;
    }
    if (cleanLine.startsWith("# ")) {
      return <h1 key={idx} className="text-2xl font-extrabold text-slate-900 mt-10 mb-5 tracking-tight">{cleanLine.replace("# ", "")}</h1>;
    }

    // Bold text parsing (**text**)
    let htmlContent = line;
    const boldRegex = /\*\*(.*?)\*\*/g;
    htmlContent = htmlContent.replace(boldRegex, "<strong>$1</strong>");

    return (
      <p
        key={idx}
        className="text-slate-600 text-[1rem] md:text-[1.05rem] leading-[1.7] mb-5"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  });

  return <div className="prose-content flex flex-col">{lines}</div>;
}

export default async function BlogDetailPage({ params }) {
  await dbConnect();
  const awaitedParams = await params;
  
  const [post, settingsDoc, featuredProducts] = await Promise.all([
    Blog.findOne({
      slug: awaitedParams.slug,
      status: "published",
      publishedAt: { $lte: new Date() }
    }),
    Setting.findOne(),
    Product.find({ featured: true }).limit(6)
  ]);

  const settings = JSON.parse(JSON.stringify(settingsDoc || {}));

  if (!post) {
    notFound();
  }

  // Fetch 3 related posts (excluding current post)
  const relatedPosts = await Blog.find({
    slug: { $ne: post.slug },
    status: "published",
    category: post.category,
    publishedAt: { $lte: new Date() }
  }).sort({ publishedAt: -1 }).limit(3);

  // Fallback related posts if not enough in same category
  if (relatedPosts.length < 3) {
    const extra = await Blog.find({
      slug: { $ne: post.slug },
      status: "published",
      publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 }).limit(3 - relatedPosts.length);
    relatedPosts.push(...extra);
  }

  // Calculate read time
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 225));

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.shortDescription,
    "image": post.featuredImage,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "author": {
      "@type": "Organization",
      "name": post.author || "Shivshakti Team",
      "url": "https://www.shivshaktielevatorcomponents.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Shivshakti Elevator Components Pvt. Ltd.",
      "logo": {
        "@type": "ImageObject",
        "url": settings.logoUrl || "https://www.shivshaktielevatorcomponents.com/images/logo.png"
      }
    }
  };

  return (
    <div className="bg-[#F9F9FB] text-slate-800 min-h-screen flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navbar wrapper */}
      <Header logoUrl={settings.logoUrl} />

      {/* Main Container - Optimized max-width for reading text (B2B standard) */}
      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 md:px-6 py-12 pt-36 pb-24">
        
        {/* Back button */}
        <Link
          href="/blog"
          className="text-slate-500 hover:text-brand-orange text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-8 transition-colors duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" /> Back to Blog Listing
        </Link>

        {/* Article Details */}
        <article className="flex flex-col gap-6">
          
          {/* Header Metadata */}
          <div className="flex flex-col gap-3">
            <span className="text-brand-orange text-xs font-extrabold uppercase tracking-[0.2em] bg-brand-orange-pale px-3 py-1 rounded border border-brand-orange/10 w-fit">
              {post.category || "General"}
            </span>
            
            <h1 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-slate-900 leading-[1.1] tracking-tight mt-1">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-[10px] md:text-[11px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 pb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                By {post.author || "Shivshakti Team"}
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {readTime} Min Read
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
            <img
              src={post.featuredImage || "/images/placeholder.jpg"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Short Excerpt */}
          <div className="border-l-4 border-brand-orange bg-slate-50 pl-5 py-4 my-4 italic text-sm md:text-base text-slate-600 rounded-r-xl leading-relaxed">
            &ldquo;{post.shortDescription}&rdquo;
          </div>

          {/* Main Content Body */}
          <div className="text-slate-700 prose max-w-none mb-10">
            {renderContent(post.content)}
          </div>

          {/* Article tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center border-t border-b border-slate-100 py-4 mb-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" /> Tags:
              </span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?query=${encodeURIComponent(tag)}`}
                  className="bg-slate-50 border border-slate-200 hover:border-brand-orange/40 hover:bg-slate-100/50 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded transition-colors duration-150 cursor-pointer"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* B2B Author Box (Editorial Profile Box) */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 flex items-start gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] mb-10">
            <div className="w-10 h-10 rounded-full bg-brand-blue-pale text-brand-blue flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Written By</span>
              <h4 className="text-sm font-bold text-slate-900">{post.author || "Shivshakti Team"}</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Technical and design division of Shivshakti Elevator Components Pvt. Ltd. We manufacture heavy-duty elevator cabins, doors, car frames, and safety configurations certified to comply with standard load rules across India.
              </p>
            </div>
          </div>

        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 border-t border-slate-100 pt-12">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.01)] transition-colors duration-150 flex flex-col group"
                >
                  <Link href={`/blog/${item.slug}`} className="relative block aspect-video overflow-hidden">
                    <img
                      src={item.featuredImage || "/images/placeholder.jpg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                    />
                  </Link>
                  <div className="p-4 flex flex-col gap-2.5 flex-1 justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="text-brand-orange font-bold text-[10px] uppercase tracking-wider">{item.category || "General"}</span>
                      <h4 className="font-bold text-xs md:text-sm text-slate-900 group-hover:text-brand-orange transition-colors duration-150 line-clamp-2 leading-snug">
                        <Link href={`/blog/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h4>
                    </div>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="text-brand-orange text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mt-1 transition-colors duration-150 cursor-pointer"
                    >
                      Read Now <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer products={JSON.parse(JSON.stringify(featuredProducts))} settings={settings} />
    </div>
  );
}
