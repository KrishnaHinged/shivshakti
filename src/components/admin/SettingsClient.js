"use client";

import { useState } from "react";
import { updateSettingsAction } from "@/actions/settings";
import { Info, AlertTriangle, Phone, Mail } from "lucide-react";

export default function SettingsClient({ settings }) {
  const [companyName, setCompanyName] = useState(settings.companyName || "");
  const [tagline, setTagline] = useState(settings.tagline || "");
  const [subTagline, setSubTagline] = useState(settings.subTagline || "");
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || "");
  const [gst, setGst] = useState(settings.gst || "");
  const [iec, setIec] = useState(settings.iec || "");
  const [banker, setBanker] = useState(settings.banker || "");
  const [googleMapsEmbed, setGoogleMapsEmbed] = useState(settings.googleMapsEmbed || "");
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl || "");
  const [footerDescription, setFooterDescription] = useState(settings.footerDescription || "");
  
  // Lists
  const [emails, setEmails] = useState(settings.emails ? settings.emails.join(", ") : "");
  const [phones, setPhones] = useState(settings.phones ? settings.phones.join(", ") : "");

  // Social Links
  const [facebook, setFacebook] = useState(settings.socialLinks?.facebook || "");
  const [instagram, setInstagram] = useState(settings.socialLinks?.instagram || "");
  const [whatsappLink, setWhatsappLink] = useState(settings.socialLinks?.whatsapp || "");

  // Branches list
  const [branches, setBranches] = useState(settings.addresses || []);

  // New Branch state
  const [branchName, setBranchName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [cityState, setCityState] = useState("");
  const [bPhone, setBPhone] = useState("");
  const [bEmail, setBEmail] = useState("");
  const [badge, setBadge] = useState("Branch Office");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddBranch = (e) => {
    e.preventDefault();
    if (branchName.trim() && addressLine.trim() && cityState.trim()) {
      setBranches([
        ...branches,
        {
          branchName: branchName.trim(),
          addressLine: addressLine.trim(),
          cityState: cityState.trim(),
          phone: bPhone.trim(),
          email: bEmail.trim(),
          badge: badge,
        },
      ]);
      setBranchName("");
      setAddressLine("");
      setCityState("");
      setBPhone("");
      setBEmail("");
      setBadge("Branch Office");
    } else {
      alert("Please fill in Branch Name, Address Line, and City/State.");
    }
  };

  const handleRemoveBranch = (index) => {
    setBranches(branches.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("tagline", tagline);
    formData.append("subTagline", subTagline);
    formData.append("whatsapp", whatsapp);
    formData.append("gst", gst);
    formData.append("iec", iec);
    formData.append("banker", banker);
    formData.append("googleMapsEmbed", googleMapsEmbed);
    formData.append("logoUrl", logoUrl);
    formData.append("faviconUrl", faviconUrl);
    formData.append("footerDescription", footerDescription);
    formData.append("emails", emails);
    formData.append("phones", phones);
    formData.append("facebook", facebook);
    formData.append("instagram", instagram);
    formData.append("whatsappLink", whatsappLink);
    formData.append("addresses", JSON.stringify(branches));

    const res = await updateSettingsAction(formData);
    setLoading(false);

    if (res.success) {
      setMessage("Global website configurations updated successfully!");
    } else {
      setError(res.error || "Update failed.");
    }
  };

  return (
    <div className="flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Website Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure global contact phone numbers, emails, corporate details, and office branches.</p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
          <Info className="w-4 h-4 text-green-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-650 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Company Identity */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-50 pb-3">Company Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Sub Tagline</label>
              <input
                type="text"
                value={subTagline}
                onChange={(e) => setSubTagline(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* Global Contacts & Social Links */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-50 pb-3">Global Contacts &amp; Social Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Emails (Comma-separated)</label>
                <input
                  type="text"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Phone Numbers (Comma-separated)</label>
                <input
                  type="text"
                  value={phones}
                  onChange={(e) => setPhones(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">WhatsApp Number (Call / API)</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Facebook Page URL</label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Instagram Profile URL</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">WhatsApp Chat URL Link</label>
                <input
                  type="text"
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statutory details */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-50 pb-3">Statutory Certifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">GST Registration Number</label>
              <input
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">IE Code (Import Export Code)</label>
              <input
                type="text"
                value={iec}
                onChange={(e) => setIec(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Corporate Banking Partner</label>
              <input
                type="text"
                value={banker}
                onChange={(e) => setBanker(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* Logo, Branding, maps */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-50 pb-3">Branding assets &amp; Map integrations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Logo Asset Path URL</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Favicon Icon Path URL</label>
                <input
                  type="text"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Google Maps embed SRC URL</label>
                <input
                  type="text"
                  value={googleMapsEmbed}
                  onChange={(e) => setGoogleMapsEmbed(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Footer Description Summary</label>
              <textarea
                rows="6"
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none focus:border-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* Dynamic branches addresses list */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-50 pb-2">Corporate Branches / Locations</h2>

          {/* Table display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map((branch, index) => (
              <div key={index} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between shadow-sm relative">
                <button
                  type="button"
                  onClick={() => handleRemoveBranch(index)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 font-bold font-mono text-sm cursor-pointer"
                  title="Remove Branch"
                >
                  ✕
                </button>
                <div>
                  <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    branch.badge === "Head Office" ? "bg-brand-orange-pale text-brand-orange" : "bg-brand-blue-pale text-brand-blue"
                  }`}>
                    {branch.badge}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm mt-3">{branch.branchName}</h4>
                  <p className="text-[0.8rem] text-slate-500 leading-relaxed mt-2">{branch.addressLine}, {branch.cityState}</p>
                </div>
                <div className="border-t border-slate-100 pt-3 mt-4 flex flex-col gap-1.5 text-[0.75rem] text-slate-500">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {branch.phone}</span>
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {branch.email}</span>
                </div>
              </div>
            ))}
          </div>

          {/* New branch details form builder */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase">Add Office Branch</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Branch Name (e.g. Surat HO)"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
              />
              <input
                type="text"
                placeholder="Badge (e.g. Head Office)"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
              />
              <input
                type="text"
                placeholder="City & ZIP (e.g. Indore - 452010)"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Full Phone Details"
                value={bPhone}
                onChange={(e) => setBPhone(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
              />
              <input
                type="text"
                placeholder="Email Address"
                value={bEmail}
                onChange={(e) => setBEmail(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
              />
              <input
                type="text"
                placeholder="Address Details Line"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
              />
            </div>

            <button
              onClick={handleAddBranch}
              className="bg-brand-blue text-white px-4 py-2 rounded-xl text-xs font-bold self-start cursor-pointer hover:bg-brand-blue-light"
            >
              Add Office Branch
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-orange text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-orange-light shadow shadow-brand-orange/20 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Saving Settings..." : "Save Website Settings"}
          </button>
        </div>

      </form>
    </div>
  );
}
