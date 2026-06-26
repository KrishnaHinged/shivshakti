import dbConnect from "@/shared/lib/mongodb";
import { Product, Category } from "@/shared/models";
import ProductsClient from "@/features/products/components/Admin/ProductsClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminProductsPage() {
  await dbConnect();
  const [products, categories] = await Promise.all([
    Product.find().sort({ createdAt: -1 }),
    Category.find().sort({ name: 1 }),
  ]);

  return (
    <ProductsClient
      products={JSON.parse(JSON.stringify(products))}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
