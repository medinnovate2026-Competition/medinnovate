import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ImagePlus, Mail, Pencil, Phone, Plus, Search, Trash2, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { cmsFetchJson } from "../utils/cmsApi";
import { resolveAssetUrl } from "../../config";

const sectionPresets = [
  "Core Team",
  "Scientific Committee",
  "Operations",
  "Advisory Board",
  "Design",
  "PR",
  "Logistics",
  "President",
  "Organising Secretary",
  "IT Cell",
  "Organising Committee",
];

const emptyMember = {
  section: "Core Team",
  name: "",
  role: "",
  phone: "",
  email: "",
  photo_url: "",
  display_order: 0,
};

function getInitials(name) {
  return String(name || "Member")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function TeamCmsPage() {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const sections = useMemo(() => ["All", ...new Set([...sectionPresets, ...members.map((member) => member.section).filter(Boolean)])], [members]);

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return members.filter((member) => {
      const searchText = `${member.section} ${member.name} ${member.role} ${member.phone} ${member.email}`.toLowerCase();
      return (!normalizedQuery || searchText.includes(normalizedQuery)) && (sectionFilter === "All" || member.section === sectionFilter);
    });
  }, [members, query, sectionFilter]);

  const groupedMembers = useMemo(() => {
    const grouped = new Map();
    filteredMembers.forEach((member) => {
      if (!grouped.has(member.section)) grouped.set(member.section, []);
      grouped.get(member.section).push(member);
    });
    return [...grouped.entries()].sort(([first], [second]) => first.localeCompare(second));
  }, [filteredMembers]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3200);
  };

  const loadMembers = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/team");
      setMembers(data.items || []);
    } catch (loadError) {
      const message = loadError.message || "Unable to load team members.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const startCreate = () => {
    setSelected({ ...emptyMember, display_order: members.length + 1 });
    setEditorOpen(true);
  };

  const startEdit = (member) => {
    setSelected(member);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setSelected(null);
    setEditorOpen(false);
  };

  const update = (key, value) => setSelected((current) => ({ ...current, [key]: value }));

  const saveMemberPayload = async (member, options = {}) => {
    const payload = {
      section: String(member.section || "").trim(),
      name: String(member.name || "").trim(),
      role: String(member.role || "").trim(),
      phone: String(member.phone || "").trim(),
      email: String(member.email || "").trim(),
      photo_url: String(member.photo_url || "").trim(),
      display_order: Number(member.display_order || 0),
    };

    const data = await cmsFetchJson(`/api/admin/team${member.id ? `/${member.id}` : ""}`, {
      method: member.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!options.silent) showToast("success", member.id ? "Member updated." : "Member added.");
    return data.item;
  };

  const saveMember = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await saveMemberPayload(selected);
      closeEditor();
      loadMembers();
    } catch (saveError) {
      const message = saveError.message || "Unable to save team member.";
      setError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Delete this team member?")) return;
    setError("");

    try {
      await cmsFetchJson(`/api/admin/team/${id}`, { method: "DELETE" });
      showToast("success", "Member deleted.");
      closeEditor();
      loadMembers();
    } catch (deleteError) {
      const message = deleteError.message || "Unable to delete team member.";
      setError(message);
      showToast("error", message);
    }
  };

  const moveMember = async (member, direction) => {
    const sectionMembers = members
      .filter((item) => item.section === member.section)
      .sort((first, second) => Number(first.display_order || 0) - Number(second.display_order || 0));
    const index = sectionMembers.findIndex((item) => item.id === member.id);
    const other = sectionMembers[index + direction];

    if (!other) return;

    const first = { ...member, display_order: other.display_order };
    const second = { ...other, display_order: member.display_order };

    try {
      await Promise.all([saveMemberPayload(first, { silent: true }), saveMemberPayload(second, { silent: true })]);
      showToast("success", "Order updated.");
      loadMembers();
    } catch (moveError) {
      const message = moveError.message || "Unable to update order.";
      setError(message);
      showToast("error", message);
    }
  };

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
            folder: "team",
            alt_text: selected?.name ? `${selected.name} photo` : "Team member photo",
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

  return (
    <>
      {toast && (
        <div className={`fixed right-5 top-5 z-[90] rounded-2xl px-5 py-3 text-sm font-black shadow-xl ${toast.type === "error" ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"}`}>
          {toast.message}
        </div>
      )}

      <PageHeader
        title="Team CMS"
        eyebrow="Team"
        description="Manage committee sections, people, roles, contacts, photos, and display order."
        actions={<button onClick={startCreate} className="admin-primary-button"><Plus size={18} />Add member</button>}
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}

      <section className="admin-card mb-6 flex flex-wrap items-center gap-3 rounded-[32px] p-4">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-field pl-12" placeholder="Search team..." />
        </div>
        <select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)} className="admin-field max-w-64">
          {sections.map((section) => <option key={section}>{section}</option>)}
        </select>
      </section>

      {loading ? (
        <section className="admin-card rounded-[32px] p-8 text-center font-bold text-slate-400">Loading team members...</section>
      ) : members.length === 0 ? (
        <section className="admin-card grid place-items-center rounded-[32px] p-10 text-center">
          <p className="text-lg font-black text-[#514aa3]">No committee members added yet</p>
          <button type="button" onClick={startCreate} className="admin-primary-button mt-5"><Plus size={18} />Add first member</button>
        </section>
      ) : (
        <main className="grid gap-7">
          {groupedMembers.map(([section, sectionMembers]) => (
            <section key={section} className="grid gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-400">Section</p>
                <h2 className="mt-1 text-2xl font-black text-[#514aa3]">{section}</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sectionMembers.map((member) => (
                  <article key={member.id} className="relative rounded-[28px] border border-violet-100 bg-white/90 p-5 shadow-[0_18px_55px_rgba(124,58,237,0.08)]">
                    <div className="flex items-start gap-4">
                      <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-lg font-black text-[#7C3AED]">
                        {member.photo_url ? <img src={resolveAssetUrl(member.photo_url)} alt="" className="h-full w-full object-cover" /> : getInitials(member.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-black text-[#514aa3]">{member.name}</h3>
                        <p className="mt-1 text-sm font-bold text-slate-500">{member.role || "Role not set"}</p>
                        <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-fuchsia-400">Order {member.display_order}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button type="button" onClick={() => startEdit(member)} className="admin-icon-button h-9 w-9" aria-label={`Edit ${member.name}`}><Pencil size={15} /></button>
                        <button type="button" onClick={() => deleteMember(member.id)} className="admin-icon-button h-9 w-9 text-rose-500" aria-label={`Delete ${member.name}`}><Trash2 size={15} /></button>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-2 text-sm font-semibold text-slate-500">
                      {member.phone && <p className="flex items-center gap-2"><Phone size={15} /> {member.phone}</p>}
                      {member.email && <p className="flex min-w-0 items-center gap-2"><Mail size={15} /> <span className="truncate">{member.email}</span></p>}
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button type="button" onClick={() => moveMember(member, -1)} className="admin-icon-button h-9 w-9" aria-label={`Move ${member.name} up`}><ChevronUp size={16} /></button>
                      <button type="button" onClick={() => moveMember(member, 1)} className="admin-icon-button h-9 w-9" aria-label={`Move ${member.name} down`}><ChevronDown size={16} /></button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </main>
      )}

      {editorOpen && selected && (
        <div className="fixed inset-0 z-[70] bg-slate-950/30 backdrop-blur-sm">
          <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-[#fbfaff] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#514aa3]">{selected.id ? "Member editor" : "Create member"}</h3>
              <button type="button" onClick={closeEditor} className="admin-icon-button h-10 w-10" aria-label="Close editor"><X size={17} /></button>
            </div>
            <form onSubmit={saveMember} className="grid gap-4">
              <div className="rounded-[28px] border border-dashed border-violet-200 bg-violet-50/70 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm"><ImagePlus size={20} /></span>
                  <div>
                    <p className="text-sm font-black text-[#514aa3]">Member photo</p>
                    <p className="text-xs font-semibold text-slate-400">Upload an image or paste a URL.</p>
                  </div>
                </div>
                {selected.photo_url && <img src={resolveAssetUrl(selected.photo_url)} alt="" className="mb-3 h-24 w-24 rounded-2xl object-cover ring-1 ring-violet-100" />}
                <input value={selected.photo_url} onChange={(event) => update("photo_url", event.target.value)} className="admin-field" placeholder="Photo URL" />
                <label className="mt-3 flex cursor-pointer items-center justify-center gap-3 rounded-[22px] bg-violet-50 px-4 py-3 text-sm font-black text-[#5d55b9]">
                  <ImagePlus size={17} />
                  {uploading ? "Uploading..." : "Upload photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-black text-slate-600">Section<input required list="team-sections" value={selected.section} onChange={(event) => update("section", event.target.value)} className="admin-field" /></label>
              <datalist id="team-sections">
                {sections.filter((section) => section !== "All").map((section) => <option key={section} value={section} />)}
              </datalist>
              <label className="grid gap-2 text-sm font-black text-slate-600">Name<input required value={selected.name} onChange={(event) => update("name", event.target.value)} className="admin-field" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Role<input value={selected.role} onChange={(event) => update("role", event.target.value)} className="admin-field" /></label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-black text-slate-600">Phone<input value={selected.phone} onChange={(event) => update("phone", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Email<input type="email" value={selected.email} onChange={(event) => update("email", event.target.value)} className="admin-field" /></label>
              </div>
              <label className="grid gap-2 text-sm font-black text-slate-600">Display order<input type="number" value={selected.display_order} onChange={(event) => update("display_order", Number(event.target.value))} className="admin-field" /></label>
              <div className="flex gap-3">
                <button type="button" onClick={closeEditor} className="admin-secondary-button flex-1">Cancel</button>
                <button disabled={saving} className="admin-primary-button flex-1 justify-center">{saving ? "Saving..." : "Save member"}</button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}

export default TeamCmsPage;
