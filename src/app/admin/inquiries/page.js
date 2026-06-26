import dbConnect from "@/shared/lib/mongodb";
import { Inquiry, Admin } from "@/shared/models";
import { InquiriesClient } from "@/features/crm";
import { cookies } from "next/headers";
import { verifyToken } from "@/shared/lib/auth";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminInquiriesPage() {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  const decoded = token ? verifyToken(token) : null;
  const userRole = decoded?.role || "SALES_EXECUTIVE";
  const userId = decoded?.id;

  let filter = {};
  if (userRole === "SALES_EXECUTIVE") {
    filter = { assignedTo: userId };
  }

  const inquiries = await Inquiry.find(filter)
    .populate("assignedTo", "name email role")
    .sort({ createdAt: -1 });

  const adminsList = await Admin.find({ isActive: true }, "name email role");

  return (
    <InquiriesClient
      inquiries={JSON.parse(JSON.stringify(inquiries))}
      adminsList={JSON.parse(JSON.stringify(adminsList))}
      currentUser={{ id: userId, role: userRole }}
    />
  );
}

