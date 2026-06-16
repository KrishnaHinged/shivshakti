import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import InquiriesClient from "@/components/admin/InquiriesClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminInquiriesPage() {
  await dbConnect();
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });

  return <InquiriesClient inquiries={JSON.parse(JSON.stringify(inquiries))} />;
}
