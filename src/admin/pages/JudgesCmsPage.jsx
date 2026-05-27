import { useEffect, useMemo, useState } from "react";
import { Globe, ImagePlus, Link, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { cmsFetchJson } from "../utils/cmsApi";
import { resolveAssetUrl } from "../../config";

const judgeTypes = [
  { value: "faculty", label: "Faculty" },
  { value: "industry", label: "Industry" },
  { value: "research", label: "Research" },
  { value: "sponsor", label: "Sponsor" },
  { value: "external", label: "External" },
];

const emptyJudge = {
  name: "",
  designation: "",
  institution: "",
  speciality: "",
  bio: "",
  expertise: "",
  photo_url: "",
  linkedin_url: "",
  website_url: "",
  judge_type: "faculty",
  featured: false,
  priority: 0,
};

function getInitials(name) {
  return String(name || "Judge")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getJudgeTypeLabel(type) {
  return judgeTypes.find((item) => item.value === type)?.label || "Faculty";
}

function JudgesCmsPage() {
  const [judges, setJudges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const filteredJudges = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return judges;
    return judges.filter((judge) =>
      `${judge.name} ${judge.designation} ${judge.institution} ${judge.speciality} ${judge.expertise} ${judge.judge_type}`.toLowerCase().includes(normalized),
    );
  }, [judges, query]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3200);
  };

  const loadJudges = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/judges");
      setJudges(data.items || []);
    } catch (loadError) {
      const message = loadError.message || "Unable to load judges.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJudges();
  }, []);

  const startCreate = () => {
    setSelected({ ...emptyJudge, priority: judges.length + 1 });
    setEditorOpen(true);
  };

  const startEdit = (judge) => {
    setSelected({ ...emptyJudge, ...judge });
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setSelected(null);
    setEditorOpen(false);
  };

  const update = (key, value) => setSelected((current) => ({ ...current, [key]: value }));

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(true);
      setError("");

      try {
        const data = await cmsFetchJson("/api/admin/media/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileDataUrl: reader.result,
            originalName: file.name,
            folder: "judges",
            alt_text: selected?.name ? `${selected.name} photo` : "Judge photo",
          }),
        });
        update("photo_url", data.url || data.item?.url || "");
        showToast("success", "Photo uploaded.");
      } catch (uploadError) {
        const message = uploadError.message || "Unable to upload photo.";
        setError(message);
        showToast("error", message);
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const saveJudge = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await cmsFetchJson(`/api/admin/judges${selected.id ? `/${selected.id}` : ""}`, {
        method: selected.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });
      showToast("success", selected.id ? "Judge updated." : "Judge added.");
      closeEditor();
      loadJudges();
    } catch (saveError) {
      const message = saveError.message || "Unable to save judge.";
      setError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const deleteJudge = async (id) => {
    if (!window.confirm("Delete this judge?")) return;
    setError("");

    try {
      await cmsFetchJson(`/api/admin/judges/${id}`, { method: "DELETE" });
      showToast("success", "Judge deleted.");
      closeEditor();
      loadJudges();
    } catch (deleteError) {
      const message = deleteError.message || "Unable to delete judge.";
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
        title="Judges CMS"
        eyebrow="Judges"
        description="Manage judges, reviewers, evaluators, panel members, expertise, photos, and display order."
        actions={<button type="button" onClick={startCreate} className="admin-primary-button"><Plus size={18} />Add Judge</button>}
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}

      <section className="admin-card mb-6 flex flex-wrap items-center gap-3 rounded-[32px] p-4">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-field pl-12" placeholder="Search judges..." />
        </div>
      </section>

      {loading ? (
        <section className="admin-card rounded-[32px] p-8 text-center font-bold text-slate-400">Loading judges...</section>
      ) : judges.length === 0 ? (
        <section className="admin-card grid place-items-center rounded-[32px] p-10 text-center">
          <p className="text-lg font-black text-[#514aa3]">No judges added</p>
          <button type="button" onClick={startCreate} className="admin-primary-button mt-5"><Plus size={18} />Add Judge</button>
        </section>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredJudges.map((judge) => (
            <article key={judge.id} className="rounded-[28px] border border-violet-100 bg-white/90 p-5 shadow-[0_18px_55px_rgba(124,58,237,0.08)]">
              <div className="flex gap-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-lg font-black text-[#7C3AED]">
                  {judge.photo_url ? <img src={resolveAssetUrl(judge.photo_url)} alt="" className="h-full w-full object-cover" /> : getInitials(judge.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black text-[#514aa3]">{judge.name}</h3>
                      <p className="mt-1 text-sm font-bold text-slate-500">{judge.institution || "Institution not set"}</p>
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-violet-400">{getJudgeTypeLabel(judge.judge_type)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {judge.featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-600"><Star size={13} fill="currentColor" />Featured</span>}
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-500">Priority {judge.priority}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-600">{judge.speciality || judge.designation || "Speciality not set"}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex gap-2 text-violet-500">
                      {judge.linkedin_url && <Link size={16} />}
                      {judge.website_url && <Globe size={16} />}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(judge)} className="admin-icon-button h-9 w-9" aria-label={`Edit ${judge.name}`}><Pencil size={15} /></button>
                      <button type="button" onClick={() => deleteJudge(judge.id)} className="admin-icon-button h-9 w-9 text-rose-500" aria-label={`Delete ${judge.name}`}><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editorOpen && selected && (
        <div className="fixed inset-0 z-[70] bg-slate-950/30 backdrop-blur-sm">
          <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-[#fbfaff] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#514aa3]">{selected.id ? "Judge editor" : "Create judge"}</h3>
              <button type="button" onClick={closeEditor} className="admin-icon-button h-10 w-10" aria-label="Close editor"><X size={17} /></button>
            </div>
            <form onSubmit={saveJudge} className="grid gap-6">
              <section className="grid gap-4">
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-violet-400">Basic</h4>
                <label className="grid gap-2 text-sm font-black text-slate-600">Name<input required value={selected.name} onChange={(event) => update("name", event.target.value)} className="admin-field" /></label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-black text-slate-600">Designation<input value={selected.designation} onChange={(event) => update("designation", event.target.value)} className="admin-field" /></label>
                  <label className="grid gap-2 text-sm font-black text-slate-600">Institution<input value={selected.institution} onChange={(event) => update("institution", event.target.value)} className="admin-field" /></label>
                </div>
                <label className="grid gap-2 text-sm font-black text-slate-600">Speciality<input value={selected.speciality} onChange={(event) => update("speciality", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Bio<textarea value={selected.bio} onChange={(event) => update("bio", event.target.value)} className="admin-field min-h-28" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Expertise<textarea value={selected.expertise} onChange={(event) => update("expertise", event.target.value)} className="admin-field min-h-24" placeholder="AI, clinical research, public health" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Type<select value={selected.judge_type} onChange={(event) => update("judge_type", event.target.value)} className="admin-field">{judgeTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
              </section>

              <section className="grid gap-4">
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-violet-400">Social</h4>
                <label className="grid gap-2 text-sm font-black text-slate-600">LinkedIn<input value={selected.linkedin_url} onChange={(event) => update("linkedin_url", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Website<input value={selected.website_url} onChange={(event) => update("website_url", event.target.value)} className="admin-field" /></label>
              </section>

              <section className="grid gap-4">
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-violet-400">Photo</h4>
                {selected.photo_url && <img src={resolveAssetUrl(selected.photo_url)} alt="" className="h-24 w-24 rounded-2xl object-cover ring-1 ring-violet-100" />}
                <input value={selected.photo_url} onChange={(event) => update("photo_url", event.target.value)} className="admin-field" placeholder="Photo URL" />
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[22px] bg-violet-50 px-4 py-3 text-sm font-black text-[#5d55b9]">
                  <ImagePlus size={17} />
                  {uploading ? "Uploading..." : "Upload photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                </label>
              </section>

              <section className="grid gap-4">
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-violet-400">Options</h4>
                <label className="flex items-center gap-3 text-sm font-black text-slate-600"><input type="checkbox" checked={selected.featured} onChange={(event) => update("featured", event.target.checked)} /> Featured judge</label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Priority<input type="number" value={selected.priority} onChange={(event) => update("priority", Number(event.target.value))} className="admin-field" /></label>
              </section>

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

export default JudgesCmsPage;
