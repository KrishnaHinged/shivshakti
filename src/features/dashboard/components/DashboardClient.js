"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Calendar,
  Mail,
  Flame,
  Package,
  Inbox,
  Key,
  Settings,
  FileText,
  Image,
  Star,
  ArrowUpRight,
} from "lucide-react";

const COLORS = [
  "#1E3A8A",
  "#F97316",
  "#3B5FBB",
  "#FB923C",
  "#5a4b41",
  "#eae1d8",
  "#3a2c20",
];

export default function DashboardClient({ stats }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set default fallback values for charts if database returns empty datasets
  const productData =
    stats.productChartData.length > 0
      ? stats.productChartData
      : [
          { name: "Cabin", value: 8 },
          { name: "Auto Door", value: 14 },
          { name: "Manual Door", value: 5 },
          { name: "Wire Rope", value: 11 },
          { name: "LOP/COP", value: 6 },
        ];

  const cityData =
    stats.cityChartData.length > 0
      ? stats.cityChartData
      : [
          { name: "Surat", value: 15 },
          { name: "Indore", value: 8 },
          { name: "Lucknow", value: 11 },
          { name: "Mumbai", value: 6 },
          { name: "Delhi", value: 4 },
        ];

  const getLogIcon = (action) => {
    const className = "w-5 h-5 text-slate-500 shrink-0";
    if (action.includes("login")) return <Key className={className} />;
    if (action.includes("product")) return <Package className={className} />;
    if (action.includes("settings")) return <Settings className={className} />;
    if (action.includes("blog")) return <FileText className={className} />;
    if (action.includes("gallery")) return <Image className={className} />;
    if (action.includes("testimonial")) return <Star className={className} />;
    return <FileText className={className} />;
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time leads analytics and CMS status logs.
          </p>
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Active: June 2026</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
        {/* Total Inquiries */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-350">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[0.68rem] uppercase tracking-wider font-bold text-slate-400">
                Total Leads
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {stats.totalInquiries}
              </h3>
            </div>
            <span className="bg-brand-blue-pale p-2 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-brand-blue" />
            </span>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="text-[0.7rem] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.4%
            </span>
            <span className="text-[0.65rem] text-slate-400">this month</span>
          </div>
        </div>

        {/* New Inquiries */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[0.68rem] uppercase tracking-wider font-bold text-slate-400">
                New Leads
              </span>
              <h3 className="text-2xl font-extrabold text-brand-orange mt-1">
                {stats.newInquiries}
              </h3>
            </div>
            <span className="bg-brand-orange-pale p-2 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-brand-orange" />
            </span>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="text-[0.7rem] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.2%
            </span>
            <span className="text-[0.65rem] text-slate-400">this week</span>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[0.68rem] uppercase tracking-wider font-bold text-slate-400">
                Products
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {stats.totalProducts}
              </h3>
            </div>
            <span className="bg-slate-100 p-2 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-slate-500" />
            </span>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="text-[0.7rem] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
              Steady
            </span>
            <span className="text-[0.65rem] text-slate-400">active items</span>
          </div>
        </div>

        {/* Subscribers */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[0.68rem] uppercase tracking-wider font-bold text-slate-400">
                Subscribers
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {stats.totalSubscribers}
              </h3>
            </div>
            <span className="bg-slate-100 p-2 rounded-xl flex items-center justify-center">
              <Inbox className="w-5 h-5 text-slate-500" />
            </span>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="text-[0.7rem] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.7%
            </span>
            <span className="text-[0.65rem] text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Gallery Items */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[0.68rem] uppercase tracking-wider font-bold text-slate-400">
                Gallery Items
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {stats.totalGallery}
              </h3>
            </div>
            <span className="bg-slate-100 p-2 rounded-xl flex items-center justify-center">
              <Image className="w-5 h-5 text-slate-500" />
            </span>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="text-[0.7rem] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              +3 new
            </span>
            <span className="text-[0.65rem] text-slate-400">uploaded</span>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[0.68rem] uppercase tracking-wider font-bold text-slate-400">
                Reviews
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {stats.totalTestimonials}
              </h3>
            </div>
            <span className="bg-slate-100 p-2 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-slate-500" />
            </span>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="text-[0.7rem] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +5%
            </span>
            <span className="text-[0.65rem] text-slate-400">active reviews</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Interest (PieChart) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Inquiry Interest by Product
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="40%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Leads`, "Count"]} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconSize={10}
                  fontSize={12}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Cities (BarChart) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Top Lead Locations (Cities)
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={cityData}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip formatter={(value) => [`${value} Leads`, "Count"]} />
                <Bar
                  dataKey="value"
                  fill="#F97316"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lists Row (Recent Leads & Audit Logs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-slate-900">Recent Inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="text-xs font-semibold text-brand-orange hover:underline uppercase tracking-wider"
            >
              View All →
            </Link>
          </div>

          {stats.recentInquiries.length === 0 ? (
            <div className="text-slate-400 text-sm py-12 text-center italic border border-dashed border-slate-100 rounded-2xl">
              No inquiries received yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {stats.recentInquiries.map((lead) => (
                <div
                  key={lead._id}
                  className="flex justify-between items-center p-4.5 rounded-xl hover:bg-slate-50 transition duration-200 border border-slate-100"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-[0.92rem]">
                      {lead.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lead.company || "Individual"} • {lead.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[0.68rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        lead.status === "new"
                          ? "bg-brand-orange/15 text-brand-orange"
                          : "bg-brand-blue-pale text-brand-blue"
                      }`}
                    >
                      {lead.status}
                    </span>
                    <p className="text-[0.65rem] text-slate-400 mt-1">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Log / Activities */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              System Activity Logs
            </h2>
            <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg">
              Audit Tracker
            </span>
          </div>

          {stats.recentLogs.length === 0 ? (
            <div className="text-slate-400 text-sm py-12 text-center italic border border-dashed border-slate-100 rounded-2xl">
              No system logs recorded.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.recentLogs.map((log) => (
                <div
                  key={log._id}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-50 hover:bg-slate-50 transition duration-200"
                >
                  <span className="flex select-none shrink-0 mt-0.5">
                    {getLogIcon(log.action)}
                  </span>
                  <div>
                    <h4 className="font-semibold text-slate-700 text-[0.88rem] leading-snug">
                      {log.details}
                    </h4>
                    <p className="text-[0.7rem] text-slate-400 mt-1.5">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
