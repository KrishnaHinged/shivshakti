import dbConnect from "@/shared/lib/mongodb";
import { Product, Testimonial, Gallery, Setting } from "@/shared/models";
import { Home as MainPage } from "@/features/home";

export const revalidate = 0; // Ensure real-time entries are loaded on refresh

// Dynamic SEO Metadata Generator
export async function generateMetadata() {
  await dbConnect();
  const settings = await Setting.findOne();
  
  const title = settings?.companyName 
    ? `${settings.companyName} | Touch The Sky`
    : "Shivshakti Elevator Components Pvt. Ltd. | Touch The Sky With Shivshakti";
    
  const desc = settings?.footerDescription || "Manufacturer of premium elevator cabins, automatic doors, car frames, and elevator components headquartered in Surat, India.";

  return {
    title,
    description: desc,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description: desc,
      images: [{ url: settings?.logoUrl || "/images/logo.png" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [settings?.logoUrl || "/images/logo.png"],
    },
  };
}

export default async function Home() {
  await dbConnect();

  const [products, testimonials, gallery, settings] = await Promise.all([
    Product.find({ status: { $in: ["published", "active"] } }).sort({
      featured: -1,
      displayOrder: 1,
      createdAt: -1,
    }),
    Testimonial.find({ status: "published" }).sort({ displayOrder: 1, createdAt: -1 }),
    Gallery.find({ featured: true }).sort({ sortOrder: 1, createdAt: -1 }),
    Setting.findOne(),
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
      instagram: "https://instagram.com/shiv_shakti_industries16",
      whatsapp: "https://api.whatsapp.com/send/?phone=6352699700",
    },
    googleMapsEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=72.8289%2C21.1261%2C72.8389%2C21.1361&layer=mapnik&marker=21.131094%2C72.833979",
    logoUrl: "/images/logo.png",
    faviconUrl: "/favicon.ico",
    footerDescription: "Manufacturer of premium elevator cabins, automatic doors, car frames and components. Headquartered in Surat, Gujarat with branches in Indore and Lucknow.",
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": fallbackSettings.companyName,
    "url": "https://www.shivshaktielevatorcomponents.com",
    "logo": "https://www.shivshaktielevatorcomponents.com" + fallbackSettings.logoUrl,
    "contactPoint": fallbackSettings.phones.map(p => ({
      "@type": "ContactPoint",
      "telephone": p,
      "contactType": "sales",
      "areaServed": "IN"
    })),
    "address": fallbackSettings.addresses.map(a => ({
      "@type": "PostalAddress",
      "streetAddress": a.addressLine,
      "addressLocality": a.branchName,
      "addressRegion": a.cityState,
      "addressCountry": "IN"
    })),
    "sameAs": [
      fallbackSettings.socialLinks?.facebook,
      fallbackSettings.socialLinks?.instagram,
      fallbackSettings.socialLinks?.whatsapp
    ].filter(Boolean)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <MainPage
        products={JSON.parse(JSON.stringify(products))}
        testimonials={JSON.parse(JSON.stringify(testimonials))}
        gallery={JSON.parse(JSON.stringify(gallery))}
        settings={JSON.parse(JSON.stringify(fallbackSettings))}
      />
    </>
  );
}
