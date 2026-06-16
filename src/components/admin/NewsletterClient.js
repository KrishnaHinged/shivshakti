"use client";

import { useState } from "react";
import { deleteSubscriberAction } from "@/actions/newsletter";

export default function NewsletterClient({ initialItems }) {
  const [items, setItems] = useState(initialItems);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this subscriber from the mailing list?")) {
      const res = await deleteSubscriberAction(id);
      if (res.success) {
        setItems(items.filter((item) => item._id !== id));
      } else {
        alert(res.error || "Failed to remove subscriber.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Newsletter Subscribers</h1>
          <p className="text-slate-500 text-sm mt-1">View subscriber lists, export campaign lists, and manage marketing registries.</p>
        </div>
        <a
          href="/api/newsletter/export"
          className="bg-brand-blue text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-blue-light shadow-sm transition text-center cursor-pointer"
        >
          📥 Download Subscribers CSV
        </a>
      </div>

      {/* Database list */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[0.72rem] uppercase font-bold tracking-wider border-b border-slate-100">
              <th className="py-4.5 px-6">Email Address</th>
              <th className="py-4.5 px-6">Subscription Date</th>
              <th className="py-4.5 px-6">Status</th>
              <th className="py-4.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-slate-400 text-center italic">
                  No mailing subscribers registered yet.
                </td>
              </tr>
            ) : (
              items.map((sub) => (
                <tr key={sub._id} className="hover:bg-slate-50/40 transition">
                  <td className="py-4 px-6 font-semibold text-slate-800">{sub.email}</td>
                  <td className="py-4 px-6 text-slate-500">{new Date(sub.subscribedAt).toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[0.68rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      sub.status === "active" ? "bg-green-50 text-green-700 border border-green-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
