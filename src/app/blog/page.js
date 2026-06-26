import dbConnect from "@/shared/lib/mongodb";
import { Blog, Setting, Product } from "@/shared/models";
import Header from "@/shared/layouts/Header/Header";
import Footer from "@/shared/layouts/Footer/Footer";
import { BlogListingClient } from "@/features/blog";

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
    <div className="bg-[#F9F9FB] text-slate-800 min-h-screen flex flex-col font-sans select-none overflow-x-hidden">
      <Header logoUrl={settings.logoUrl} />
      <BlogListingClient
        posts={JSON.parse(JSON.stringify(posts))}
        categories={categories}
        activeCategory={activeCategory}
        query={query}
      />
      <Footer products={JSON.parse(JSON.stringify(featuredProducts))} settings={settings} />
    </div>
  );
}
