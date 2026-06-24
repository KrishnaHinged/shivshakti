"use client";

import { useState } from "react";
import {
  updateInquiryStatusAction,
  addInquiryNoteAction,
  deleteInquiryAction,
} from "@/actions/inquiries";
import {
  Download,
  Trash2,
  Phone,
  MessageSquare,
  Clipboard,
  Kanban,
  List,
  Mail,
  MapPin,
  Calendar,
  Building,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function InquiriesClient({ inquiries: initialInquiries }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [viewMode, setViewMode] = useState("pipeline"); // 'pipeline' (Kanban) or 'list' (Table)
  
  // Note Timeline input
  const [noteInput, setNoteInput] = useState("");
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    setStatus(lead.status);
    setSuccessMsg("");
    setNoteInput("");
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setUpdating(true);
    const res = await updateInquiryStatusAction(selectedLead._id, newStatus);
    setUpdating(false);
    if (res.success) {
      const updated = inquiries.map((item) =>
        item._id === selectedLead._id ? { ...item, status: newStatus } : item
      );
      setInquiries(updated);
      setSelectedLead(updated.find(item => item._id === selectedLead._id));
      setSuccessMsg("Status updated successfully!");
    }
  };

  const handleSaveNotes = async () => {
    if (!noteInput.trim()) return;
    setUpdating(true);
    const res = await addInquiryNoteAction(selectedLead._id, noteInput);
    setUpdating(false);
    if (res.success) {
      const updated = inquiries.map((item) =>
        item._id === selectedLead._id ? res.data : item
      );
      setInquiries(updated);
      setSelectedLead(res.data);
      setNoteInput("");
      setSuccessMsg("Timeline note added successfully!");
    }
  };

  const handleDeleteLead = async (id) => {
    if (confirm("Are you sure you want to delete this lead? This action is irreversible.")) {
      const res = await deleteInquiryAction(id);
      if (res.success) {
        setInquiries(inquiries.filter((item) => item._id !== id));
        setSelectedLead(null);
      }
    }
  };

  const handleCopyDetails = (lead) => {
    let text = `Lead Details:\nName: ${lead.name}\nCompany: ${lead.company || "N/A"}\nPhone: ${lead.phone}\nEmail: ${lead.email}\nElevator Type: ${lead.elevatorType || "N/A"}\nComponent: ${lead.componentNeeded || lead.productInterest || "N/A"}\nQuantity: ${lead.quantity || "N/A"}`;
    if (lead.customizationColor) {
      text += `\nCustom Color: ${lead.customizationColor}`;
    }
    if (lead.customizationFinish) {
      text += `\nCustom Finish: ${lead.customizationFinish} Finish`;
    }
    text += `\nMessage: ${lead.message}`;
    navigator.clipboard.writeText(text);
    alert("Lead details copied to clipboard!");
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    const originalInquiries = [...inquiries];
    // Optimistic Update
    setInquiries(prev =>
      prev.map((item) => (item._id === id ? { ...item, status: targetStatus } : item))
    );

    const res = await updateInquiryStatusAction(id, targetStatus);
    if (!res.success) {
      setInquiries(originalInquiries);
      alert("Failed to update lead status: " + res.error);
    } else {
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead(prev => ({ ...prev, status: targetStatus }));
        setStatus(targetStatus);
      }
    }
  };

  // Filter & Search Logic
  const filteredInquiries = inquiries.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      item.name.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      (item.city && item.city.toLowerCase().includes(term)) ||
      (item.company && item.company.toLowerCase().includes(term)) ||
      (item.componentNeeded && item.componentNeeded.toLowerCase().includes(term)) ||
      (item.productInterest && item.productInterest.toLowerCase().includes(term));
      
    // Handle both old and new casing in status checks
    const normalize = (s) => s.toLowerCase();
    const matchStatus = statusFilter === "all" || normalize(item.status) === normalize(statusFilter);
    
    const matchProduct = productFilter === "all" || 
      item.productInterest === productFilter || 
      item.componentNeeded === productFilter ||
      item.productSlug === productFilter;
    
    return matchSearch && matchStatus && matchProduct;
  });

  const getWhatsAppUrl = (lead) => {
    let cleanPhone = lead.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }
    const product = lead.componentNeeded || lead.productInterest || "Elevator Components";
    const msg = `Hello ${lead.name},\n\nWe received your inquiry at Shivshakti Elevator Components Pvt. Ltd. for:\n\n*Required Component:* ${product}\n*Required Quantity:* ${lead.quantity || "N/A"}\n\nOur technical sales representative has scheduled a follow-up. Let's align here.\n\nRegards,\nSales Team\nShivshakti Elevator`;
    return `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
  };

  const getCallUrl = (phone) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    return `tel:${cleanPhone}`;
  };

  const productOptions = [
    { value: "manual-door", label: "Manual Door" },
    { value: "automatic-door", label: "Automatic Door" },
    { value: "ss-ms-cabin", label: "SS / MS Cabin" },
    { value: "car-frame", label: "Elevator Car Frame" },
    { value: "geared-gearless", label: "Geared / Gearless Machine" },
    { value: "lop-cop", label: "LOP / COP Panels" },
    { value: "t-guide-rail", label: "T-Guide Rail & Bracket" },
    { value: "usha-martin", label: "Usha Martin Wire Rope" },
    { value: "other", label: "Other / Multiple Products" },
  ];

  // Pipeline status configuration (Normalizing casing support)
  const columns = [
    { id: "New", title: "New Lead", dbStatus: ["new", "New"], color: "border-t-4 border-brand-orange bg-orange-50/15" },
    { id: "Contacted", title: "Contacted", dbStatus: ["contacted", "Contacted"], color: "border-t-4 border-brand-blue bg-blue-50/15" },
    { id: "Qualified", title: "Qualified", dbStatus: ["quotation_sent", "converted", "Qualified"], color: "border-t-4 border-teal-500 bg-teal-50/15" },
    { id: "Closed", title: "Closed / Won", dbStatus: ["closed", "Closed"], color: "border-t-4 border-emerald-600 bg-emerald-50/15" },
    { id: "Rejected", title: "Rejected", dbStatus: ["rejected", "Rejected"], color: "border-t-4 border-red-500 bg-red-50/15" },
  ];

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Leads & Inquiries</h1>
          <p className="text-slate-500 text-sm mt-1">Manage quote requests, log conversations, and track sales pipelines.</p>
        </div>
        
        <div className="flex gap-3 items-center shrink-0 w-full sm:w-auto">
          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setViewMode("pipeline")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition uppercase tracking-wider cursor-pointer ${viewMode === "pipeline" ? "bg-white text-brand-orange shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Kanban className="w-3.5 h-3.5" /> Pipeline
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition uppercase tracking-wider cursor-pointer ${viewMode === "list" ? "bg-white text-brand-orange shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-700"}`}
            >
              <List className="w-3.5 h-3.5" /> Database
            </button>
          </div>

          <a
            href="/api/inquiries/export"
            className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 uppercase tracking-wider transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500 shrink-0" /> Export CSV
          </a>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, city, company, components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
          />
        </div>

        {viewMode === "list" && (
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}

        <div className="w-full md:w-56">
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
          >
            <option value="all">All Products</option>
            {productOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CRM Board / List Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8 items-start">
        
        {viewMode === "pipeline" ? (
          /* Kanban Board View */
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full min-h-[500px]">
            {columns.map((col) => {
              const laneLeads = filteredInquiries.filter(item => 
                col.dbStatus.map(s => s.toLowerCase()).includes(item.status.toLowerCase())
              );
              
              return (
                <div
                  key={col.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`flex flex-col gap-3 p-3.5 bg-slate-100/50 rounded-2xl border border-slate-200/60 min-h-[400px] transition duration-200 ${col.color}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-[0.85rem] uppercase tracking-wider text-slate-700">{col.title}</h3>
                    <span className="bg-slate-200/70 border border-slate-350/10 text-slate-600 text-[0.7rem] px-2 py-0.5 rounded-full font-extrabold shadow-sm">
                      {laneLeads.length}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[600px] custom-scrollbar pr-0.5">
                    {laneLeads.length === 0 ? (
                      <div className="flex-1 border border-dashed border-slate-200 rounded-xl flex items-center justify-center p-6 text-center">
                        <span className="text-[0.72rem] text-slate-400 font-medium italic">Drop leads here</span>
                      </div>
                    ) : (
                      laneLeads.map((lead) => {
                        const isSelected = selectedLead && selectedLead._id === lead._id;
                        return (
                          <div
                            key={lead._id}
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, lead._id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => handleSelectLead(lead)}
                            className={`bg-white border p-3.5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-md cursor-grab active:cursor-grabbing hover:border-brand-orange/40 transition select-none flex flex-col gap-2.5 ${isSelected ? "border-brand-orange ring-1 ring-brand-orange/30 shadow-sm" : "border-slate-150"}`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-bold text-slate-900 text-xs truncate flex-1">{lead.name}</h4>
                              {lead.elevatorType && (
                                <Sparkles className="w-3.5 h-3.5 text-brand-orange shrink-0 animate-pulse" title="Smart Lead" />
                              )}
                            </div>
                            
                            <p className="text-[0.7rem] text-slate-500 font-medium flex items-center gap-1 leading-none">
                              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{lead.company || "Individual"}</span>
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-between gap-1.5 mt-0.5 border-t border-slate-100 pt-2.5">
                              <span className="text-[0.62rem] font-bold text-brand-blue bg-brand-blue-pale px-2 py-0.5 rounded-md truncate max-w-[85px]">
                                {productOptions.find(p => p.value === lead.productInterest || p.value === lead.componentNeeded)?.label || lead.productInterest || lead.componentNeeded || "Inquiry"}
                              </span>
                              <span className="text-[0.58rem] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5" /> {lead.city || "Online"}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View (Database Table) */
          <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 text-lg">Inquiry Database</h2>
              <span className="bg-slate-50 border border-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-full font-bold">
                {filteredInquiries.length} leads found
              </span>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="text-slate-400 text-sm py-16 text-center italic">
                No leads match your search inputs.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredInquiries.map((lead) => {
                  const isSelected = selectedLead && selectedLead._id === lead._id;
                  const targetCol = columns.find(col => col.dbStatus.map(s => s.toLowerCase()).includes(lead.status.toLowerCase())) || { id: "New", title: "New" };
                  return (
                    <div
                      key={lead._id}
                      onClick={() => handleSelectLead(lead)}
                      className={`p-5 flex justify-between items-center cursor-pointer transition-colors duration-200 hover:bg-slate-50/70 ${
                        isSelected ? "bg-slate-50 border-l-4 border-brand-orange pl-4" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-[0.95rem] truncate">
                            {lead.name}
                          </h4>
                          <span className="text-[0.68rem] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            {lead.city || "Online"}
                          </span>
                          {lead.elevatorType && (
                            <span className="text-[0.6rem] font-bold text-brand-orange bg-brand-orange-pale px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Smart
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                          {lead.company || "Individual Client"} • {lead.email}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[0.7rem] bg-brand-blue-pale text-brand-blue font-bold px-2.5 py-0.5 rounded">
                            {productOptions.find((p) => p.value === lead.productInterest || p.value === lead.componentNeeded)?.label || lead.productInterest || lead.componentNeeded}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span
                          className={`text-[0.68rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            targetCol.id === "New"
                              ? "bg-brand-orange/15 text-brand-orange border border-brand-orange/15"
                              : targetCol.id === "Closed"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : targetCol.id === "Rejected"
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-brand-blue-pale text-brand-blue border border-brand-blue-pale"
                          }`}
                        >
                          {targetCol.title}
                        </span>
                        <p className="text-[0.65rem] text-slate-400 mt-2">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Lead Detailed Action Drawer Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] sticky top-6">
          {selectedLead ? (
            <div className="flex flex-col gap-6">
              
              {/* Header Details */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">{selectedLead.name}</h3>
                  <p className="text-slate-500 text-xs mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Received: {new Date(selectedLead.createdAt).toLocaleString()}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteLead(selectedLead._id)}
                  className="text-slate-400 hover:text-red-600 transition flex items-center justify-center p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                  title="Delete Lead"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Success update notify */}
              {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-2.5 rounded-xl">
                  {successMsg}
                </div>
              )}

              {/* Status Manager */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.72rem] uppercase tracking-wider font-bold text-slate-400">Lead Status</label>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange transition cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Closed">Closed / Won</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* WhatsApp Quick Actions Card */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col gap-4">
                <span className="text-[0.72rem] uppercase tracking-wider font-bold text-slate-400">Quick Actions</span>
                
                {/* Meta details preview */}
                <div className="bg-white border border-slate-100 rounded-xl p-3.5 text-xs text-slate-600 leading-relaxed font-mono">
                  <strong>Name:</strong> {selectedLead.name}<br />
                  <strong>Phone:</strong> {selectedLead.phone}<br />
                  <strong>City:</strong> {selectedLead.city || "Online"}<br />
                  {selectedLead.elevatorType && (
                    <>
                      <strong>Elevator Type:</strong> {selectedLead.elevatorType}<br />
                      <strong>Quantity:</strong> {selectedLead.quantity}<br />
                    </>
                  )}
                  <strong>Component:</strong> {selectedLead.componentNeeded || selectedLead.productInterest || "N/A"}<br />
                  {selectedLead.customizationColor && (
                    <>
                      <strong>Custom Color:</strong> {selectedLead.customizationColor}<br />
                    </>
                  )}
                  {selectedLead.customizationFinish && (
                    <>
                      <strong>Custom Finish:</strong> {selectedLead.customizationFinish} Finish<br />
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={getCallUrl(selectedLead.phone)}
                    className="flex items-center justify-center gap-2 border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-slate-700 text-xs font-bold hover:bg-slate-100 text-center transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" /> Call Lead
                  </a>
                  <a
                    href={getWhatsAppUrl(selectedLead)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#20ba59] text-center transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-white shrink-0" /> WhatsApp
                  </a>
                </div>
                <button
                  onClick={() => handleCopyDetails(selectedLead)}
                  className="w-full bg-slate-200 text-slate-700 hover:bg-slate-300 py-2.5 rounded-xl text-xs font-bold tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Clipboard className="w-3.5 h-3.5 text-slate-600 shrink-0" /> Copy Details
                </button>
              </div>

              {/* Details specifications */}
              <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 text-sm">
                <div>
                  <span className="text-[0.72rem] uppercase tracking-wider font-bold text-slate-400 block mb-1">Company</span>
                  <p className="font-semibold text-slate-800">{selectedLead.company || "N/A"}</p>
                </div>
                <div>
                  <span className="text-[0.72rem] uppercase tracking-wider font-bold text-slate-400 block mb-1">Contact Email</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-brand-blue font-semibold hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
                {selectedLead.elevatorType && (
                  <>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[0.68rem] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Elevator Type</span>
                        <p className="font-bold text-xs text-slate-800 uppercase">{selectedLead.elevatorType}</p>
                      </div>
                      <div>
                        <span className="text-[0.68rem] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Quantity</span>
                        <p className="font-bold text-xs text-slate-800">{selectedLead.quantity} Units</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-[0.72rem] uppercase tracking-wider font-bold text-slate-400 block mb-1">Component Needed</span>
                      <p className="font-semibold text-slate-800 bg-brand-orange-pale text-brand-orange px-3 py-1.5 rounded-xl inline-block mt-0.5">{selectedLead.componentNeeded}</p>
                    </div>
                  </>
                )}
                {(selectedLead.customizationColor || selectedLead.customizationFinish) && (
                  <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    {selectedLead.customizationColor && (
                      <div>
                        <span className="text-[0.68rem] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Custom Color</span>
                        <p className="font-bold text-xs text-slate-800 capitalize">{selectedLead.customizationColor}</p>
                      </div>
                    )}
                    {selectedLead.customizationFinish && (
                      <div>
                        <span className="text-[0.68rem] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Custom Finish</span>
                        <p className="font-bold text-xs text-slate-800 capitalize">{selectedLead.customizationFinish} Finish</p>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <span className="text-[0.72rem] uppercase tracking-wider font-bold text-slate-400 block mb-1">User Message</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-xl italic">
                    "{selectedLead.message}"
                  </p>
                </div>
              </div>

              {/* Conversational notes timeline */}
              <div className="flex flex-col gap-3.5 border-t border-slate-100 pt-5">
                <label className="text-[0.72rem] uppercase tracking-wider font-bold text-slate-400 block">Notes History / Timeline</label>
                
                <div className="flex flex-col gap-2.5 max-h-[200px] overflow-y-auto pr-1">
                  {!selectedLead.notes || selectedLead.notes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No notes logged for this lead yet.</p>
                  ) : (
                    [...selectedLead.notes].reverse().map((note, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs leading-normal">
                        <div className="flex justify-between items-center text-[0.68rem] font-bold text-slate-400 mb-1">
                          <span className="text-brand-orange">{note.adminName || "Admin"}</span>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-700 font-medium whitespace-pre-line">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Log a call or discussion update..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange focus:bg-white transition"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveNotes();
                      }
                    }}
                  />
                  <button
                    onClick={handleSaveNotes}
                    disabled={updating || !noteInput.trim()}
                    className="bg-brand-blue text-white rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition hover:bg-brand-blue-light disabled:opacity-50 cursor-pointer"
                  >
                    {updating ? "Saving..." : "Add"}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-slate-400 text-sm py-20 text-center italic">
              Select a lead from the database list to access notes, statuses, and quick action WhatsApp widgets.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
