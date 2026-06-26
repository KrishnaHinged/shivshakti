import Link from "next/link";
import dbConnect from "@/shared/lib/mongodb";
import { Setting, Product } from "@/shared/models";
import Header from "@/shared/layouts/Header/Header";
import About from "@/features/about/About";
import Footer from "@/shared/layouts/Footer/Footer";

export const revalidate = 0; // Ensure fresh data on refresh

export const metadata = {
  title: "About Us | ShivShakti Elevator Components Pvt. Ltd.",
  description: "Established in 1998, ShivShakti Elevator Components is one of India's leading manufacturers and suppliers of elevator components — 1,50,000+ imperforated doors, 85,000+ auto doors, 1,500+ customers nationwide.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | ShivShakti Elevator Components Pvt. Ltd.",
    description: "Established in 1998, ShivShakti Elevator Components is one of India's leading manufacturers and suppliers of elevator components — 1,50,000+ imperforated doors, 85,000+ auto doors, 1,500+ customers nationwide.",
    type: "website",
    images: [{ url: "/images/factory-exterior.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | ShivShakti Elevator Components Pvt. Ltd.",
    description: "Established in 1998, ShivShakti Elevator Components is one of India's leading manufacturers and suppliers of elevator components.",
    images: ["/images/factory-exterior.jpg"],
  },
};

export default async function AboutPage() {
  await dbConnect();

  const [settings, products] = await Promise.all([
    Setting.findOne(),
    Product.find({ status: { $in: ["published", "active"] } }).sort({
      featured: -1,
      displayOrder: 1,
      createdAt: -1,
    }),
  ]);

  const fallbackSettings = settings || {
    companyName: "Shivshakti Elevator Components Pvt. Ltd.",
    tagline: "Touch The Sky With Shivshakti",
    subTagline: "Work With Honesty",
    emails: ["sales.shivshakti22@gmail.com", "sales.shivshakti16@gmail.com"],
    phones: ["+91 9737171100", "+91 6352699700"],
    whatsapp: "+91 6352699700",
    addresses: [
      {
        branchName: "Surat Head Office",
        addressLine: "Plot No. 2, Hi-Tech Park, Siddharth Nagar Canal Road, Opp. Navin Florin, Vadod-Bhestan",
        cityState: "Surat - 395023, Gujarat, INDIA",
        phone: "+91 9737171100 / +91 6352699700",
        email: "sales.shivshakti22@gmail.com",
        badge: "Head Office",
      },
      {
        branchName: "Indore Branch",
        addressLine: "B 146 New Loha Mandi, Niranjanpur Devas Naka",
        cityState: "Indore - 452010, MP, INDIA",
        phone: "+91 9909801225",
        email: "sales.shivshaktiindore01@gmail.com",
        badge: "Branch Office",
      },
      {
        branchName: "Lucknow Branch",
        addressLine: "House No 11-A, 12-A Shyam Bhawan, Kanpur Road, Sarojini Nagar",
        cityState: "Lucknow - 226008, UP, INDIA",
        phone: "+91 6353 547 898",
        email: "sales.shivshaktilucknow@gmail.com",
        badge: "Branch Office",
      },
    ],
    gst: "24ACMFS0685B1Z7",
    iec: "5214013353",
    banker: "HDFC Bank",
    socialLinks: {
      facebook: "https://www.facebook.com/profile.php?id=100050285328348",
      instagram: "https://instagram.com/shadow_shakti_industries16",
      whatsapp: "https://api.whatsapp.com/send/?phone=6352699700",
    },
    googleMapsEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=72.8289%2C21.1261%2C72.8389%2C21.1361&layer=mapnik&marker=21.131094%2C72.833979",
    logoUrl: "/images/logo.png",
    faviconUrl: "/favicon.ico",
    footerDescription: "Manufacturer of premium elevator cabins, automatic doors, car frames and components. Headquartered in Surat, Gujarat with branches in Indore and Lucknow.",
  };

  const serializedSettings = JSON.parse(JSON.stringify(fallbackSettings));
  const serializedProducts = JSON.parse(JSON.stringify(products));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ShivShakti Elevator Components Pvt. Ltd.",
    "image": "/images/factory-exterior.jpg",
    "telephone": "+91 9737171100",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot No. 2, Hi-Tech Park, Siddharth Nagar Canal Road, Opp. Navin Florin, Vadod-Bhestan",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "postalCode": "395023",
      "addressCountry": "IN"
    },
    "description": "Established in 1998, ShivShakti Elevator Components is one of India's leading manufacturers and suppliers of luxury elevator cabins, automatic doors, car frames, and custom lift components.",
    "url": "https://shivshaktielevator.com/about",
    "foundingDate": "1998"
  };

  return (
    <div className="relative bg-[#F9F9FB] selection:bg-brand-orange selection:text-white min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <Header logoUrl={serializedSettings.logoUrl} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Premium Hero Header Section */}
        <section className="w-full px-4 lg:px-8 pt-24 lg:pt-28 pb-4 bg-transparent">
          <div className="relative w-full rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden bg-neutral-950 flex flex-col justify-center p-8 md:p-12 lg:p-16 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-h-[260px] md:min-h-[320px]">
            {/* Background Image & Radial Glow Overlay */}
            <div className="absolute inset-0 bg-[url('/images/factory-exterior.jpg')] bg-cover bg-center bg-no-repeat opacity-25 z-0" />
            <div className="absolute inset-0 z-10" />

            {/* Content Details */}
            <div className="relative z-20 max-w-[1300px] flex flex-col gap-6">
              {/* Breadcrumb */}
              <nav className="text-xs lg:text-sm font-semibold tracking-wide text-slate-400 flex items-center gap-2">
                <Link href="/" className="hover:text-brand-orange transition duration-200">
                  Home
                </Link>
                <span className="text-white/20 font-mono">/</span>
                <span className="text-brand-blue font-semibold">About Us</span>
              </nav>

              <div className="max-w-3xl flex flex-col gap-4">
                <span className="text-brand-orange text-[0.82rem] font-bold uppercase tracking-[0.2em] bg-brand-orange-pale px-4 py-1.5 rounded-full border border-brand-orange/20 select-none w-fit">
                  Since 1998
                </span>
                <h1 className="text-4xl lg:text-[3.2rem] font-extrabold tracking-tight leading-[1.15] text-white font-sans mt-2">
                  About{" "}
                  <span className="italic text-brand-blue font-medium font-serif">
                    ShivShakti
                  </span>{" "}
                  <span className="italic text-brand-orange font-medium font-serif">
                    Elevator
                  </span>
                </h1>
                <p className="text-[1rem] lg:text-[1.1rem] text-text-secondary leading-[1.6] mt-1 opacity-90 max-w-2xl">
                  One of India's leading manufacturers and suppliers of elevator
                  components, recognized for quality, innovation, and reliability
                  in the vertical transportation industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1300px] mx-auto">
          <About />
        </div>
      </main>

      {/* Footer */}
      <Footer products={serializedProducts} settings={serializedSettings} />
    </div>
  );
}
