import dbConnect from "@/shared/lib/mongodb";
import { Gallery } from "@/shared/models";
import { GalleryClient } from "@/features/gallery";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminGalleryPage() {
  await dbConnect();
  const galleryItems = await Gallery.find().sort({ sortOrder: 1, createdAt: -1 });

  return <GalleryClient initialItems={JSON.parse(JSON.stringify(galleryItems))} />;
}
