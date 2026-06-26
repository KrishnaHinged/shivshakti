import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) {
      return new Response("Unauthorized access.", { status: 401 });
    }

    const { verifyToken } = require("@/lib/auth");
    const decoded = verifyToken(token);
    if (!decoded) {
      return new Response("Invalid or expired session token.", { status: 401 });
    }

    const { hasPermission } = require("@/permissions/permissions");
    const { PERMISSIONS } = require("@/permissions/roles");
    if (!hasPermission(decoded, PERMISSIONS.EXPORT_CRM)) {
      return new Response("Access Denied: You do not have permission to export CRM data.", { status: 403 });
    }

    await dbConnect();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    let csvContent =
      "Name,Company,Phone,Email,City,Product Interest,Customization Color,Customization Finish,Message,Status,Notes,Date\n";

    inquiries.forEach((item) => {
      const escape = (val) => {
        if (val === undefined || val === null) return "";
        const str = String(val).replace(/"/g, '""');
        return str.includes(",") || str.includes("\n") || str.includes('"')
          ? `"${str}"`
          : str;
      };

      csvContent += `${escape(item.name)},${escape(item.company)},${escape(
        item.phone
      )},${escape(item.email)},${escape(item.city)},${escape(
        item.productInterest
      )},${escape(item.customizationColor)},${escape(item.customizationFinish)},${escape(item.message)},${escape(item.status)},${escape(
        item.notes
      )},${escape(item.createdAt.toISOString())}\n`;
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=leads_export_${Date.now()}.csv`,
      },
    });
  } catch (error) {
    return new Response(error.message || "CSV Export failed", { status: 500 });
  }
}
