import { useEffect, useMemo, useState } from "react";
import { Crown, Eye, EyeOff, GripVertical, Save } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { cmsFetchJson } from "../utils/cmsApi";

const backgrounds = [
  { value: "default", label: "Default" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "gradient", label: "Gradient" },
  { value: "transparent", label: "Transparent" },
];

const animations = [
  { value: "fade", label: "Fade" },
  { value: "slide-up", label: "Slide Up" },
  { value: "zoom", label: "Zoom" },
  { value: "none", label: "None" },
];

const themeModes = ["default", "light", "dark", "gradient"];
const buttonStyles = ["rounded", "pill", "square"];
const animationIntensities = ["none", "subtle", "normal", "high"];
const lockedVisibleSections = new Set(["hero", "footer"]);

const defaultSettings = {
  site_theme: {
    mode: "default",
    primary_color: "#7C3AED",
    accent_color: "#EC4899",
    button_style: "rounded",
    animation_intensity: "normal",
  },
  maintenance_mode: false,
  maintenance_message: "MedInnovate is currently under maintenance. Please check back soon.",
  announcement_enabled: false,
  announcement_text: "Registrations Open",
  countdown_enabled: false,
  countdown_date: "",
  registration_banner_enabled: false,
  registration_banner_text: "Early Bird Open",
  popup_enabled: false,
  popup_title: "Registrations Open",
  popup_content: "Register your team and start building for public health.",
  schedule_enabled: false,
  gallery_enabled: false,
  sponsors_enabled: false,
  judges_enabled: true,
  speakers_enabled: true,
  committee_enabled: true,
  faq_enabled: true,
  community_enabled: true,
};

const featureFlags = [
  ["schedule_enabled", "Enable schedule"],
  ["gallery_enabled", "Enable gallery"],
  ["sponsors_enabled", "Enable sponsors"],
  ["judges_enabled", "Enable judges"],
  ["speakers_enabled", "Enable speakers"],
  ["community_enabled", "Enable community"],
  ["faq_enabled", "Enable FAQ"],
];

function normalizeSection(section) {
  const sectionKey = String(section.section_key || "").trim().toLowerCase();
  return {
    section_key: sectionKey,
    section_name: section.section_name || sectionKey,
    title: section.title || "",
    subtitle: section.subtitle || "",
    visible: lockedVisibleSections.has(sectionKey) ? true : Boolean(section.visible),
    display_order: Number(section.display_order || 0),
    background_type: section.background_type || "default",
    animation: section.animation || "fade",
    custom_css_class: section.custom_css_class || "",
    ...section,
  };
}

function ToggleField({ checked, disabled, label, onChange }) {
  return (
    <label className={`inline-flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-black ${checked ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"} ${disabled ? "cursor-not-allowed opacity-70" : ""}`}>
      <span>{label}</span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function MasterCmsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const orderedSections = useMemo(() => [...sections].sort((a, b) => a.display_order - b.display_order), [sections]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3200);
  };

  const loadConfig = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/master-cms");
      setSettings({ ...defaultSettings, ...(data.settings || {}) });
      setSections((data.sections || []).filter((section) => section.section_key !== "competition").map(normalizeSection));
    } catch (loadError) {
      const message = loadError.message || "Unable to load MASTER CMS.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const updateTheme = (key, value) => {
    setSettings((current) => ({
      ...current,
      site_theme: { ...(current.site_theme || defaultSettings.site_theme), [key]: value },
    }));
  };

  const updateSection = (id, key, value) => {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== id) return section;
        const next = { ...section, [key]: value };
        if (lockedVisibleSections.has(next.section_key)) next.visible = true;
        return next;
      }),
    );
  };

  const onDrop = (targetId) => {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      return;
    }

    const fromIndex = orderedSections.findIndex((section) => section.id === dragId);
    const toIndex = orderedSections.findIndex((section) => section.id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
      setDragId(null);
      return;
    }

    const nextSections = [...orderedSections];
    const [moved] = nextSections.splice(fromIndex, 1);
    nextSections.splice(toIndex, 0, moved);
    setSections(nextSections.map((section, index) => ({ ...section, display_order: index + 1 })));
    setDragId(null);
  };

  const saveConfig = async () => {
    setSaving(true);
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/master-cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, sections }),
      });
      setSettings({ ...defaultSettings, ...(data.settings || {}) });
      setSections((data.sections || []).map(normalizeSection));
      showToast("success", "MASTER CMS saved.");
    } catch (saveError) {
      const message = saveError.message || "Unable to save MASTER CMS.";
      setError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const previewSite = () => {
    window.open(import.meta.env.BASE_URL || "/", "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {toast && (
        <div className={`fixed right-5 top-5 z-[90] rounded-2xl px-5 py-3 text-sm font-black shadow-xl ${toast.type === "error" ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"}`}>
          {toast.message}
        </div>
      )}

      <PageHeader
        title="MASTER CMS"
        eyebrow="Central Control"
        description="Control homepage modules, feature flags, announcements, countdowns, popups, maintenance mode, and theme settings."
        actions={(
          <>
            <button type="button" onClick={previewSite} className="admin-secondary-button">Preview Site</button>
            <button type="button" onClick={saveConfig} disabled={saving} className="admin-primary-button"><Save size={18} />{saving ? "Saving..." : "Save Master CMS"}</button>
          </>
        )}
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}

      {loading ? (
        <section className="admin-card rounded-[32px] p-8 text-center font-bold text-slate-400">Loading MASTER CMS...</section>
      ) : (
        <div className="grid gap-6">
          <section className="admin-card rounded-[32px] p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-600"><Crown size={20} /></span>
              <div>
                <h2 className="text-xl font-black text-[#514aa3]">Homepage Modules</h2>
                <p className="text-sm font-semibold text-slate-500">Drag to reorder, toggle visibility, and set appearance.</p>
              </div>
            </div>

            <div className="grid gap-4">
              {orderedSections.map((section) => {
                const locked = lockedVisibleSections.has(section.section_key);
                return (
                  <motion.article
                    key={section.id}
                    layout
                    draggable
                    onDragStart={() => setDragId(section.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => onDrop(section.id)}
                    className={`rounded-[26px] border bg-white p-4 shadow-[0_16px_50px_rgba(124,58,237,0.07)] transition ${dragId === section.id ? "border-violet-300 opacity-60" : "border-violet-100"}`}
                  >
                    <div className="grid gap-4 xl:grid-cols-[220px_1fr]">
                      <div className="flex items-start gap-4">
                        <button type="button" className="mt-1 cursor-grab rounded-2xl bg-violet-50 p-3 text-violet-500" aria-label={`Drag ${section.section_name}`}>
                          <GripVertical size={18} />
                        </button>
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-400">{section.section_key}</p>
                          <h3 className="mt-2 text-lg font-black text-[#514aa3]">{section.section_name}</h3>
                          <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-slate-400">Order {section.display_order}</p>
                        </div>
                      </div>
                      <div className="grid gap-4">
                        <div className="grid gap-4 lg:grid-cols-3">
                          <label className="grid gap-2 text-sm font-black text-slate-600">Title<input value={section.title} onChange={(event) => updateSection(section.id, "title", event.target.value)} className="admin-field" /></label>
                          <label className="grid gap-2 text-sm font-black text-slate-600">Background<select value={section.background_type} onChange={(event) => updateSection(section.id, "background_type", event.target.value)} className="admin-field">{backgrounds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                          <label className="grid gap-2 text-sm font-black text-slate-600">Animation<select value={section.animation} onChange={(event) => updateSection(section.id, "animation", event.target.value)} className="admin-field">{animations.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-[1fr_160px]">
                          <label className="grid gap-2 text-sm font-black text-slate-600">Subtitle<input value={section.subtitle} onChange={(event) => updateSection(section.id, "subtitle", event.target.value)} className="admin-field" /></label>
                          <ToggleField checked={section.visible} disabled={locked} label={locked ? "Always visible" : section.visible ? "Visible" : "Hidden"} onChange={(checked) => updateSection(section.id, "visible", checked)} />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="admin-card rounded-[32px] p-6">
              <h2 className="text-xl font-black text-[#514aa3]">Feature Flags</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {featureFlags.map(([key, label]) => (
                  <ToggleField key={key} checked={Boolean(settings[key])} label={label} onChange={(checked) => updateSetting(key, checked)} />
                ))}
              </div>
            </div>

            <div className="admin-card rounded-[32px] p-6">
              <h2 className="text-xl font-black text-[#514aa3]">Maintenance Mode</h2>
              <div className="mt-5 grid gap-4">
                <ToggleField checked={Boolean(settings.maintenance_mode)} label="Maintenance ON/OFF" onChange={(checked) => updateSetting("maintenance_mode", checked)} />
                <label className="grid gap-2 text-sm font-black text-slate-600">Message<textarea value={settings.maintenance_message || ""} onChange={(event) => updateSetting("maintenance_message", event.target.value)} className="admin-field min-h-24" /></label>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="admin-card rounded-[32px] p-6">
              <h2 className="text-xl font-black text-[#514aa3]">Announcement Bar</h2>
              <div className="mt-5 grid gap-4">
                <ToggleField checked={Boolean(settings.announcement_enabled)} label="Announcement ON/OFF" onChange={(checked) => updateSetting("announcement_enabled", checked)} />
                <label className="grid gap-2 text-sm font-black text-slate-600">Text<input value={settings.announcement_text || ""} onChange={(event) => updateSetting("announcement_text", event.target.value)} className="admin-field" /></label>
              </div>
            </div>

            <div className="admin-card rounded-[32px] p-6">
              <h2 className="text-xl font-black text-[#514aa3]">Countdown</h2>
              <div className="mt-5 grid gap-4">
                <ToggleField checked={Boolean(settings.countdown_enabled)} label="Countdown ON/OFF" onChange={(checked) => updateSetting("countdown_enabled", checked)} />
                <label className="grid gap-2 text-sm font-black text-slate-600">Date<input type="datetime-local" value={settings.countdown_date || ""} onChange={(event) => updateSetting("countdown_date", event.target.value)} className="admin-field" /></label>
              </div>
            </div>

            <div className="admin-card rounded-[32px] p-6">
              <h2 className="text-xl font-black text-[#514aa3]">Registration Banner</h2>
              <div className="mt-5 grid gap-4">
                <ToggleField checked={Boolean(settings.registration_banner_enabled)} label="Banner ON/OFF" onChange={(checked) => updateSetting("registration_banner_enabled", checked)} />
                <label className="grid gap-2 text-sm font-black text-slate-600">Banner text<input value={settings.registration_banner_text || ""} onChange={(event) => updateSetting("registration_banner_text", event.target.value)} className="admin-field" /></label>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="admin-card rounded-[32px] p-6">
              <h2 className="text-xl font-black text-[#514aa3]">Popup Manager</h2>
              <div className="mt-5 grid gap-4">
                <ToggleField checked={Boolean(settings.popup_enabled)} label="Popup ON/OFF" onChange={(checked) => updateSetting("popup_enabled", checked)} />
                <label className="grid gap-2 text-sm font-black text-slate-600">Popup title<input value={settings.popup_title || ""} onChange={(event) => updateSetting("popup_title", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Popup body<textarea value={settings.popup_content || ""} onChange={(event) => updateSetting("popup_content", event.target.value)} className="admin-field min-h-24" /></label>
              </div>
            </div>

            <div className="admin-card rounded-[32px] p-6">
              <h2 className="text-xl font-black text-[#514aa3]">Theme Settings</h2>
              <div className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-black text-slate-600">Theme mode<select value={settings.site_theme?.mode || "default"} onChange={(event) => updateTheme("mode", event.target.value)} className="admin-field">{themeModes.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                  <label className="grid gap-2 text-sm font-black text-slate-600">Button style<select value={settings.site_theme?.button_style || "rounded"} onChange={(event) => updateTheme("button_style", event.target.value)} className="admin-field">{buttonStyles.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                  <label className="grid gap-2 text-sm font-black text-slate-600">Primary color<input type="color" value={settings.site_theme?.primary_color || "#7C3AED"} onChange={(event) => updateTheme("primary_color", event.target.value)} className="admin-field h-12 p-1" /></label>
                  <label className="grid gap-2 text-sm font-black text-slate-600">Accent color<input type="color" value={settings.site_theme?.accent_color || "#EC4899"} onChange={(event) => updateTheme("accent_color", event.target.value)} className="admin-field h-12 p-1" /></label>
                </div>
                <label className="grid gap-2 text-sm font-black text-slate-600">Animation intensity<select value={settings.site_theme?.animation_intensity || "normal"} onChange={(event) => updateTheme("animation_intensity", event.target.value)} className="admin-field">{animationIntensities.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default MasterCmsPage;
