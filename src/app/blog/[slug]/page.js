import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Setting from "@/models/Setting";
import Product from "@/models/Product";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, Tag, ArrowLeft, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const revalidate = 0; // Dynamic server rendering

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

// Simple Markdown/Plaintext formatter helper to convert line breaks to HTML
function renderContent(text) {
  if (!text) return "";
  // If text already looks like HTML, render it directly
  if (text.includes("<p>") || text.includes("</div>") || text.includes("<br")) {
    return <div dangerouslySetInnerHTML={{ __html: text }} className="prose-container" />;
  }

  // Basic Markdown inline parser for display fallback
  const lines = text.split("\n").map((line, idx) => {
    let cleanLine = line.trim();
    if (!cleanLine) return <br key={idx} />;

    // Headers
    if (cleanLine.startsWith("### ")) {
      return <h3 key={idx} className="text-xl font-bold text-white mt-6 mb-3">{cleanLine.replace("### ", "")}</h3>;
    }
    if (cleanLine.startsWith("## ")) {
      return <h2 key={idx} className="text-2xl font-black text-white mt-8 mb-4">{cleanLine.replace("## ", "")}</h2>;
    }
    if (cleanLine.startsWith("# ")) {
      return <h1 key={idx} className="text-3xl font-black text-white mt-10 mb-5">{cleanLine.replace("# ", "")}</h1>;
    }

    // Bold text parsing (**text**)
    let htmlContent = line;
    const boldRegex = /\*\*(.*?)\*\*/g;
    htmlContent = htmlContent.replace(boldRegex, "<strong>$1</strong>");

    return (
      <p
        key={idx}
        className="text-text-secondary text-sm md:text-base leading-relaxed mb-4"
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
    <div className="bg-[#040814] text-white min-h-screen flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navbar wrapper */}
      <Header logoUrl={settings.logoUrl} />

      {/* Main Spacer */}
      <main className="flex-1 max-w-[950px] w-full mx-auto px-6 lg:px-12 pt-36 pb-24">
        
        {/* Breadcrumb / Back button */}
        <Link
          href="/blog"
          className="text-text-secondary hover:text-brand-orange text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-10 transition duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog Listing
        </Link>

        {/* Article Details */}
        <article className="flex flex-col gap-6">
          
          {/* Header Metadata */}
          <div className="flex flex-col gap-3">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-wider bg-brand-orange/10 border border-brand-orange/20 px-3.5 py-1 rounded-full w-fit">
              {post.category || "General"}
            </span>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 mt-3 text-xs text-text-secondary font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-orange" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-orange" />
                By {post.author || "Shivshakti Team"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-orange" />
                {readTime} Min Read
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] mt-4">
            <img
              src={post.featuredImage || "/images/placeholder.jpg"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Short Excerpt */}
          <div className="border-l-4 border-brand-orange pl-5 py-2 my-6 italic text-[1.05rem] text-text-secondary leading-relaxed bg-white/[0.01] rounded-r-xl">
            "{post.shortDescription}"
          </div>

          {/* Main Content Body */}
          <div className="text-slate-300 prose prose-invert max-w-none mb-16">
            {renderContent(post.content)}
          </div>

          {/* Article tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2.5 items-center border-t border-b border-white/5 py-6 mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-2">
                <Tag className="w-4 h-4 text-slate-500" /> Tags:
              </span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?query=${encodeURIComponent(tag)}`}
                  className="bg-white/[0.03] border border-white/10 hover:border-brand-orange/40 hover:bg-white/[0.06] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition duration-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-white/5 pt-16">
            <h3 className="text-2xl font-black text-white mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((item) => (
                <div
                  key={item._id}
                  className="bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.03] transition-all duration-300 flex flex-col group"
                >
                  <Link href={`/blog/${item.slug}`} className="relative block aspect-video overflow-hidden">
                    <img
                      src={item.featuredImage || "/images/placeholder.jpg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <span className="text-brand-orange font-bold text-[0.68rem] uppercase tracking-wider">{item.category || "General"}</span>
                    <h4 className="font-extrabold text-[0.95rem] text-white group-hover:text-brand-orange line-clamp-2 leading-snug flex-1">
                      <Link href={`/blog/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h4>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="text-brand-orange text-[0.7rem] font-bold uppercase tracking-widest flex items-center gap-1 mt-1"
                    >
                      Read Now <ArrowLeft className="w-3 h-3 rotate-180" />
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
