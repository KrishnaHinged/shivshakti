import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import Product from "@/models/Product";
import Gallery from "@/models/Gallery";
import Testimonial from "@/models/Testimonial";
import ActivityLog from "@/models/ActivityLog";
import Newsletter from "@/models/Newsletter";
import DashboardClient from "@/components/admin/DashboardClient";

export const revalidate = 0; // Dynamic server rendering

export default async function AdminDashboardPage() {
  await dbConnect();

  const [
    totalInquiries,
    newInquiries,
    totalProducts,
    totalGallery,
    totalTestimonials,
    totalSubscribers,
    recentInquiries,
    recentLogs,
  ] = await Promise.all([
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: { $in: ["new", "New"] } }),
    Product.countDocuments(),
    Gallery.countDocuments(),
    Testimonial.countDocuments(),
    Newsletter.countDocuments(),
    Inquiry.find().sort({ createdAt: -1 }).limit(5),
    ActivityLog.find().sort({ createdAt: -1 }).limit(6),
  ]);

  // Aggregate inquiries by product interest
  const inquiriesByProduct = await Inquiry.aggregate([
    { $group: { _id: "$productInterest", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Aggregate inquiries by city
  const inquiriesByCity = await Inquiry.aggregate([
    { $group: { _id: "$city", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  // Format groupings for Recharts
  const productChartData = inquiriesByProduct.map((item) => ({
    name:
      item._id === "manual-door"
        ? "Manual Door"
        : item._id === "automatic-door"
        ? "Auto Door"
        : item._id === "ss-ms-cabin"
        ? "Cabin"
        : item._id === "car-frame"
        ? "Car Frame"
        : item._id === "geared-gearless"
        ? "Machine"
        : item._id === "lop-cop"
        ? "LOP/COP"
        : item._id === "t-guide-rail"
        ? "Guide Rail"
        : item._id === "usha-martin"
        ? "Wire Rope"
        : item._id || "Other",
    value: item.count,
  }));

  const cityChartData = inquiriesByCity.map((item) => ({
    name: item._id || "Unknown",
    value: item.count,
  }));

  const stats = {
    totalInquiries,
    newInquiries,
    totalProducts,
    totalGallery,
    totalTestimonials,
    totalSubscribers,
    recentInquiries: JSON.parse(JSON.stringify(recentInquiries)),
    recentLogs: JSON.parse(JSON.stringify(recentLogs)),
    productChartData,
    cityChartData,
  };

  return <DashboardClient stats={stats} />;
}
