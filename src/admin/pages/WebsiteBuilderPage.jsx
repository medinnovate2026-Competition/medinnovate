import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, GripVertical, Plus, Save, Search, X } from "lucide-react";
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

const lockedVisibleSections = new Set(["hero", "footer"]);

const emptySection = {
  section_key: "",
  section_name: "",
  title: "",
  subtitle: "",
  visible: true,
  display_order: 0,
  background_type: "default",
  animation: "fade",
  custom_css_class: "",
};

function normalizeSection(section) {
  const sectionKey = String(section.section_key || "").trim().toLowerCase();
  return {
    ...emptySection,
    ...section,
    section_key: sectionKey,
    visible: lockedVisibleSections.has(sectionKey) ? true : Boolean(section.visible),
    display_order: Number(section.display_order || 0),
  };
}

function WebsiteBuilderPage() {
  const [sections, setSections] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [newSection, setNewSection] = useState(emptySection);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const filteredSections = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return sections;
    return sections.filter((section) =>
      `${section.section_key} ${section.section_name} ${section.title} ${section.subtitle}`.toLowerCase().includes(normalized),
    );
  }, [query, sections]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3200);
  };

  const loadSections = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/website-builder");
      setSections((data.items || []).map(normalizeSection));
    } catch (loadError) {
      const message = loadError.message || "Unable to load website sections.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

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

  const saveSection = async (section) => {
    setSavingId(section.id);
    setError("");

    try {
      await cmsFetchJson(`/api/admin/website-builder/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });
      showToast("success", `${section.section_name || section.section_key} saved.`);
      loadSections();
    } catch (saveError) {
      const message = saveError.message || "Unable to save section.";
      setError(message);
      showToast("error", message);
    } finally {
      setSavingId(null);
    }
  };

  const saveAllOrder = async (nextSections) => {
    setReordering(true);
    setError("");

    try {
      await Promise.all(
        nextSections.map((section, index) =>
          cmsFetchJson(`/api/admin/website-builder/${section.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...section, display_order: index + 1 }),
          }),
        ),
      );
      showToast("success", "Section order saved.");
      loadSections();
    } catch (orderError) {
      const message = orderError.message || "Unable to save section order.";
      setError(message);
      showToast("error", message);
      loadSections();
    } finally {
      setReordering(false);
    }
  };

  const onDrop = (targetId) => {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      return;
    }

    const fromIndex = sections.findIndex((section) => section.id === dragId);
    const toIndex = sections.findIndex((section) => section.id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
      setDragId(null);
      return;
    }

    const nextSections = [...sections];
    const [moved] = nextSections.splice(fromIndex, 1);
    nextSections.splice(toIndex, 0, moved);
    const orderedSections = nextSections.map((section, index) => ({ ...section, display_order: index + 1 }));

    setSections(orderedSections);
    setDragId(null);
    saveAllOrder(orderedSections);
  };

  const openCreateSection = () => {
    setNewSection({ ...emptySection, display_order: sections.length + 1 });
    setEditorOpen(true);
  };

  const createSection = async (event) => {
    event.preventDefault();
    setSavingId("new");
    setError("");

    try {
      await cmsFetchJson("/api/admin/website-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSection),
      });
      showToast("success", "Section created.");
      setEditorOpen(false);
      loadSections();
    } catch (createError) {
      const message = createError.message || "Unable to create section.";
      setError(message);
      showToast("error", message);
    } finally {
      setSavingId(null);
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
        title="Website Builder"
        eyebrow="Homepage Sections"
        description="Control homepage visibility, ordering, titles, subtitles, section backgrounds, animations, and custom classes."
        actions={(
          <>
            <button type="button" onClick={previewSite} className="admin-secondary-button">Preview Site</button>
            <button type="button" onClick={openCreateSection} className="admin-primary-button"><Plus size={18} />Add Section</button>
          </>
        )}
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}

      <section className="admin-card mb-6 flex flex-wrap items-center gap-3 rounded-[32px] p-4">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-field pl-12" placeholder="Search homepage sections..." />
        </div>
        {reordering && <span className="rounded-full bg-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-violet-600">Saving order...</span>}
      </section>

      {loading ? (
        <section className="admin-card rounded-[32px] p-8 text-center font-bold text-slate-400">Loading website sections...</section>
      ) : (
        <div className="grid gap-4">
          {filteredSections.map((section) => {
            const locked = lockedVisibleSections.has(section.section_key);
            return (
              <motion.article
                key={section.id}
                layout
                draggable
                onDragStart={() => setDragId(section.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onDrop(section.id)}
                className={`rounded-[28px] border bg-white/90 p-5 shadow-[0_18px_55px_rgba(124,58,237,0.08)] transition ${dragId === section.id ? "border-violet-300 opacity-60" : "border-violet-100"}`}
              >
                <div className="grid gap-5 xl:grid-cols-[220px_1fr]">
                  <div className="flex items-start gap-4">
                    <button type="button" className="mt-1 cursor-grab rounded-2xl bg-violet-50 p-3 text-violet-500" aria-label={`Drag ${section.section_name || section.section_key}`}>
                      <GripVertical size={18} />
                    </button>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-400">{section.section_key}</p>
                      <h3 className="mt-2 text-xl font-black text-[#514aa3]">{section.section_name || section.title || section.section_key}</h3>
                      <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">Order {section.display_order}</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <label className="grid gap-2 text-sm font-black text-slate-600">Section title<input value={section.title} onChange={(event) => updateSection(section.id, "title", event.target.value)} className="admin-field" /></label>
                      <label className="grid gap-2 text-sm font-black text-slate-600">Section name<input value={section.section_name} onChange={(event) => updateSection(section.id, "section_name", event.target.value)} className="admin-field" /></label>
                    </div>
                    <label className="grid gap-2 text-sm font-black text-slate-600">Subtitle<textarea value={section.subtitle} onChange={(event) => updateSection(section.id, "subtitle", event.target.value)} className="admin-field min-h-20" /></label>
                    <div className="grid gap-4 lg:grid-cols-4">
                      <label className="grid gap-2 text-sm font-black text-slate-600">Display order<input type="number" value={section.display_order} onChange={(event) => updateSection(section.id, "display_order", Number(event.target.value))} className="admin-field" /></label>
                      <label className="grid gap-2 text-sm font-black text-slate-600">Background<select value={section.background_type} onChange={(event) => updateSection(section.id, "background_type", event.target.value)} className="admin-field">{backgrounds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                      <label className="grid gap-2 text-sm font-black text-slate-600">Animation<select value={section.animation} onChange={(event) => updateSection(section.id, "animation", event.target.value)} className="admin-field">{animations.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                      <label className="grid gap-2 text-sm font-black text-slate-600">Custom CSS class<input value={section.custom_css_class} onChange={(event) => updateSection(section.id, "custom_css_class", event.target.value)} className="admin-field" /></label>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className={`inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black ${section.visible ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"} ${locked ? "opacity-70" : ""}`}>
                        <input type="checkbox" checked={section.visible} disabled={locked} onChange={(event) => updateSection(section.id, "visible", event.target.checked)} />
                        {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                        {locked ? "Always visible" : section.visible ? "Visible" : "Hidden"}
                      </label>
                      <button type="button" onClick={() => saveSection(section)} disabled={savingId === section.id} className="admin-primary-button">
                        <Save size={17} />
                        {savingId === section.id ? "Saving..." : "Save Section"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {editorOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950/30 backdrop-blur-sm">
          <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-[#fbfaff] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#514aa3]">Add custom section</h3>
              <button type="button" onClick={() => setEditorOpen(false)} className="admin-icon-button h-10 w-10" aria-label="Close editor"><X size={17} /></button>
            </div>
            <form onSubmit={createSection} className="grid gap-5">
              <label className="grid gap-2 text-sm font-black text-slate-600">Section key<input required value={newSection.section_key} onChange={(event) => setNewSection((current) => ({ ...current, section_key: event.target.value }))} className="admin-field" placeholder="custom-section" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Section name<input value={newSection.section_name} onChange={(event) => setNewSection((current) => ({ ...current, section_name: event.target.value }))} className="admin-field" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Title<input value={newSection.title} onChange={(event) => setNewSection((current) => ({ ...current, title: event.target.value }))} className="admin-field" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Subtitle<textarea value={newSection.subtitle} onChange={(event) => setNewSection((current) => ({ ...current, subtitle: event.target.value }))} className="admin-field min-h-24" /></label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-black text-slate-600">Background<select value={newSection.background_type} onChange={(event) => setNewSection((current) => ({ ...current, background_type: event.target.value }))} className="admin-field">{backgrounds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Animation<select value={newSection.animation} onChange={(event) => setNewSection((current) => ({ ...current, animation: event.target.value }))} className="admin-field">{animations.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-black text-slate-600">Display order<input type="number" value={newSection.display_order} onChange={(event) => setNewSection((current) => ({ ...current, display_order: Number(event.target.value) }))} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Custom CSS class<input value={newSection.custom_css_class} onChange={(event) => setNewSection((current) => ({ ...current, custom_css_class: event.target.value }))} className="admin-field" /></label>
              </div>
              <label className="flex items-center gap-3 text-sm font-black text-slate-600"><input type="checkbox" checked={newSection.visible} onChange={(event) => setNewSection((current) => ({ ...current, visible: event.target.checked }))} /> Visible</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditorOpen(false)} className="admin-secondary-button flex-1">Cancel</button>
                <button disabled={savingId === "new"} className="admin-primary-button flex-1 justify-center">{savingId === "new" ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}

export default WebsiteBuilderPage;
