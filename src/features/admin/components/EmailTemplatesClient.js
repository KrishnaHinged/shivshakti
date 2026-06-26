"use client";

import { useState } from "react";
import { updateEmailTemplateAction } from "../services/emailTemplatesActions";
import { Mail, Edit2, CheckCircle2, AlertCircle, RefreshCw, Copy, HelpCircle } from "lucide-react";

const TEMPLATE_DESCRIPTIONS = {
  inquiry_received: "Triggered immediately when a customer submits a quotation request form. Sent to the customer's email.",
  sales_alert: "Triggered when a new inquiry is submitted. Sent to the internal sales team list to notify them of new leads.",
  lead_assigned: "Triggered when a manager assigns or reassigns a lead. Sent to the assigned Sales Executive's email.",
  status_updated: "Triggered when a lead status is changed (e.g., from 'Contacted' to 'Qualified'). Sent to the customer.",
  follow_up_reminder: "Triggered automatically by the CRM when an assigned lead remains inactive with no updates."
};

export default function EmailTemplatesClient({ initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [activeTemplate, setActiveTemplate] = useState(initialTemplates[0] || null);

  // Form states
  const [subject, setSubject] = useState(activeTemplate?.subject || "");
  const [body, setBody] = useState(activeTemplate?.body || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSelectTemplate = (template) => {
    setActiveTemplate(template);
    setSubject(template.subject);
    setBody(template.body);
    setError("");
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("body", body);

      const res = await updateEmailTemplateAction(activeTemplate._id, formData);
      if (res.success) {
        setTemplates(templates.map(t => t._id === activeTemplate._id ? res.data : t));
        setActiveTemplate(res.data);
        setSuccess("Template saved successfully!");
      } else {
        setError(res.error || "Failed to save template.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyVariable = (variable) => {
    navigator.clipboard.writeText(`{{${variable}}}`);
    alert(`Copied {{${variable}}} to clipboard!`);
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">CRM Email Templates</h1>
        <p className="text-sm text-slate-500 mt-1">Configure automated transactional emails and customer notification template blocks.</p>
      </div>

      {templates.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
          No email templates initialized in database.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Templates List */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1">Templates</span>
            {templates.map((t) => {
              const isActive = activeTemplate?._id === t._id;
              return (
                <button
                  key={t._id}
                  onClick={() => handleSelectTemplate(t)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold transition duration-200 text-left border cursor-pointer ${
                    isActive 
                      ? "bg-orange-50/50 border-brand-orange text-brand-orange shadow-sm" 
                      : "bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Mail className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-orange" : "text-slate-400"}`} />
                    <span className="truncate capitalize">{t.name.replace("_", " ")}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Template Form Workspace */}
          {activeTemplate && (
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Trigger Info Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 capitalize">Trigger Context: {activeTemplate.name.replace("_", " ")}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {TEMPLATE_DESCRIPTIONS[activeTemplate.name] || "This template handles system email communications."}
                  </p>
                </div>
              </div>

              {/* Edit workspace */}
              <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm capitalize">Design Template: {activeTemplate.name.replace("_", " ")}</h3>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-brand-orange hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    Save Template
                  </button>
                </div>

                {/* Alerts */}
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-100 text-green-600 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {success}
                  </div>
                )}

                {/* Subject Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Subject line</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter email subject template"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-brand-orange transition duration-200"
                  />
                </div>

                {/* Dynamic Variables Selector Panel */}
                {activeTemplate.variables && activeTemplate.variables.length > 0 && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Template Variable Tokens (Click to Copy)</span>
                    <div className="flex flex-wrap gap-2">
                      {activeTemplate.variables.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => handleCopyVariable(v)}
                          className="bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-600 hover:text-slate-800 transition duration-200 flex items-center gap-1 cursor-pointer select-none"
                        >
                          <Copy className="w-3 h-3 text-slate-400" />
                          {`{{${v}}}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* HTML Body Editor Textarea */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase">HTML Body Template</label>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Supports HTML styling</span>
                  </div>
                  <textarea
                    required
                    rows="18"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-800 outline-none focus:bg-white focus:border-brand-orange transition duration-200 leading-relaxed resize-y"
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
