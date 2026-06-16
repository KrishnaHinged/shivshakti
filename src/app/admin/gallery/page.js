import dbConnect from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import GalleryClient from "@/components/admin/GalleryClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminGalleryPage() {
  await dbConnect();
  const galleryItems = await Gallery.find().sort({ sortOrder: 1, createdAt: -1 });

  return <GalleryClient initialItems={JSON.parse(JSON.stringify(galleryItems))} />;
}
