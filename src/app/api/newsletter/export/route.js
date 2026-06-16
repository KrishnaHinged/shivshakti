import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) {
      return new Response("Unauthorized access.", { status: 401 });
    }

    await dbConnect();
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });

    let csvContent = "Email,Subscribed At,Status\n";

    subscribers.forEach((item) => {
      const escape = (val) => {
        if (val === undefined || val === null) return "";
        const str = String(val).replace(/"/g, '""');
        return str.includes(",") || str.includes("\n") || str.includes('"')
          ? `"${str}"`
          : str;
      };

      csvContent += `${escape(item.email)},${escape(
        item.subscribedAt.toISOString()
      )},${escape(item.status)}\n`;
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=newsletter_subscribers_${Date.now()}.csv`,
      },
    });
  } catch (error) {
    return new Response(error.message || "CSV Export failed", { status: 500 });
  }
}
