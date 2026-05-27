import { useEffect, useMemo, useState } from "react";
import { AtSign, Globe, ImagePlus, Link, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { cmsFetchJson } from "../utils/cmsApi";
import { resolveAssetUrl } from "../../config";

const emptySpeaker = {
  name: "",
  designation: "",
  institution: "",
  bio: "",
  photo_url: "",
  session_title: "",
  session_description: "",
  session_day: "",
  session_time: "",
  venue: "",
  linkedin_url: "",
  instagram_url: "",
  website_url: "",
  featured: false,
  priority: 0,
};

function getInitials(name) {
  return String(name || "Speaker")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function SpeakersCmsPage() {
  const [speakers, setSpeakers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const filteredSpeakers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return speakers;
    return speakers.filter((speaker) =>
      `${speaker.name} ${speaker.designation} ${speaker.institution} ${speaker.session_title} ${speaker.venue}`.toLowerCase().includes(normalized),
    );
  }, [speakers, query]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3200);
  };

  const loadSpeakers = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/speakers");
      setSpeakers(data.items || []);
    } catch (loadError) {
      const message = loadError.message || "Unable to load speakers.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpeakers();
  }, []);

  const startCreate = () => {
    setSelected({ ...emptySpeaker, priority: speakers.length + 1 });
    setEditorOpen(true);
  };

  const startEdit = (speaker) => {
    setSelected({ ...emptySpeaker, ...speaker });
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
            folder: "speakers",
            alt_text: selected?.name ? `${selected.name} photo` : "Speaker photo",
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

  const saveSpeaker = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await cmsFetchJson(`/api/admin/speakers${selected.id ? `/${selected.id}` : ""}`, {
        method: selected.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });
      showToast("success", selected.id ? "Speaker updated." : "Speaker added.");
      closeEditor();
      loadSpeakers();
    } catch (saveError) {
      const message = saveError.message || "Unable to save speaker.";
      setError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const deleteSpeaker = async (id) => {
    if (!window.confirm("Delete this speaker?")) return;
    setError("");

    try {
      await cmsFetchJson(`/api/admin/speakers/${id}`, { method: "DELETE" });
      showToast("success", "Speaker deleted.");
      closeEditor();
      loadSpeakers();
    } catch (deleteError) {
      const message = deleteError.message || "Unable to delete speaker.";
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
        title="Speaker CMS"
        eyebrow="Speakers"
        description="Manage speakers, featured status, sessions, photos, social links, and display priority."
        actions={<button type="button" onClick={startCreate} className="admin-primary-button"><Plus size={18} />Add speaker</button>}
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}

      <section className="admin-card mb-6 flex flex-wrap items-center gap-3 rounded-[32px] p-4">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-field pl-12" placeholder="Search speakers..." />
        </div>
      </section>

      {loading ? (
        <section className="admin-card rounded-[32px] p-8 text-center font-bold text-slate-400">Loading speakers...</section>
      ) : speakers.length === 0 ? (
        <section className="admin-card grid place-items-center rounded-[32px] p-10 text-center">
          <p className="text-lg font-black text-[#514aa3]">No speakers added yet</p>
          <button type="button" onClick={startCreate} className="admin-primary-button mt-5"><Plus size={18} />Add Speaker</button>
        </section>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredSpeakers.map((speaker) => (
            <article key={speaker.id} className="rounded-[28px] border border-violet-100 bg-white/90 p-5 shadow-[0_18px_55px_rgba(124,58,237,0.08)]">
              <div className="flex gap-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-lg font-black text-[#7C3AED]">
                  {speaker.photo_url ? <img src={resolveAssetUrl(speaker.photo_url)} alt="" className="h-full w-full object-cover" /> : getInitials(speaker.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black text-[#514aa3]">{speaker.name}</h3>
                      <p className="mt-1 text-sm font-bold text-slate-500">{speaker.designation || "Designation not set"}</p>
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-violet-400">{speaker.institution || "Institution"}</p>
                    </div>
                    {speaker.featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-600"><Star size={13} fill="currentColor" />Featured</span>}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-600">{speaker.session_title || "Session title not set"}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-slate-300">Priority {speaker.priority}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex gap-2 text-violet-500">
                      {speaker.linkedin_url && <Link size={16} />}
                      {speaker.instagram_url && <AtSign size={16} />}
                      {speaker.website_url && <Globe size={16} />}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(speaker)} className="admin-icon-button h-9 w-9" aria-label={`Edit ${speaker.name}`}><Pencil size={15} /></button>
                      <button type="button" onClick={() => deleteSpeaker(speaker.id)} className="admin-icon-button h-9 w-9 text-rose-500" aria-label={`Delete ${speaker.name}`}><Trash2 size={15} /></button>
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
              <h3 className="text-xl font-black text-[#514aa3]">{selected.id ? "Speaker editor" : "Create speaker"}</h3>
              <button type="button" onClick={closeEditor} className="admin-icon-button h-10 w-10" aria-label="Close editor"><X size={17} /></button>
            </div>
            <form onSubmit={saveSpeaker} className="grid gap-6">
              <section className="grid gap-4">
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-violet-400">Basic Information</h4>
                <label className="grid gap-2 text-sm font-black text-slate-600">Name<input required value={selected.name} onChange={(event) => update("name", event.target.value)} className="admin-field" /></label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-black text-slate-600">Designation<input value={selected.designation} onChange={(event) => update("designation", event.target.value)} className="admin-field" /></label>
                  <label className="grid gap-2 text-sm font-black text-slate-600">Institution<input value={selected.institution} onChange={(event) => update("institution", event.target.value)} className="admin-field" /></label>
                </div>
                <label className="grid gap-2 text-sm font-black text-slate-600">Bio<textarea value={selected.bio} onChange={(event) => update("bio", event.target.value)} className="admin-field min-h-28" /></label>
              </section>

              <section className="grid gap-4">
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-violet-400">Session</h4>
                <label className="grid gap-2 text-sm font-black text-slate-600">Session title<input value={selected.session_title} onChange={(event) => update("session_title", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Description<textarea value={selected.session_description} onChange={(event) => update("session_description", event.target.value)} className="admin-field min-h-24" /></label>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="grid gap-2 text-sm font-black text-slate-600">Day<input value={selected.session_day} onChange={(event) => update("session_day", event.target.value)} className="admin-field" /></label>
                  <label className="grid gap-2 text-sm font-black text-slate-600">Time<input value={selected.session_time} onChange={(event) => update("session_time", event.target.value)} className="admin-field" /></label>
                  <label className="grid gap-2 text-sm font-black text-slate-600">Venue<input value={selected.venue} onChange={(event) => update("venue", event.target.value)} className="admin-field" /></label>
                </div>
              </section>

              <section className="grid gap-4">
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-violet-400">Media</h4>
                {selected.photo_url && <img src={resolveAssetUrl(selected.photo_url)} alt="" className="h-24 w-24 rounded-2xl object-cover ring-1 ring-violet-100" />}
                <input value={selected.photo_url} onChange={(event) => update("photo_url", event.target.value)} className="admin-field" placeholder="Photo URL" />
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[22px] bg-violet-50 px-4 py-3 text-sm font-black text-[#5d55b9]">
                  <ImagePlus size={17} />
                  {uploading ? "Uploading..." : "Upload photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                </label>
              </section>

              <section className="grid gap-4">
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-violet-400">Social</h4>
                <label className="grid gap-2 text-sm font-black text-slate-600">LinkedIn<input value={selected.linkedin_url} onChange={(event) => update("linkedin_url", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Instagram<input value={selected.instagram_url} onChange={(event) => update("instagram_url", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Website<input value={selected.website_url} onChange={(event) => update("website_url", event.target.value)} className="admin-field" /></label>
              </section>

              <section className="grid gap-4">
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-violet-400">Options</h4>
                <label className="flex items-center gap-3 text-sm font-black text-slate-600"><input type="checkbox" checked={selected.featured} onChange={(event) => update("featured", event.target.checked)} /> Featured speaker</label>
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

export default SpeakersCmsPage;
