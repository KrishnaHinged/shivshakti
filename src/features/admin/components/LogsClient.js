"use client";

import { useState } from "react";
import {
  Key,
  Package,
  Settings,
  FileText,
  Image,
  Star,
  Search,
  ShieldAlert,
  Globe,
  Clock,
  Terminal,
} from "lucide-react";

export default function LogsClient({ initialLogs }) {
  const [logs] = useState(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const getLogIcon = (action) => {
    const className = "w-4 h-4 text-slate-500 shrink-0";
    if (action === "login_success") return <Key className="w-4 h-4 text-emerald-500 shrink-0" />;
    if (action === "login_failure") return <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 animate-pulse" />;
    if (action.includes("product")) return <Package className={className} />;
    if (action.includes("settings") || action.includes("seo")) return <Settings className={className} />;
    if (action.includes("blog")) return <FileText className={className} />;
    if (action.includes("gallery")) return <Image className={className} />;
    if (action.includes("testimonial")) return <Star className={className} />;
    return <Terminal className={className} />;
  };

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (log.details && log.details.toLowerCase().includes(term)) ||
      (log.action && log.action.toLowerCase().includes(term)) ||
      (log.ipAddress && log.ipAddress.toLowerCase().includes(term)) ||
      (log.userAgent && log.userAgent.toLowerCase().includes(term));

    const matchAction =
      actionFilter === "all" ||
      (actionFilter === "login" && log.action.includes("login")) ||
      (actionFilter === "product" && log.action.includes("product")) ||
      (actionFilter === "blog" && log.action.includes("blog")) ||
      (actionFilter === "gallery" && log.action.includes("gallery")) ||
      (actionFilter === "settings" && (log.action.includes("settings") || log.action.includes("seo"))) ||
      (actionFilter === "inquiry" && log.action.includes("inquiry"));

    return matchSearch && matchAction;
  });

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Activity Logs</h1>
        <p className="text-slate-500 text-sm mt-1">
          Monitor administrative changes, logins, and form submissions in real-time.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search by details, actions, IP Address, or User Agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-150 rounded-xl pl-10 pr-4 py-3 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
          >
            <option value="all">All Operations</option>
            <option value="login">Login Operations</option>
            <option value="product">Product CMS Edits</option>
            <option value="blog">Blog Articles</option>
            <option value="gallery">Gallery Showcases</option>
            <option value="inquiry">Inquiries (Leads)</option>
            <option value="settings">Settings / SEO Updates</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 text-lg">Activity Stream</h2>
          <span className="bg-slate-50 border border-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-full font-bold">
            {filteredLogs.length} entries matching
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[0.68rem] select-none">
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Event</th>
                <th className="py-4 px-6">Action / Details</th>
                <th className="py-4 px-6">IP Address</th>
                <th className="py-4 px-6">User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-slate-400 text-center italic">
                    No system log records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isFailure = log.action === "login_failure";
                  return (
                    <tr
                      key={log._id}
                      className={`hover:bg-slate-50/50 transition duration-150 ${isFailure ? "bg-red-50/15" : ""}`}
                    >
                      <td className="py-4 px-6 whitespace-nowrap text-slate-400 text-xs font-medium">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
                            log.action === "login_success"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : log.action === "login_failure"
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {getLogIcon(log.action)}
                          {log.action.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-800 font-medium max-w-[320px] truncate" title={log.details}>
                        {log.details}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-slate-500 font-mono text-xs">
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          {log.ipAddress || "127.0.0.1"}
                        </span>
                      </td>
                      <td className="py-4 px-6 max-w-[200px] truncate" title={log.userAgent}>
                        <span className="font-mono text-slate-400 text-xs truncate block">
                          {log.userAgent || "System Process"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
