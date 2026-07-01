"use client";

import { useState } from "react";
import {
  updateInquiryStatusAction,
  addInquiryNoteAction,
  deleteInquiryAction,
  assignInquiryAction,
} from "@/features/crm/services/actions";
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
  User,
  UserCheck,
  Clock,
  FileText,
  Search,
  Plus,
  Check,
} from "lucide-react";

import { Button, Card, Input, Select } from "@/shared/ui";

export default function InquiriesClient({ inquiries: initialInquiries, adminsList = [], currentUser = {} }) {
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

  const handleAssignLead = async (inquiryId, userId) => {
    setUpdating(true);
    setSuccessMsg("");
    const res = await assignInquiryAction(inquiryId, userId);
    setUpdating(false);
    if (res.success) {
      const updated = inquiries.map((item) =>
        item._id === inquiryId ? res.data : item
      );
      setInquiries(updated);
      if (selectedLead && selectedLead._id === inquiryId) {
        setSelectedLead(res.data);
      }
      setSuccessMsg("Lead assigned successfully!");
    } else {
      alert("Failed to assign lead: " + res.error);
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
    <div className="flex flex-col gap-8 font-sans max-w-[1600px] mx-auto">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] bg-brand-blue-pale text-brand-blue px-3 py-1 rounded-full border border-brand-blue/10 w-fit">
            Sales & Support CRM
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">Leads & Inquiries</h1>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
            Manage customer quote requests, log interactions, and track sales progress.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          {/* Slide View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-sm">
            <button
              onClick={() => setViewMode("pipeline")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                viewMode === "pipeline" 
                  ? "bg-white text-brand-orange shadow-md border-[0.5px] border-slate-200/40" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Pipeline
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                viewMode === "list" 
                  ? "bg-white text-brand-orange shadow-md border-[0.5px] border-slate-200/40" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <List className="w-3.5 h-3.5" /> Database
            </button>
          </div>

          {currentUser.role !== "SALES_EXECUTIVE" && (
            <a
              href="/api/inquiries/export"
              className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 px-4 py-2 rounded-xl text-slate-700 text-xs font-bold shadow-sm uppercase tracking-wider transition-all duration-150 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" /> Export CSV
            </a>
          )}
        </div>
      </div>

      {/* Modern Filter & Search Bar */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] p-4 flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Input wrapper */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search leads by name, email, city, company, or component..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-55/40 hover:bg-slate-50/70 focus:bg-white border border-slate-200/60 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>

        {/* Action Selects */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {viewMode === "list" && (
            <div className="relative w-full sm:w-44">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-55/40 hover:bg-slate-50/70 border border-slate-200/60 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-450">
                <ChevronRight className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>
          )}

          <div className="relative w-full sm:w-52">
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full bg-slate-55/40 hover:bg-slate-50/70 border border-slate-200/60 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Products</option>
              {productOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-455">
              <ChevronRight className="w-3.5 h-3.5 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Board & Drawer Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
        
        {viewMode === "pipeline" ? (
          /* Kanban Board View - Scrollable Horizontal Board */
          <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent min-h-[600px] -mx-2 px-2">
            <div className="flex gap-4 items-stretch min-w-max pr-2">
              {columns.map((col) => {
                const laneLeads = filteredInquiries.filter(item => 
                  col.dbStatus.map(s => s.toLowerCase()).includes(item.status.toLowerCase())
                );
                
                // Map colors
                let accentColorClass = "bg-brand-orange";
                let colBadgeColor = "bg-orange-500/10 text-brand-orange border-brand-orange/10";
                if (col.id === "Contacted") {
                  accentColorClass = "bg-brand-blue";
                  colBadgeColor = "bg-blue-500/10 text-brand-blue border-brand-blue/10";
                } else if (col.id === "Qualified") {
                  accentColorClass = "bg-violet-500";
                  colBadgeColor = "bg-violet-500/10 text-violet-600 border-violet-150/10";
                } else if (col.id === "Closed") {
                  accentColorClass = "bg-emerald-500";
                  colBadgeColor = "bg-emerald-500/10 text-emerald-600 border-emerald-150/10";
                } else if (col.id === "Rejected") {
                  accentColorClass = "bg-rose-500";
                  colBadgeColor = "bg-rose-500/10 text-rose-600 border-rose-150/10";
                }

                return (
                  <div
                    key={col.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className="flex flex-col gap-4 p-4 bg-slate-50/40 rounded-2xl border border-slate-200/50 min-h-[500px] w-[280px] md:w-[300px] shrink-0 shadow-[0_2px_12px_rgba(0,0,0,0.005)]"
                  >
                    {/* Column Header */}
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${accentColorClass}`} />
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">{col.title}</h3>
                      </div>
                      <span className={`border text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${colBadgeColor}`}>
                        {laneLeads.length}
                      </span>
                    </div>

                    {/* Column Drag Lane */}
                    <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[650px] custom-scrollbar pr-0.5 min-h-[300px]">
                      {laneLeads.length === 0 ? (
                        <div className="flex-1 border border-dashed border-slate-200/80 rounded-2xl flex items-center justify-center p-6 text-center bg-slate-50/20">
                          <span className="text-[11px] text-slate-400 font-medium italic">Drop leads here</span>
                        </div>
                      ) : (
                        laneLeads.map((lead) => {
                          const isSelected = selectedLead && selectedLead._id === lead._id;
                          
                          // Extract initials
                          const initials = lead.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase();

                          const companyNameClean = lead.company && lead.company !== ".." && lead.company !== "."
                            ? lead.company
                            : "Individual Client";

                          return (
                            <div
                              key={lead._id}
                              draggable="true"
                              onDragStart={(e) => handleDragStart(e, lead._id)}
                              onDragEnd={handleDragEnd}
                              onClick={() => handleSelectLead(lead)}
                              className={`bg-white border p-4 rounded-xl shadow-[0_3px_12px_rgba(0,0,0,0.01)] hover:shadow-md cursor-grab active:cursor-grabbing hover:border-slate-300 transition-all duration-200 flex flex-col gap-3 relative overflow-hidden select-none ${
                                isSelected 
                                  ? "border-brand-orange ring-1 ring-brand-orange/20 shadow-[0_6px_16px_rgba(248,69,2,0.05)]" 
                                  : "border-slate-200/80"
                              }`}
                            >
                              {/* Card Accent Color side indicator */}
                              <div className={`absolute left-0 top-0 bottom-0 w-[4.5px] ${accentColorClass}`} />

                              <div className="pl-1 flex flex-col gap-2">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="flex items-center gap-2 truncate flex-1">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600 shrink-0">
                                      {initials}
                                    </div>
                                    <h4 className="font-extrabold text-slate-800 text-xs truncate leading-tight">{lead.name}</h4>
                                  </div>
                                  {lead.elevatorType && (
                                    <Sparkles className="w-3.5 h-3.5 text-brand-orange shrink-0 animate-pulse" title="Smart Lead (360 Configurator)" />
                                  )}
                                </div>
                                
                                <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1.5 leading-none">
                                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="truncate">{companyNameClean}</span>
                                </p>
                                
                                {lead.assignedTo && (
                                  <p className="text-[9px] text-slate-400 font-medium leading-none flex items-center gap-1">
                                    <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>Owner: <span className="font-bold text-slate-600">{lead.assignedTo.name || lead.assignedTo.email || lead.assignedTo}</span></span>
                                  </p>
                                )}
                                
                                <div className="flex items-center justify-between gap-1.5 mt-1 border-t border-slate-100/60 pt-3">
                                  <span className="text-[9px] font-bold text-brand-blue bg-brand-blue-pale/80 px-2 py-0.5 rounded border border-brand-blue/5 truncate max-w-[130px]" title={productOptions.find(p => p.value === lead.productInterest || p.value === lead.componentNeeded)?.label || lead.productInterest || lead.componentNeeded || "Inquiry"}>
                                    {productOptions.find(p => p.value === lead.productInterest || p.value === lead.componentNeeded)?.label || lead.productInterest || lead.componentNeeded || "Inquiry"}
                                  </span>
                                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-0.5">
                                    <MapPin className="w-2.5 h-2.5" /> {lead.city || "Online"}
                                  </span>
                                </div>
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
          </div>
        ) : (
          /* List View (Database Table) */
          <div className="bg-white border border-slate-150 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
            <div className="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50/20">
              <div>
                <h2 className="font-extrabold text-slate-800 text-base uppercase tracking-wider">Inquiry Database</h2>
                <p className="text-xs text-slate-400 mt-0.5">Structured list representation of CRM client entries.</p>
              </div>
              <span className="bg-slate-100 border border-slate-200/50 text-slate-600 text-xs px-3 py-1 rounded-full font-bold shadow-inner">
                {filteredInquiries.length} leads found
              </span>
            </div>
 
            {filteredInquiries.length === 0 ? (
              <div className="text-slate-450 text-sm py-20 text-center italic">
                No leads match your search criteria.
              </div>
            ) : (
              <div className="divide-y divide-slate-150">
                {filteredInquiries.map((lead) => {
                  const isSelected = selectedLead && selectedLead._id === lead._id;
                  const targetCol = columns.find(col => col.dbStatus.map(s => s.toLowerCase()).includes(lead.status.toLowerCase())) || { id: "New", title: "New" };
                  
                  // Color codes
                  let statusStyles = "bg-orange-50 text-brand-orange border-brand-orange/20";
                  if (targetCol.id === "Contacted") statusStyles = "bg-blue-50 text-brand-blue border-brand-blue/20";
                  else if (targetCol.id === "Qualified") statusStyles = "bg-violet-50 text-violet-600 border-violet-200/20";
                  else if (targetCol.id === "Closed") statusStyles = "bg-emerald-50 text-emerald-700 border-emerald-200/20";
                  else if (targetCol.id === "Rejected") statusStyles = "bg-rose-50 text-rose-600 border-rose-200/20";

                  const initials = lead.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <div
                      key={lead._id}
                      onClick={() => handleSelectLead(lead)}
                      className={`p-5 flex justify-between items-center cursor-pointer transition-all duration-150 hover:bg-slate-50/50 border-l-4 ${
                        isSelected 
                          ? "bg-slate-50/60 border-l-brand-orange pl-5" 
                          : "border-l-transparent"
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-150 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
                            {initials}
                          </div>
                          <h4 className="font-extrabold text-slate-800 text-[0.92rem] truncate">
                            {lead.name}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            {lead.city || "Online"}
                          </span>
                          {lead.elevatorType && (
                            <span className="text-[9px] font-bold text-brand-orange bg-brand-orange-pale px-2 py-0.5 rounded flex items-center gap-0.5 border border-brand-orange/10">
                              <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Smart Config
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 truncate pl-9">
                          {lead.company || "Individual Client"} • {lead.email}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 pl-9">
                          <span className="text-[9px] bg-brand-blue-pale/80 text-brand-blue font-bold px-2 py-0.5 rounded border border-brand-blue/5">
                            {productOptions.find((p) => p.value === lead.productInterest || p.value === lead.componentNeeded)?.label || lead.productInterest || lead.componentNeeded}
                          </span>
                          {lead.assignedTo && (
                            <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200/10">
                              Owner: {lead.assignedTo.name || lead.assignedTo.email || lead.assignedTo}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${statusStyles}`}
                        >
                          {targetCol.title}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 justify-end font-semibold">
                          <Calendar className="w-3 h-3 text-slate-350" /> {new Date(lead.createdAt).toLocaleDateString()}
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
        <div className="bg-white border border-slate-150 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] sticky top-6 overflow-hidden">
          {selectedLead ? (
            <div className="flex flex-col">
              
              {/* Profile Card Header */}
              <div className="p-6 bg-slate-50/40 border-b border-slate-150 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  {/* Avatar Initials Badge */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0a1128] to-brand-orange text-white flex items-center justify-center font-extrabold text-sm shadow-md shrink-0">
                      {selectedLead.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800 leading-snug">{selectedLead.name}</h3>
                      <p className="text-slate-450 text-[10px] mt-0.5 flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>Received: {new Date(selectedLead.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  {currentUser.role === "SUPER_ADMIN" && (
                    <button
                      onClick={() => handleDeleteLead(selectedLead._id)}
                      className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition p-2 rounded-xl border border-transparent hover:border-rose-100 shrink-0 cursor-pointer"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Success Notifications */}
                {successMsg && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 font-bold animate-fadeIn">
                    <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>{successMsg}</span>
                  </div>
                )}
              </div>

              {/* CRM Modifiers Body */}
              <div className="p-6 flex flex-col gap-5 border-b border-slate-150 bg-white">
                {/* Status Manager */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Lead Status</label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={updating}
                      className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 outline-none transition appearance-none cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Closed">Closed / Won</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-450">
                      <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Lead Owner / Assignment */}
                <div className="flex flex-col gap-1.5">
                  {["SUPER_ADMIN", "SALES_MANAGER"].includes(currentUser.role) ? (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Assigned Sales Owner</label>
                      <div className="relative">
                        <select
                          value={selectedLead.assignedTo?._id || selectedLead.assignedTo || ""}
                          onChange={(e) => handleAssignLead(selectedLead._id, e.target.value)}
                          disabled={updating}
                          className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 outline-none transition appearance-none cursor-pointer"
                        >
                          <option value="">Unassigned</option>
                          {adminsList.map((adm) => (
                            <option key={adm._id} value={adm._id}>
                              {adm.name} ({adm.role.replace("_", " ")})
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-450">
                          <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Assigned Owner</label>
                      <div className="text-xs font-bold text-slate-750 bg-slate-50 border border-slate-200/60 px-4 py-2.5 rounded-xl mt-1.5">
                        {selectedLead.assignedTo?.name || "Unassigned"}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lead Details & Metadata Specs */}
              <div className="p-6 flex flex-col gap-5 border-b border-slate-150 bg-slate-50/10">
                {/* Meta details preview */}
                <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 flex flex-col gap-3 text-xs text-slate-650 leading-relaxed font-mono relative">
                  <div className="flex justify-between items-center border-b border-slate-200/40 pb-2">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Metadata Specs</span>
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
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
                </div>

                {/* Communication buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={getCallUrl(selectedLead.phone)}
                    className="flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 px-3 py-2 rounded-xl text-slate-750 text-xs font-bold shadow-sm transition-all duration-150 text-center cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" /> Call Lead
                  </a>
                  <a
                    href={getWhatsAppUrl(selectedLead)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1eab52] text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all duration-150 text-center cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-white shrink-0" /> WhatsApp
                  </a>
                </div>

                <button
                  onClick={() => handleCopyDetails(selectedLead)}
                  className="flex items-center justify-center gap-2 border border-transparent bg-slate-150 hover:bg-slate-200 active:bg-slate-250 py-2.5 rounded-xl text-slate-700 text-xs font-bold transition-all duration-150 w-full cursor-pointer shadow-sm"
                >
                  <Clipboard className="w-3.5 h-3.5 text-slate-550 shrink-0" /> Copy Lead Details
                </button>
              </div>

              {/* In depth Details */}
              <div className="p-6 flex flex-col gap-4 border-b border-slate-150 bg-white text-xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Company / Organization</span>
                  <p className="font-bold text-slate-800 text-xs">{selectedLead.company || "Individual Client / Private Inquiry"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Contact Email</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-brand-blue font-bold hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
                {selectedLead.elevatorType && (
                  <>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/50">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Elevator Type</span>
                        <p className="font-extrabold text-[11px] text-slate-800 uppercase">{selectedLead.elevatorType}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Quantity</span>
                        <p className="font-extrabold text-[11px] text-slate-800">{selectedLead.quantity} Units</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">Component Needed</span>
                      <p className="font-bold text-xs text-brand-orange bg-brand-orange-pale px-3 py-1.5 rounded-lg border border-brand-orange/10 inline-block">{selectedLead.componentNeeded}</p>
                    </div>
                  </>
                )}
                {(selectedLead.customizationColor || selectedLead.customizationFinish) && (
                  <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/50">
                    {selectedLead.customizationColor && (
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Custom Color</span>
                        <p className="font-extrabold text-[11px] text-slate-800 capitalize">{selectedLead.customizationColor}</p>
                      </div>
                    )}
                    {selectedLead.customizationFinish && (
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Custom Finish</span>
                        <p className="font-extrabold text-[11px] text-slate-800 capitalize">{selectedLead.customizationFinish} Finish</p>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">Inquiry Message</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 border border-slate-150 p-4 rounded-2xl italic font-medium">
                    &ldquo;{selectedLead.message}&rdquo;
                  </p>
                </div>
              </div>

              {/* Conversational notes timeline */}
              <div className="p-6 flex flex-col gap-4 bg-slate-50/20">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 block">Discussion Timeline Logs</label>
                
                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1 relative pl-6 mt-1">
                  {/* Vertical Line Path */}
                  <div className="absolute left-2 top-2 bottom-2 w-[1.5px] bg-slate-200/80" />

                  {!selectedLead.notes || selectedLead.notes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic pl-1 py-4">No discussions logged for this lead yet.</p>
                  ) : (
                    [...selectedLead.notes].reverse().map((note, idx) => (
                      <div key={idx} className="relative flex flex-col gap-1 text-xs">
                        {/* Timeline Bullet Dot */}
                        <div className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-brand-orange shadow-sm" />
                        
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                          <span className="text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">{note.adminName || "Admin"}</span>
                          <span className="flex items-center gap-1 font-semibold text-[9px]"><Clock className="w-3 h-3 text-slate-350" /> {new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="bg-white border border-slate-200/60 rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-slate-700 font-medium whitespace-pre-line leading-relaxed">
                          {note.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Timeline Note inputs */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200/50">
                  <input
                    type="text"
                    placeholder="Log client call update..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-200/80 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 rounded-xl py-2 px-3.5 text-xs font-medium text-slate-800 outline-none transition shadow-inner"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveNotes();
                      }
                    }}
                  />
                  <button
                    onClick={handleSaveNotes}
                    disabled={updating || !noteInput.trim()}
                    className="bg-[#0a1128] hover:bg-brand-orange text-white text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition disabled:opacity-50 disabled:hover:bg-[#0a1128] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-slate-400 text-xs py-28 text-center italic p-6 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100/50 text-slate-400">
                <Kanban className="w-5 h-5" />
              </div>
              <p className="max-w-[200px] leading-relaxed">
                Select a lead card from the board to view specifications, notes, call logs, and WhatsApp widgets.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
