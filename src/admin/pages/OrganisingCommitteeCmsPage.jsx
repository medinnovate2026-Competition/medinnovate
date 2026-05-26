import { useMemo, useState } from "react";
import { ImagePlus, Mail, Phone, Plus, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { cmsFetchJson } from "../utils/cmsApi";
import { resolveAssetUrl } from "../../config";
import { committeeSections } from "../../pages/OrganisingCommittee";

const STORAGE_KEY = "medinnovate_organising_committee_cms";

const emptyMember = {
  name: "",
  role: "",
  section: "Organising Committee",
  phone: "",
  email: "",
  photo: "",
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

function loadMembers() {
  const seedMembers = committeeSections.flatMap((section) =>
    section.members.map((member) => ({
      ...member,
      section: section.title,
      id: `${section.title}-${member.name}`,
    })),
  );

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return [...seedMembers, ...stored];
  } catch {
    return seedMembers;
  }
}

function OrganisingCommitteeCmsPage() {
  const [members, setMembers] = useState(loadMembers);
  const [query, setQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState(emptyMember);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const sections = useMemo(() => ["All", ...new Set(members.map((member) => member.section).filter(Boolean))], [members]);
  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchesQuery = !normalizedQuery || `${member.name} ${member.role} ${member.email} ${member.phone} ${member.section}`.toLowerCase().includes(normalizedQuery);
      const matchesSection = sectionFilter === "All" || member.section === sectionFilter;
      return matchesQuery && matchesSection;
    });
  }, [members, query, sectionFilter]);

  const savedMembers = useMemo(() => members.filter((member) => String(member.id).startsWith("custom-")), [members]);

  const updateDraft = (key, value) => setDraft((current) => ({ ...current, [key]: value }));

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
            folder: "organising-committee",
            alt_text: draft.name ? `${draft.name} photo` : "Organising committee photo",
          }),
        });
        updateDraft("photo", data.url || data.item?.url || "");
      } catch (uploadError) {
        setError(uploadError.message || "Unable to upload photo.");
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const saveMember = (event) => {
    event.preventDefault();
    const nextMember = {
      ...draft,
      id: `custom-${Date.now()}`,
      name: draft.name.trim(),
      role: draft.role.trim(),
      section: draft.section.trim() || "Organising Committee",
      phone: draft.phone.trim(),
      email: draft.email.trim(),
    };

    const nextSaved = [...savedMembers, nextMember];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSaved));
    setMembers(loadMembers());
    setDraft(emptyMember);
    setEditorOpen(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Organising Committee"
        title="Organising Committee"
        description="Manage the organising committee member list, contact details, roles, and section grouping."
        actions={(
          <button onClick={() => setEditorOpen(true)} className="admin-primary-button">
            <Plus size={18} />
            Add member
          </button>
        )}
      />

      <section className="rounded-[32px] bg-white/78 p-6 shadow-[0_22px_80px_rgba(91,76,143,0.09)] backdrop-blur">
        {error && <div className="mb-5 rounded-[24px] border border-rose-100 bg-rose-50 px-6 py-4 text-sm font-bold text-rose-600">{error}</div>}
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="admin-field pl-14"
              placeholder="Search members, roles, email, phone..."
            />
          </div>
          <select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)} className="admin-field min-w-56">
            {sections.map((section) => <option key={section}>{section}</option>)}
          </select>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member, index) => (
            <motion.article
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.18) }}
              className="rounded-[28px] border border-violet-100 bg-white/90 p-5 shadow-[0_18px_55px_rgba(124,58,237,0.08)]"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-lg font-black text-[#7C3AED]">
                  {member.photo ? <img src={resolveAssetUrl(member.photo)} alt="" className="h-full w-full object-cover" /> : getInitials(member.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-black text-[#514aa3]">{member.name}</h3>
                  <p className="mt-1 text-sm font-bold text-slate-500">{member.role}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-fuchsia-400">{member.section}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-2 text-sm font-semibold text-slate-500">
                {member.phone && <p className="flex items-center gap-2"><Phone size={15} /> {member.phone}</p>}
                {member.email && <p className="flex min-w-0 items-center gap-2"><Mail size={15} /> <span className="truncate">{member.email}</span></p>}
              </div>
            </motion.article>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="mt-6 rounded-[28px] bg-violet-50/70 p-8 text-center text-sm font-black text-violet-300">
            No committee members match this search.
          </div>
        )}
      </section>

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/20 backdrop-blur-sm">
          <form onSubmit={saveMember} className="h-full w-full max-w-xl overflow-y-auto bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">Create</p>
                <h2 className="mt-2 text-3xl font-black text-[#514aa3]">Committee member</h2>
              </div>
              <button type="button" onClick={() => setEditorOpen(false)} className="admin-icon-button" aria-label="Close editor">
                <X size={20} />
              </button>
            </div>

            <div className="mt-8 grid gap-5">
              <label className="admin-label">Name<input className="admin-field mt-2" value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} required /></label>
              <label className="admin-label">Role<input className="admin-field mt-2" value={draft.role} onChange={(event) => updateDraft("role", event.target.value)} required /></label>
              <label className="admin-label">Section<input className="admin-field mt-2" value={draft.section} onChange={(event) => updateDraft("section", event.target.value)} /></label>
              <label className="admin-label">Phone<input className="admin-field mt-2" value={draft.phone} onChange={(event) => updateDraft("phone", event.target.value)} /></label>
              <label className="admin-label">Email<input type="email" className="admin-field mt-2" value={draft.email} onChange={(event) => updateDraft("email", event.target.value)} /></label>
              <label className="admin-label">Photo URL<input className="admin-field mt-2" value={draft.photo} onChange={(event) => updateDraft("photo", event.target.value)} /></label>
              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[24px] border border-dashed border-violet-200 bg-violet-50/60 p-5 text-sm font-black text-[#5d55b9]">
                <ImagePlus size={18} />
                {uploading ? "Uploading..." : "Upload photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
            </div>

            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => setEditorOpen(false)} className="admin-secondary-button flex-1">Cancel</button>
              <button type="submit" className="admin-primary-button flex-1 justify-center">Save member</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default OrganisingCommitteeCmsPage;
