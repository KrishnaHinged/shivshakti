import dbConnect from "@/shared/lib/mongodb";
import { Product, Category, Setting } from "@/shared/models";
import ProductsListingClient from "@/features/products/components/ProductsListingClient";

export const revalidate = 0; // Prevent dynamic route caching from serving stale data

export const metadata = {
  title: "Elevator Components & Solutions | Shivshakti Elevator Components",
  description: "Explore Shivshakti's complete range of elevator cabins, automatic doors, car frames, machines, guide rails, wire ropes, and elevator components.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Elevator Components & Solutions | Shivshakti Elevator Components",
    description: "Explore Shivshakti's complete range of elevator cabins, automatic doors, car frames, machines, guide rails, wire ropes, and elevator components.",
    type: "website",
    images: [{ url: "/images/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elevator Components & Solutions | Shivshakti Elevator Components",
    description: "Explore Shivshakti's complete range of elevator cabins, automatic doors, car frames, machines, guide rails, wire ropes, and elevator components.",
    images: ["/images/logo.png"],
  },
};

export default async function ProductsPage() {
  await dbConnect();

  // Load published/active products, categories, and site settings
  const [products, categories, settings] = await Promise.all([
    Product.find({ status: { $in: ["published", "active"] } }).sort({
      featured: -1,
      displayOrder: 1,
      createdAt: -1,
    }),
    Category.find().sort({ name: 1 }),
    Setting.findOne(),
  ]);

  const fallbackSettings = settings || {
    logoUrl: "/images/logo.png",
    companyName: "Shivshakti Elevator Components Pvt. Ltd.",
  };

  return (
    <ProductsListingClient
      products={JSON.parse(JSON.stringify(products))}
      categories={JSON.parse(JSON.stringify(categories))}
      settings={JSON.parse(JSON.stringify(fallbackSettings))}
    />
  );
}
