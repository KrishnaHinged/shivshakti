import dbConnect from "@/shared/lib/mongodb";
import { Newsletter } from "@/shared/models";
import NewsletterClient from "@/features/admin/components/NewsletterClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminNewsletterPage() {
  await dbConnect();
  const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });

  return <NewsletterClient initialItems={JSON.parse(JSON.stringify(subscribers))} />;
}
