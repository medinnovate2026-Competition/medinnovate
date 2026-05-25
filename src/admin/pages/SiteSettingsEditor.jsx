import { useEffect, useState } from "react";
import { ImagePlus, RefreshCw, Save } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Tabs from "../components/Tabs";
import { API_BASE_URL } from "../../config";
import { cmsFetchJson, readLocalCms, writeLocalCms } from "../utils/cmsApi";

const settingTabs = ["Brand", "SEO", "Footer", "Contact", "Socials", "Theme", "Announcement"];

const initialSettings = {
  website_name: "MedInnovate",
  tagline: "International Healthcare Innovation Hackathon",
  logo_url: "",
  favicon_url: "",
  seo_title: "MedInnovate",
  seo_description: "International healthcare innovation hackathon for students and healthcare builders.",
  footer_text: "A global platform bringing together future healthcare leaders and innovators to solve real-world challenges.",
  contact_email: "medinnovate2026@gmail.com",
  instagram_url: "",
  linkedin_url: "",
  theme_colors: {
    primary: "#7C3AED",
    accent: "#EC4899",
    background: "#F7F3FF",
  },
  announcement: "Registration is open for MedInnovate 2026.",
};

const FALLBACK_KEY = "medinnovate_site_settings_fallback";

function parseJsonField(value, fallback) {
  if (!value) return fallback;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeSettings(settings = {}) {
  return {
    ...initialSettings,
    ...settings,
    theme_colors: parseJsonField(settings.theme_colors, initialSettings.theme_colors),
  };
}

function readFallbackSettings() {
  return normalizeSettings(readLocalCms(FALLBACK_KEY, initialSettings));
}

function writeFallbackSettings(settings) {
  writeLocalCms(FALLBACK_KEY, settings);
}

function Field({ label, value, onChange, tall, type = "text" }) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-600">
      {label}
      {tall ? (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className="admin-field min-h-28 rounded-[22px]"
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className="admin-field"
        />
      )}
    </label>
  );
}

function UploadUrlField({ label, value, onChange }) {
  return (
    <div className="rounded-[28px] border border-dashed border-violet-200 bg-violet-50/70 p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm">
          <ImagePlus size={22} />
        </span>
        <div>
          <p className="text-sm font-black text-[#514aa3]">{label}</p>
          <p className="text-xs font-semibold text-slate-400">Paste a production media URL.</p>
        </div>
      </div>
      <Field label={`${label} URL`} value={value} onChange={onChange} />
    </div>
  );
}

function SiteSettingsPreview({ settings }) {
  const colors = settings.theme_colors || initialSettings.theme_colors;

  return (
    <aside className="admin-card sticky top-28 rounded-[32px] p-5">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">Live Preview</p>
        <h3 className="mt-1 text-xl font-black text-[#514aa3]">Site shell</h3>
      </div>
      <div className="overflow-hidden rounded-[28px] border border-violet-100 bg-white shadow-sm">
        {settings.announcement && (
          <div className="px-4 py-2 text-center text-xs font-black text-white" style={{ background: colors.primary }}>
            {settings.announcement}
          </div>
        )}
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <p className="truncate text-lg font-black text-[#514aa3]">{settings.website_name || "MedInnovate"}</p>
            <p className="truncate text-xs font-semibold text-slate-400">{settings.tagline}</p>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-violet-50">
            {settings.logo_url ? <img src={settings.logo_url} alt="" className="h-full w-full object-cover" /> : <span style={{ color: colors.primary }} className="font-black">M</span>}
          </div>
        </div>
        <div className="p-5" style={{ background: `linear-gradient(135deg, ${colors.background}, #ffffff)` }}>
          <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: colors.accent }}>SEO</p>
          <h4 className="mt-2 text-2xl font-black text-slate-900">{settings.seo_title || "MedInnovate"}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-500">{settings.seo_description}</p>
        </div>
        <div className="grid gap-2 bg-[#f8f5ff] p-4 text-sm text-slate-500">
          <p className="font-black text-[#514aa3]">Footer</p>
          <p>{settings.footer_text}</p>
          <p>{settings.contact_email}</p>
          <p>{settings.instagram_url || "Instagram"} · {settings.linkedin_url || "LinkedIn"}</p>
        </div>
      </div>
    </aside>
  );
}

function SiteSettingsEditor() {
  const [activeTab, setActiveTab] = useState("Brand");
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));
  const updateTheme = (key, value) => {
    setSettings((current) => ({
      ...current,
      theme_colors: { ...(current.theme_colors || {}), [key]: value },
    }));
  };

  const loadSettings = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/site-settings");
      setSettings(normalizeSettings(data.settings));
      setUsingFallback(false);
    } catch (loadError) {
      const fallback = readFallbackSettings();
      setSettings(fallback);
      setUsingFallback(true);
      setMessage("Using local Site Settings draft because the production API route is not available yet.");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    if (usingFallback) {
      writeFallbackSettings(settings);
      setMessage("Saved locally. Deploy the latest backend to make Site Settings save to Railway.");
      setSaving(false);
      return;
    }

    try {
      const data = await cmsFetchJson("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      setSettings(normalizeSettings(data.settings));
      setMessage("Site settings saved.");
    } catch (saveError) {
      writeFallbackSettings(settings);
      setUsingFallback(true);
      setMessage("Saved locally. The production API route is not available yet.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const colors = settings.theme_colors || initialSettings.theme_colors;

  return (
    <>
      <PageHeader
        eyebrow="Site Settings"
        title="Site settings"
        description="Control global MedInnovate branding, SEO, footer, contact details, social links, theme colors, and announcements."
        actions={
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={loadSettings} className="admin-button admin-button-secondary" disabled={loading}>
              <RefreshCw size={17} />
              Refresh
            </button>
            <button type="button" onClick={saveSettings} className="rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white shadow-xl shadow-violet-200" disabled={saving}>
              <Save className="mr-2 inline" size={17} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        }
      />

      {message && <div className="mb-6 rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">{message}</div>}
      {usingFallback && <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">Production backend route missing: {API_BASE_URL}/api/admin/site-settings. This editor is temporarily using a local browser draft.</div>}
      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="admin-card rounded-[32px] p-6">
          {loading ? (
            <div className="rounded-[28px] bg-violet-50 px-5 py-12 text-center text-sm font-bold text-slate-500">Loading site settings...</div>
          ) : (
            <>
              <Tabs tabs={settingTabs} active={activeTab} onChange={setActiveTab} />
              <div className="mt-6 grid gap-4">
                {activeTab === "Brand" && (
                  <>
                    <Field label="Website name" value={settings.website_name} onChange={(value) => update("website_name", value)} />
                    <Field label="Tagline" value={settings.tagline} onChange={(value) => update("tagline", value)} />
                    <UploadUrlField label="Logo" value={settings.logo_url} onChange={(value) => update("logo_url", value)} />
                    <UploadUrlField label="Favicon" value={settings.favicon_url} onChange={(value) => update("favicon_url", value)} />
                  </>
                )}
                {activeTab === "SEO" && (
                  <>
                    <Field label="SEO title" value={settings.seo_title} onChange={(value) => update("seo_title", value)} />
                    <Field label="SEO description" value={settings.seo_description} tall onChange={(value) => update("seo_description", value)} />
                  </>
                )}
                {activeTab === "Footer" && (
                  <Field label="Footer text" value={settings.footer_text} tall onChange={(value) => update("footer_text", value)} />
                )}
                {activeTab === "Contact" && (
                  <Field label="Contact email" value={settings.contact_email} onChange={(value) => update("contact_email", value)} />
                )}
                {activeTab === "Socials" && (
                  <>
                    <Field label="Instagram URL" value={settings.instagram_url} onChange={(value) => update("instagram_url", value)} />
                    <Field label="LinkedIn URL" value={settings.linkedin_url} onChange={(value) => update("linkedin_url", value)} />
                  </>
                )}
                {activeTab === "Theme" && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Primary color" type="color" value={colors.primary} onChange={(value) => updateTheme("primary", value)} />
                    <Field label="Accent color" type="color" value={colors.accent} onChange={(value) => updateTheme("accent", value)} />
                    <Field label="Background color" type="color" value={colors.background} onChange={(value) => updateTheme("background", value)} />
                  </div>
                )}
                {activeTab === "Announcement" && (
                  <Field label="Announcement bar" value={settings.announcement} tall onChange={(value) => update("announcement", value)} />
                )}
              </div>
            </>
          )}
        </section>
        <SiteSettingsPreview settings={settings} />
      </div>
    </>
  );
}

export default SiteSettingsEditor;
