import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Tabs from "../components/Tabs";
import { cmsFetchJson } from "../utils/cmsApi";
import { defaultHomepageContent, normalizeHomepageContent } from "../../data/homepageContent";

const sectionNames = ["Hero", "About", "Stats", "Timeline", "Why Participate", "CTA", "Contact"];

function Field({ label, value, onChange, tall, placeholder }) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-600">
      {label}
      {tall ? (
        <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="admin-field min-h-28 rounded-[22px]" />
      ) : (
        <input value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="admin-field" />
      )}
    </label>
  );
}

function PairListEditor({ title, items, onChange, valueLabel = "Title", detailLabel = "Detail" }) {
  const update = (index, key, value) => onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  const isStatList = valueLabel === "Value";
  const add = () => onChange([...items, isStatList ? { value: "New", label: "Metric" } : { title: "New item", detail: "" }]);
  const remove = (index) => onChange(items.filter((_, itemIndex) => itemIndex !== index));

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-slate-600">{title}</p>
        <button type="button" onClick={add} className="admin-button admin-button-secondary">
          <Plus size={15} />
          Add
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="grid gap-3 rounded-[24px] bg-white/70 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Field label={valueLabel} value={item.title || item.value || ""} onChange={(value) => update(index, isStatList ? "value" : "title", value)} />
            <button type="button" onClick={() => remove(index)} className="admin-icon-button self-end" aria-label={`Remove ${title} item`}>
              <Trash2 size={17} />
            </button>
          </div>
          <Field label={detailLabel} value={item.detail || item.label || ""} onChange={(value) => update(index, isStatList ? "label" : "detail", value)} tall={!isStatList} />
        </div>
      ))}
    </div>
  );
}

function HomepagePreview({ content }) {
  return (
    <aside className="admin-card sticky top-28 rounded-[32px] p-5">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">Live Preview</p>
        <h3 className="mt-1 text-xl font-black text-[#514aa3]">Homepage</h3>
      </div>
      <div className="overflow-hidden rounded-[28px] bg-[#09051A] text-white shadow-2xl">
        <section className="relative p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.28),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.22),transparent_30%)]" />
          <div className="relative">
            <p className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-fuchsia-100">Global Participation</p>
            <h2 className="admin-heading mt-5 text-4xl font-black leading-tight text-white">{content.hero_title}</h2>
            <p className="mt-3 text-sm font-bold text-fuchsia-100">{content.hero_subtitle}</p>
            <p className="mt-3 text-sm leading-6 text-violet-100/75">{content.hero_description}</p>
          </div>
        </section>
        <section className="grid gap-2 bg-white p-4 text-[#514aa3]">
          <div className="grid grid-cols-3 gap-2">
            {content.stats_json.slice(0, 3).map((stat) => (
              <div key={`${stat.value}-${stat.label}`} className="rounded-2xl bg-violet-50 p-3">
                <p className="text-lg font-black">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-400">CTA</p>
            <p className="mt-2 text-lg font-black">{content.cta_title}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{content.cta_description}</p>
          </div>
        </section>
      </div>
    </aside>
  );
}

function HomepageCmsEditor() {
  const [activeSection, setActiveSection] = useState("Hero");
  const [content, setContent] = useState(defaultHomepageContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (key, value) => setContent((current) => ({ ...current, [key]: value }));
  const updateContact = (key, value) => setContent((current) => ({ ...current, contact_json: { ...current.contact_json, [key]: value } }));

  const loadHomepage = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await cmsFetchJson("/api/admin/homepage");
      setContent(normalizeHomepageContent(data.content));
    } catch (loadError) {
      setContent(defaultHomepageContent);
      setError(loadError.message || "Unable to load homepage content.");
    } finally {
      setLoading(false);
    }
  };

  const saveHomepage = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const data = await cmsFetchJson("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      setContent(normalizeHomepageContent(data.content));
      setMessage("Homepage content saved.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save homepage content.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadHomepage();
  }, []);

  const sectionEditor = useMemo(() => {
    if (activeSection === "Hero") {
      return (
        <div className="grid gap-4">
          <Field label="Hero title" value={content.hero_title} onChange={(value) => update("hero_title", value)} />
          <Field label="Hero subtitle" value={content.hero_subtitle} onChange={(value) => update("hero_subtitle", value)} />
          <Field label="Hero description" value={content.hero_description} onChange={(value) => update("hero_description", value)} tall />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Primary CTA label" value={content.primary_cta_label} onChange={(value) => update("primary_cta_label", value)} />
            <Field label="Primary CTA URL" value={content.primary_cta_url} onChange={(value) => update("primary_cta_url", value)} />
            <Field label="Secondary CTA label" value={content.secondary_cta_label} onChange={(value) => update("secondary_cta_label", value)} />
            <Field label="Hero media URL" value={content.hero_media_url} onChange={(value) => update("hero_media_url", value)} />
          </div>
        </div>
      );
    }

    if (activeSection === "About") {
      return <Field label="About text" value={content.about_text} onChange={(value) => update("about_text", value)} tall />;
    }

    if (activeSection === "Stats") {
      return <PairListEditor title="Stats" items={content.stats_json} onChange={(items) => update("stats_json", items)} valueLabel="Value" detailLabel="Label" />;
    }

    if (activeSection === "Timeline") {
      return <PairListEditor title="Timeline steps" items={content.timeline_json} onChange={(items) => update("timeline_json", items)} />;
    }

    if (activeSection === "Why Participate") {
      return <PairListEditor title="Why participate / requirements" items={content.why_participate_json} onChange={(items) => update("why_participate_json", items)} />;
    }

    if (activeSection === "CTA") {
      return (
        <div className="grid gap-4">
          <Field label="CTA title" value={content.cta_title} onChange={(value) => update("cta_title", value)} />
          <Field label="CTA description" value={content.cta_description} onChange={(value) => update("cta_description", value)} tall />
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        <Field label="Contact email" value={content.contact_json.email} onChange={(value) => updateContact("email", value)} />
        <Field label="Instagram URL" value={content.contact_json.instagram} onChange={(value) => updateContact("instagram", value)} />
        <Field label="WhatsApp label" value={content.contact_json.whatsapp_label} onChange={(value) => updateContact("whatsapp_label", value)} />
      </div>
    );
  }, [activeSection, content]);

  return (
    <>
      <PageHeader
        eyebrow="Homepage"
        title="Homepage CMS"
        description="Edit the public homepage content stored in Railway/MySQL."
        actions={(
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={loadHomepage} className="admin-button admin-button-secondary" disabled={loading}>
              <RefreshCw size={17} />
              Refresh
            </button>
            <button type="button" onClick={saveHomepage} className="admin-button" disabled={saving || loading}>
              <Save size={17} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      />

      {message && <div className="mb-6 rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">{message}</div>}
      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="admin-card rounded-[32px] p-6">
          {loading ? (
            <div className="rounded-[28px] bg-violet-50 px-5 py-12 text-center text-sm font-bold text-slate-500">Loading homepage content...</div>
          ) : (
            <>
              <Tabs tabs={sectionNames} active={activeSection} onChange={setActiveSection} />
              <div className="mt-6">{sectionEditor}</div>
            </>
          )}
        </motion.section>
        <HomepagePreview content={content} />
      </div>
    </>
  );
}

export default HomepageCmsEditor;
