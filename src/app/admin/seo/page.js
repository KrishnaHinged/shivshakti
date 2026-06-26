import dbConnect from "@/shared/lib/mongodb";
import { Seo } from "@/shared/models";
import SeoClient from "@/features/admin/components/SeoClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminSeoPage() {
  await dbConnect();
  const seoItems = await Seo.find();

  return <SeoClient initialItems={JSON.parse(JSON.stringify(seoItems))} />;
}
