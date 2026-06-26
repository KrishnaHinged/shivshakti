"use client";

import { useState } from "react";
import { updateSettingsAction } from "@/features/admin/services/settingsActions";
import { Info, AlertTriangle, Phone, Mail } from "lucide-react";
import { Button, Card, Input, Textarea } from "@/shared/ui";

export default function SettingsClient({ settings }) {
  const [companyName, setCompanyName] = useState(settings.companyName || "");
  const [tagline, setTagline] = useState(settings.tagline || "");
  const [subTagline, setSubTagline] = useState(settings.subTagline || "");
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || "");
  const [gst, setGst] = useState(settings.gst || "");
  const [iec, setIec] = useState(settings.iec || "");
  const [banker, setBanker] = useState(settings.banker || "");
  const [googleMapsEmbed, setGoogleMapsEmbed] = useState(settings.googleMapsEmbed || "");

  const handleMapUrlChange = (val) => {
    let cleanUrl = val.trim();
    if (cleanUrl.startsWith("<iframe") && cleanUrl.includes("src=")) {
      const match = cleanUrl.match(/src=["']([^"']+)["']/);
      if (match && match[1]) {
        cleanUrl = match[1];
      }
    }
    setGoogleMapsEmbed(cleanUrl);
  };
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
        <Card className="border-slate-100">
          <Card.Body className="flex flex-col gap-5">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-50 pb-3">Company Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                inputClassName="bg-slate-50 text-sm"
              />
              
              <Input
                label="Tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                inputClassName="bg-slate-50 text-sm"
              />

              <Input
                label="Sub Tagline"
                value={subTagline}
                onChange={(e) => setSubTagline(e.target.value)}
                inputClassName="bg-slate-50 text-sm"
              />
            </div>
          </Card.Body>
        </Card>

        {/* Global Contacts & Social Links */}
        <Card className="border-slate-100">
          <Card.Body className="flex flex-col gap-5">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-50 pb-3">Global Contacts &amp; Social Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <Input
                  label="Emails (Comma-separated)"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  inputClassName="bg-slate-50 text-sm"
                />

                <Input
                  label="Phone Numbers (Comma-separated)"
                  value={phones}
                  onChange={(e) => setPhones(e.target.value)}
                  inputClassName="bg-slate-50 text-sm"
                />

                <Input
                  label="WhatsApp Number (Call / API)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  inputClassName="bg-slate-50 text-sm"
                />
              </div>

              <div className="flex flex-col gap-4">
                <Input
                  label="Facebook Page URL"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  inputClassName="bg-slate-50 text-sm"
                />

                <Input
                  label="Instagram Profile URL"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  inputClassName="bg-slate-50 text-sm"
                />

                <Input
                  label="WhatsApp Chat URL Link"
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  inputClassName="bg-slate-50 text-sm"
                />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Statutory details */}
        <Card className="border-slate-100">
          <Card.Body className="flex flex-col gap-5">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-50 pb-3">Statutory Certifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="GST Registration Number"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                inputClassName="bg-slate-50 text-sm"
              />

              <Input
                label="IE Code (Import Export Code)"
                value={iec}
                onChange={(e) => setIec(e.target.value)}
                inputClassName="bg-slate-50 text-sm"
              />

              <Input
                label="Corporate Banking Partner"
                value={banker}
                onChange={(e) => setBanker(e.target.value)}
                inputClassName="bg-slate-50 text-sm"
              />
            </div>
          </Card.Body>
        </Card>

        {/* Logo, Branding, maps */}
        <Card className="border-slate-100">
          <Card.Body className="flex flex-col gap-5">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-50 pb-3">Branding assets &amp; Map integrations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <Input
                  label="Logo Asset Path URL"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  inputClassName="bg-slate-50 text-sm"
                />

                <Input
                  label="Favicon Icon Path URL"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  inputClassName="bg-slate-50 text-sm"
                />

                <Input
                  label="Google Maps embed SRC URL"
                  value={googleMapsEmbed}
                  onChange={(e) => handleMapUrlChange(e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=... or paste iframe code"
                  inputClassName="bg-slate-50 text-sm"
                />
              </div>

              <Textarea
                label="Footer Description Summary"
                rows={6}
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
                inputClassName="bg-slate-50 text-sm"
              />
            </div>
          </Card.Body>
        </Card>

        {/* Dynamic branches addresses list */}
        <Card className="border-slate-100">
          <Card.Body className="flex flex-col gap-6">
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
                <Input
                  placeholder="Branch Name (e.g. Surat HO)"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  inputClassName="bg-white rounded-lg px-3 py-2 text-xs"
                />
                <Input
                  placeholder="Badge (e.g. Head Office)"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  inputClassName="bg-white rounded-lg px-3 py-2 text-xs"
                />
                <Input
                  placeholder="City & ZIP (e.g. Indore - 452010)"
                  value={cityState}
                  onChange={(e) => setCityState(e.target.value)}
                  inputClassName="bg-white rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  placeholder="Full Phone Details"
                  value={bPhone}
                  onChange={(e) => setBPhone(e.target.value)}
                  inputClassName="bg-white rounded-lg px-3 py-2 text-xs"
                />
                <Input
                  placeholder="Email Address"
                  value={bEmail}
                  onChange={(e) => setBEmail(e.target.value)}
                  inputClassName="bg-white rounded-lg px-3 py-2 text-xs"
                />
                <Input
                  placeholder="Address Details Line"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  inputClassName="bg-white rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddBranch}
                className="self-start"
              >
                Add Office Branch
              </Button>
            </div>
          </Card.Body>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            className="px-8 py-3.5 shadow shadow-brand-orange/20"
          >
            Save Website Settings
          </Button>
        </div>

      </form>
    </div>
  );
}
