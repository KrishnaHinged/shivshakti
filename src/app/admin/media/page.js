import dbConnect from "@/shared/lib/mongodb";
import { MediaLibrary } from "@/shared/models";
import { MediaClient } from "@/features/admin";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminMediaPage() {
  await dbConnect();
  const mediaItems = await MediaLibrary.find().sort({ createdAt: -1 });

  return <MediaClient initialItems={JSON.parse(JSON.stringify(mediaItems))} />;
}
