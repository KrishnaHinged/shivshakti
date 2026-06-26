"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/features/admin/services/authActions";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Mail,
  Image,
  Star,
  FileText,
  Search,
  Inbox,
  Settings,
  Globe,
  LogOut,
  Menu,
  X,
  Activity
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If we are on the login page, render children directly without dashboard sidebar wrappers
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      const res = await logoutAction();
      if (res.success) {
        router.push("/admin/login");
      }
    }
  };

  const navItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Products CMS", path: "/admin/products", icon: Package },
    { name: "Media Library", path: "/admin/media", icon: FolderOpen },
    { name: "Inquiries (Leads)", path: "/admin/inquiries", icon: Mail },
    { name: "Gallery Showcase", path: "/admin/gallery", icon: Image },
    { name: "Testimonials CMS", path: "/admin/testimonials", icon: Star },
    { name: "Blog Posts", path: "/admin/blogs", icon: FileText },
    { name: "SEO Optimization", path: "/admin/seo", icon: Search },
    { name: "Newsletter Subs", path: "/admin/newsletter", icon: Inbox },
    { name: "Website Settings", path: "/admin/settings", icon: Settings },
    { name: "Activity Logs", path: "/admin/logs", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row antialiased font-sans lg:pl-64">

      {/* Mobile Header */}
      <header className="lg:hidden bg-[#0f0b09] text-white p-4 flex justify-between items-center shadow-md">
        <Link href="/admin" className="font-bold tracking-wider text-brand-orange text-lg">
          SHIVSHAKTI ADMIN
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white outline-none focus:ring-0 text-xl flex items-center justify-center"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-[#0f0b09] text-white flex flex-col p-6 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Pinned Header */}
        <div className="mb-6 text-center lg:text-left shrink-0">
          <Link href="/" className="inline-block mb-3">
            <img src="/images/logo.png" alt="SHIVSHAKTI Logo" className="h-10 w-auto object-contain" />
          </Link>
          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-1">
            Control Panel
          </p>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 overflow-y-auto pr-1.5 flex flex-col gap-1.5 select-none custom-scrollbar mb-6">
          {navItems.map((item) => {
            const active = pathname === item.path;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-[0.92rem] font-semibold transition-all duration-300 ${active
                    ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Pinned Footer */}
        <div className="pt-6 border-t border-white/10 flex flex-col gap-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-lg text-xs font-bold text-brand-orange bg-brand-orange-pale hover:bg-brand-orange/20 uppercase tracking-wider text-center"
          >
            <Globe className="w-3.5 h-3.5" /> View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-[0.92rem] font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0 text-red-400" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}
    </div>
  );
}
