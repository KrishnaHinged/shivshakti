import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Setting from "@/models/Setting";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 0; // Prevent caching from serving stale data

// Dynamic SEO Metadata Generator
export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  
  // Try finding product
  const product = await Product.findOne({ slug });
  if (!product) {
    return {
      title: "Product Not Found | Shivshakti Elevator",
    };
  }

  const titleText = product.seoTitle || `${product.title} | Shivshakti Elevator Components`;
  const descText = product.seoDescription || product.shortDescription;
  
  return {
    title: titleText,
    description: descText,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: titleText,
      description: descText,
      images: [{ url: product.featuredImage }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
      images: [product.featuredImage],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  await dbConnect();

  // Check if current user is admin for Preview Mode
  const cookieStore = await cookies();
  const isAdmin = !!cookieStore.get("admin-token")?.value;

  // Query product. If not admin, restrict to published/active status
  const query = { slug };
  if (!isAdmin) {
    query.status = { $in: ["published", "active"] };
  }

  const product = await Product.findOne(query);
  if (!product) {
    notFound();
  }

  // Load recommendations, settings, and full listings
  const [settings, similarProducts, allActiveProducts] = await Promise.all([
    Setting.findOne(),
    Product.find({
      category: product.category,
      status: { $in: ["published", "active"] },
      _id: { $ne: product._id },
    })
      .limit(3)
      .sort({ featured: -1, displayOrder: 1, createdAt: -1 }),
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
    emails: ["sales.shivshakti22@gmail.com"],
    phones: ["+91 9737171100"],
    whatsapp: "+91 9737171100",
    logoUrl: "/images/logo.png",
    faviconUrl: "/favicon.ico",
  };

  // Structured JSON-LD Data for SEO
  const allImages = [product.featuredImage, ...(product.galleryImages || product.images || [])].filter(Boolean);
  const specsMap = product.specifications?.size 
    ? Object.fromEntries(product.specifications) 
    : (product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs || {});
  
  const specsList = Object.entries(specsMap).map(([k, v]) => ({
    "@type": "PropertyValue",
    "name": k,
    "value": v
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": allImages,
    "description": product.shortDescription || product.seoDescription || product.description,
    "category": product.category,
    "manufacturer": {
      "@type": "Organization",
      "name": fallbackSettings.companyName || "Shivshakti Elevator Components Pvt. Ltd.",
      "logo": "https://www.shivshaktielevatorcomponents.com" + fallbackSettings.logoUrl
    },
    "additionalProperty": specsList,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "price": "Contact for quotation",
    },
  };

  return (
    <>
      {/* Insert JSON-LD Microdata for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={JSON.parse(JSON.stringify(product))}
        similarProducts={JSON.parse(JSON.stringify(similarProducts))}
        settings={JSON.parse(JSON.stringify(fallbackSettings))}
        allActiveProducts={JSON.parse(JSON.stringify(allActiveProducts))}
      />
    </>
  );
}
