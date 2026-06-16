import dbConnect from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import Product from "@/models/Product";
import Setting from "@/models/Setting";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShowcaseGallery from "@/components/sections/Gallery";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 0; // Prevent caching from serving stale data

export const metadata = {
  title: "Landmark Projects Gallery | Shivshakti Elevator Components",
  description: "View our portfolio of landmark passenger, goods, glass cabins, and automatic door installations across India.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Landmark Projects Gallery | Shivshakti Elevator Components",
    description: "View our portfolio of landmark passenger, goods, glass cabins, and automatic door installations across India.",
    type: "website",
    images: [{ url: "/images/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Landmark Projects Gallery | Shivshakti Elevator Components",
    description: "View our portfolio of landmark passenger, goods, glass cabins, and automatic door installations across India.",
    images: ["/images/logo.png"],
  },
};

export default async function GalleryPage() {
  await dbConnect();

  const [gallery, settings, allActiveProducts] = await Promise.all([
    Gallery.find().sort({ sortOrder: 1, createdAt: -1 }),
    Setting.findOne(),
    Product.find({ status: { $in: ["published", "active"] } }).sort({
      featured: -1,
      displayOrder: 1,
      createdAt: -1,
    }),
  ]);

  const fallbackSettings = settings || {
    logoUrl: "/images/logo.png",
    companyName: "Shivshakti Elevator Components Pvt. Ltd.",
  };

  const serializedSettings = JSON.parse(JSON.stringify(fallbackSettings));

  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans selection:bg-brand-orange selection:text-white">
      {/* Navigation Header */}
      <Header logoUrl={serializedSettings.logoUrl} />

      {/* Hero Header Section */}
      <section className="bg-bg-light text-text-light-primary border-b border-border-light pb-20 pt-32 lg:pb-28 lg:pt-40 px-6 lg:px-16">
        <div className="max-w-[1300px] mx-auto flex flex-col gap-6">
          {/* Breadcrumb */}
          <nav className="text-xs lg:text-sm font-semibold tracking-wide text-text-light-secondary flex items-center gap-2">
            <Link href="/" className="hover:text-brand-orange transition duration-200">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-text-light-secondary/40" />
            <span className="text-brand-blue">Gallery</span>
          </nav>

          <div className="max-w-3xl flex flex-col gap-4">
            <span className="text-brand-blue text-[0.85rem] font-bold uppercase tracking-[0.2em] block">
              Showcase
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-text-light-primary">
              Our Landmark Projects
            </h1>
            <p className="text-[1.05rem] text-text-light-secondary leading-[1.7] mt-1">
              Shivshakti premium components deployed in outstanding residential, commercial, and hospitality projects across India.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Showcase Content Grid Wrapper */}
      <div className="bg-bg-dark px-4 lg:px-6 py-12">
        <div className="bg-bg-light rounded-[48px] overflow-hidden max-w-[1300px] mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
          <ShowcaseGallery gallery={JSON.parse(JSON.stringify(gallery))} />
        </div>
      </div>

      {/* Footer */}
      <Footer products={JSON.parse(JSON.stringify(allActiveProducts))} settings={serializedSettings} />
    </div>
  );
}
