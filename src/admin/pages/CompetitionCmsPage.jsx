import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { cmsFetchJson } from "../utils/cmsApi";

const categories = [
  { value: "research", label: "Research Papers" },
  { value: "poster", label: "Poster Presentation" },
  { value: "innovation", label: "Innovation Pitch" },
  { value: "case", label: "Case Presentation" },
  { value: "oral", label: "Oral Presentation" },
  { value: "other", label: "Other" },
];

const emptyTrack = {
  title: "",
  slug: "",
  short_description: "",
  full_description: "",
  category: "research",
  eligibility: "",
  rules: "",
  judging_criteria: "",
  prizes: "",
  submission_deadline: "",
  max_participants: "",
  registration_fee: "",
  display_order: 0,
  featured: false,
  active: true,
};

function getCategoryLabel(category) {
  return categories.find((item) => item.value === category)?.label || "Research Papers";
}

function toInputDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function CompetitionCmsPage() {
  const [tracks, setTracks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const filteredTracks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tracks;
    return tracks.filter((track) =>
      `${track.title} ${track.category} ${track.short_description} ${track.eligibility} ${track.prizes}`.toLowerCase().includes(normalized),
    );
  }, [tracks, query]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3200);
  };

  const loadTracks = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/competition");
      setTracks(data.items || []);
    } catch (loadError) {
      const message = loadError.message || "Unable to load competition tracks.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracks();
  }, []);

  const startCreate = () => {
    setSelected({ ...emptyTrack, display_order: tracks.length + 1 });
    setEditorOpen(true);
  };

  const startEdit = (track) => {
    setSelected({ ...emptyTrack, ...track, submission_deadline: toInputDateTime(track.submission_deadline) });
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setSelected(null);
    setEditorOpen(false);
  };

  const update = (key, value) => setSelected((current) => ({ ...current, [key]: value }));

  const saveTrack = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await cmsFetchJson(`/api/admin/competition${selected.id ? `/${selected.id}` : ""}`, {
        method: selected.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });
      showToast("success", selected.id ? "Track updated." : "Track created.");
      closeEditor();
      loadTracks();
    } catch (saveError) {
      const message = saveError.message || "Unable to save competition track.";
      setError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const deleteTrack = async (id) => {
    if (!window.confirm("Delete this competition track?")) return;
    setError("");

    try {
      await cmsFetchJson(`/api/admin/competition/${id}`, { method: "DELETE" });
      showToast("success", "Track deleted.");
      closeEditor();
      loadTracks();
    } catch (deleteError) {
      const message = deleteError.message || "Unable to delete competition track.";
      setError(message);
      showToast("error", message);
    }
  };

  const toggleActive = async (track) => {
    try {
      await cmsFetchJson(`/api/admin/competition/${track.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...track, active: !track.active }),
      });
      showToast("success", !track.active ? "Track shown." : "Track hidden.");
      loadTracks();
    } catch (toggleError) {
      const message = toggleError.message || "Unable to update visibility.";
      setError(message);
      showToast("error", message);
    }
  };

  return (
    <>
      {toast && (
        <div className={`fixed right-5 top-5 z-[90] rounded-2xl px-5 py-3 text-sm font-black shadow-xl ${toast.type === "error" ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"}`}>
          {toast.message}
        </div>
      )}

      <PageHeader
        title="Competition CMS"
        eyebrow="Competition"
        description="Manage presentation categories, tracks, rules, eligibility, deadlines, prizes, and visibility."
        actions={<button type="button" onClick={startCreate} className="admin-primary-button"><Plus size={18} />Create Track</button>}
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}

      <section className="admin-card mb-6 flex flex-wrap items-center gap-3 rounded-[32px] p-4">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-field pl-12" placeholder="Search competition tracks..." />
        </div>
      </section>

      {loading ? (
        <section className="admin-card rounded-[32px] p-8 text-center font-bold text-slate-400">Loading competition tracks...</section>
      ) : tracks.length === 0 ? (
        <section className="admin-card grid place-items-center rounded-[32px] p-10 text-center">
          <p className="text-lg font-black text-[#514aa3]">No competition tracks created</p>
          <button type="button" onClick={startCreate} className="admin-primary-button mt-5"><Plus size={18} />Create Track</button>
        </section>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredTracks.map((track) => (
            <article key={track.id} className="rounded-[28px] border border-violet-100 bg-white/90 p-5 shadow-[0_18px_55px_rgba(124,58,237,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-black text-[#514aa3]">{track.title}</h3>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-violet-400">{getCategoryLabel(track.category)}</p>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold text-slate-500">{track.short_description || "No short description set."}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {track.featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-600"><Star size={13} fill="currentColor" />Featured</span>}
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${track.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>{track.active ? "Active" : "Hidden"}</span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                <span>Order {track.display_order}</span>
                <span>{track.submission_deadline ? new Date(track.submission_deadline).toLocaleString() : "No deadline"}</span>
              </div>
              <div className="mt-5 flex gap-2">
                <button type="button" onClick={() => startEdit(track)} className="admin-icon-button h-9 w-9" aria-label={`Edit ${track.title}`}><Pencil size={15} /></button>
                <button type="button" onClick={() => toggleActive(track)} className="admin-icon-button h-9 w-9" aria-label={`${track.active ? "Hide" : "Show"} ${track.title}`}>{track.active ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                <button type="button" onClick={() => deleteTrack(track.id)} className="admin-icon-button h-9 w-9 text-rose-500" aria-label={`Delete ${track.title}`}><Trash2 size={15} /></button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editorOpen && selected && (
        <div className="fixed inset-0 z-[70] bg-slate-950/30 backdrop-blur-sm">
          <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-[#fbfaff] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#514aa3]">{selected.id ? "Track editor" : "Create track"}</h3>
              <button type="button" onClick={closeEditor} className="admin-icon-button h-10 w-10" aria-label="Close editor"><X size={17} /></button>
            </div>
            <form onSubmit={saveTrack} className="grid gap-5">
              <label className="grid gap-2 text-sm font-black text-slate-600">Track title<input required value={selected.title} onChange={(event) => update("title", event.target.value)} className="admin-field" /></label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-black text-slate-600">Slug<input value={selected.slug} onChange={(event) => update("slug", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Category<select value={selected.category} onChange={(event) => update("category", event.target.value)} className="admin-field">{categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}</select></label>
              </div>
              <label className="grid gap-2 text-sm font-black text-slate-600">Short description<textarea value={selected.short_description} onChange={(event) => update("short_description", event.target.value)} className="admin-field min-h-20" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Detailed description<textarea value={selected.full_description} onChange={(event) => update("full_description", event.target.value)} className="admin-field min-h-28" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Eligibility<textarea value={selected.eligibility} onChange={(event) => update("eligibility", event.target.value)} className="admin-field min-h-24" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Rules<textarea value={selected.rules} onChange={(event) => update("rules", event.target.value)} className="admin-field min-h-28" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Judging criteria<textarea value={selected.judging_criteria} onChange={(event) => update("judging_criteria", event.target.value)} className="admin-field min-h-24" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Prize details<textarea value={selected.prizes} onChange={(event) => update("prizes", event.target.value)} className="admin-field min-h-24" /></label>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-black text-slate-600">Submission deadline<input type="datetime-local" value={selected.submission_deadline || ""} onChange={(event) => update("submission_deadline", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Max participants<input type="number" value={selected.max_participants ?? ""} onChange={(event) => update("max_participants", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Registration fee<input type="number" step="0.01" value={selected.registration_fee ?? ""} onChange={(event) => update("registration_fee", event.target.value)} className="admin-field" /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex items-center gap-3 text-sm font-black text-slate-600"><input type="checkbox" checked={selected.featured} onChange={(event) => update("featured", event.target.checked)} /> Featured</label>
                <label className="flex items-center gap-3 text-sm font-black text-slate-600"><input type="checkbox" checked={selected.active} onChange={(event) => update("active", event.target.checked)} /> Active</label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Display order<input type="number" value={selected.display_order} onChange={(event) => update("display_order", Number(event.target.value))} className="admin-field" /></label>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={closeEditor} className="admin-secondary-button flex-1">Cancel</button>
                <button disabled={saving} className="admin-primary-button flex-1 justify-center">{saving ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}

export default CompetitionCmsPage;
