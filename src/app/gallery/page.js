import dbConnect from "@/shared/lib/mongodb";
import { Gallery, Product, Setting } from "@/shared/models";
import Header from "@/shared/layouts/Header/Header";
import Footer from "@/shared/layouts/Footer/Footer";
import ShowcaseGallery from "@/features/gallery/components/HomeGallery";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#F9F9FB] text-slate-800 font-sans selection:bg-brand-orange selection:text-white flex flex-col">
      {/* Navigation Header */}
      <Header logoUrl={serializedSettings.logoUrl} />

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
                <span className="text-brand-blue font-semibold">Gallery</span>
              </nav>

              <div className="max-w-3xl flex flex-col gap-4">
                <span className="text-brand-orange text-[0.82rem] font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-4 py-1.5 rounded-full border border-brand-orange/20 select-none w-fit">
                  Showcase
                </span>
                <h1 className="text-4xl lg:text-[3.2rem] font-extrabold tracking-tight leading-[1.15] text-white font-sans mt-2">
                  Our <span className="italic text-brand-blue font-medium font-serif">Landmark</span> Projects
                </h1>
                <p className="text-[1rem] lg:text-[1.1rem] text-text-secondary leading-[1.6] mt-1 opacity-90 max-w-2xl">
                  Shivshakti premium components deployed in outstanding residential, commercial, and hospitality projects across India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Showcase Content Grid Wrapper */}
        <div className="max-w-[1300px] mx-auto px-4 lg:px-8 py-12">
          <ShowcaseGallery gallery={JSON.parse(JSON.stringify(gallery))} hideHeader={true} />
        </div>
      </main>

      {/* Footer */}
      <Footer products={JSON.parse(JSON.stringify(allActiveProducts))} settings={serializedSettings} />
    </div>
  );
}
