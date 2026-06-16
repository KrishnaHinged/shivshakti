import dbConnect from "@/lib/mongodb";
import Seo from "@/models/Seo";
import SeoClient from "@/components/admin/SeoClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminSeoPage() {
  await dbConnect();
  const seoItems = await Seo.find();

  return <SeoClient initialItems={JSON.parse(JSON.stringify(seoItems))} />;
}
