import { useEffect, useMemo, useState } from "react";
import { AtSign, ImagePlus, Link, Mail, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { cmsFetchJson, isCmsApiUnavailable, readLocalCms, writeLocalCms } from "../utils/cmsApi";

const emptyMember = {
  name: "",
  role: "",
  organization: "",
  photo_url: "",
  email: "",
  instagram: "",
  linkedin: "",
  display_order: 0,
  status: "Draft",
};

const TEAM_KEY = "medinnovate_team_cms";
const seedMembers = [
  { id: 1, name: "Abhishek Kashyap", role: "GAIMS President", organization: "GAIMS", photo_url: "", email: "", instagram: "", linkedin: "", display_order: 1, status: "Published" },
  { id: 2, name: "Oluwasola Victor", role: "CEO of BlueOzone", organization: "Blue Ozone Health", photo_url: "", email: "", instagram: "", linkedin: "", display_order: 2, status: "Published" },
  { id: 3, name: "Girik Subudhi", role: "Organising Secretary GAIMS", organization: "GAIMS", photo_url: "", email: "giriksubudhi@gmail.com", instagram: "", linkedin: "", display_order: 3, status: "Published" },
  { id: 4, name: "Sofiyullah Salaudeen", role: "Organising Secretary NiMSA", organization: "NIMSA", photo_url: "", email: "sofiyullahopeyemi@gmail.com", instagram: "", linkedin: "", display_order: 4, status: "Published" },
  { id: 5, name: "Elton M Mahulu", role: "Organising Secretary FAMSA", organization: "FAMSA", photo_url: "", email: "mahuluelton007@gmail.com", instagram: "", linkedin: "", display_order: 5, status: "Published" },
  { id: 6, name: "Ogunka Favour", role: "Organising Secretary BlueOzone Health", organization: "Blue Ozone Health", photo_url: "", email: "ogunkafavour@gmail.com", instagram: "", linkedin: "", display_order: 6, status: "Published" },
  { id: 7, name: "Sushmit Morey", role: "IT Cell Lead", organization: "MedInnovate", photo_url: "", email: "", instagram: "", linkedin: "", display_order: 7, status: "Published" },
];

function TeamCard({ member, selected, onSelect }) {
  const initials = member.name.split(" ").map((part) => part[0]).join("").slice(0, 2) || "M";

  return (
    <button onClick={() => onSelect(member)} className={`rounded-[30px] border p-5 text-center shadow-sm transition hover:-translate-y-1 ${selected ? "border-violet-300 bg-white" : "border-white/80 bg-white/70"}`}>
      <div className="mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-100 to-fuchsia-100 text-2xl font-black text-[#5d55b9]">
        {member.photo_url ? <img src={member.photo_url} alt="" className="h-full w-full object-cover" /> : initials}
      </div>
      <h3 className="mt-4 text-lg font-black text-[#514aa3]">{member.name}</h3>
      <p className="mt-1 text-sm font-bold text-slate-500">{member.role || "Role not set"}</p>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-violet-400">{member.organization || "Organization"}</p>
      <div className="mt-3 flex justify-center"><StatusBadge status={member.status} /></div>
    </button>
  );
}

function TeamCmsPage() {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const previewMembers = useMemo(() => members.filter((member) => member.status === "Published").slice(0, 5), [members]);

  const loadMembers = async (next = {}) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        search: next.search ?? query,
        role: next.role ?? roleFilter,
      });
      const data = await cmsFetchJson(`/api/admin/team?${params}`);
      setMembers(data.items || []);
      setRoles(data.roles || []);
      setUsingFallback(false);
    } catch (loadError) {
      if (isCmsApiUnavailable(loadError)) {
        const nextSearch = next.search ?? query;
        const nextRole = next.role ?? roleFilter;
        const localMembers = readLocalCms(TEAM_KEY, seedMembers);
        const filtered = localMembers
          .filter((member) => !nextSearch || `${member.name} ${member.role} ${member.organization} ${member.email}`.toLowerCase().includes(nextSearch.toLowerCase()))
          .filter((member) => nextRole === "All" || member.role === nextRole)
          .sort((a, b) => a.display_order - b.display_order);
        setMembers(filtered);
        setRoles([...new Set(localMembers.map((member) => member.role).filter(Boolean))]);
        setUsingFallback(true);
      } else {
        setError(loadError.message || "Unable to load team members.");
      }
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

  const update = (key, value) => setSelected((current) => ({ ...current, [key]: value }));

  const saveMember = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    if (usingFallback) {
      const localMembers = readLocalCms(TEAM_KEY, seedMembers);
      const nextItem = { ...selected, id: selected.id || Date.now() };
      const nextMembers = selected.id ? localMembers.map((member) => member.id === selected.id ? nextItem : member) : [...localMembers, nextItem];
      writeLocalCms(TEAM_KEY, nextMembers);
      setSelected(nextItem);
      setEditorOpen(false);
      setSaving(false);
      loadMembers();
      return;
    }

    try {
      const data = await cmsFetchJson(`/api/admin/team${selected.id ? `/${selected.id}` : ""}`, {
        method: selected.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });

      setSelected(data.item);
      setEditorOpen(false);
      loadMembers();
    } catch (saveError) {
      setError(saveError.message || "Unable to save team member.");
    } finally {
      setSaving(false);
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Delete this team member?")) return;
    setError("");

    if (usingFallback) {
      const nextMembers = readLocalCms(TEAM_KEY, seedMembers).filter((member) => member.id !== id);
      writeLocalCms(TEAM_KEY, nextMembers);
      setEditorOpen(false);
      setSelected(null);
      loadMembers();
      return;
    }

    try {
      await cmsFetchJson(`/api/admin/team/${id}`, { method: "DELETE" });
      setEditorOpen(false);
      setSelected(null);
      loadMembers();
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete team member.");
    }
  };

  const toggleStatus = async (member) => {
    const next = { ...member, status: member.status === "Published" ? "Draft" : "Published" };
    if (usingFallback) {
      const nextMembers = readLocalCms(TEAM_KEY, seedMembers).map((item) => item.id === member.id ? next : item);
      writeLocalCms(TEAM_KEY, nextMembers);
      loadMembers();
      return;
    }
    await cmsFetchJson(`/api/admin/team/${member.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    loadMembers();
  };

  const runSearch = (event) => {
    event.preventDefault();
    loadMembers();
  };

  return (
    <>
      <PageHeader
        title="Team CMS"
        eyebrow="Team"
        description="Manage team photos, roles, organizations, social links, ordering, and publishing status."
        actions={<button onClick={startCreate} className="rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white"><Plus className="mr-2 inline" size={17} />Add member</button>}
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}
      {usingFallback && <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">Team CMS is using a local browser draft because the production CMS API route is not deployed yet.</div>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="grid gap-5">
          <section className="admin-card flex flex-wrap items-center gap-3 rounded-[32px] p-4">
            <form onSubmit={runSearch} className="relative min-w-64 flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-field pl-12" placeholder="Search team..." />
            </form>
            <select
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(event.target.value);
                loadMembers({ role: event.target.value });
              }}
              className="admin-field max-w-64"
            >
              <option>All</option>
              {roles.map((role) => <option key={role}>{role}</option>)}
            </select>
          </section>

          {loading ? (
            <section className="admin-card rounded-[32px] p-8 text-center font-bold text-slate-400">Loading team members...</section>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((member) => (
                <div key={member.id} className="relative">
                  <TeamCard member={member} selected={selected?.id === member.id} onSelect={startEdit} />
                  <div className="absolute right-4 top-4 flex gap-2">
                    <button type="button" onClick={() => toggleStatus(member)} className="rounded-full bg-white/90 px-3 py-2 text-xs font-black text-violet-700 shadow-sm">
                      {member.status === "Published" ? "Unpublish" : "Publish"}
                    </button>
                    <button type="button" onClick={() => deleteMember(member.id)} className="admin-icon-button h-9 w-9 text-rose-500"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <aside className="admin-card sticky top-28 h-fit rounded-[32px] p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">Live Preview</p>
          <h3 className="mt-1 text-xl font-black text-[#514aa3]">Team section</h3>
          <div className="mt-5 grid gap-3">
            {previewMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3 rounded-[24px] bg-white/70 p-3">
                <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-violet-100 text-sm font-black text-violet-700">
                  {member.photo_url ? <img src={member.photo_url} alt="" className="h-full w-full object-cover" /> : member.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[#454083]">{member.name}</p>
                  <p className="truncate text-xs font-semibold text-slate-400">{member.role}</p>
                </div>
                <div className="flex gap-1 text-violet-500"><Mail size={14} /><Link size={14} /><AtSign size={14} /></div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {editorOpen && selected && (
        <div className="fixed inset-0 z-[70] bg-slate-950/30 backdrop-blur-sm">
          <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-[#fbfaff] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#514aa3]">{selected.id ? "Member editor" : "Create member"}</h3>
              <button onClick={() => setEditorOpen(false)} className="admin-icon-button h-10 w-10"><X size={17} /></button>
            </div>
            <form onSubmit={saveMember} className="grid gap-4">
              <div className="rounded-[28px] border border-dashed border-violet-200 bg-violet-50/70 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm"><ImagePlus size={20} /></span>
                  <div>
                    <p className="text-sm font-black text-[#514aa3]">Upload placeholder</p>
                    <p className="text-xs font-semibold text-slate-400">Paste a production photo URL for now.</p>
                  </div>
                </div>
                <input value={selected.photo_url} onChange={(event) => update("photo_url", event.target.value)} className="admin-field" placeholder="Photo URL" />
              </div>
              <label className="grid gap-2 text-sm font-black text-slate-600">Name<input required value={selected.name} onChange={(event) => update("name", event.target.value)} className="admin-field" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Role<input value={selected.role} onChange={(event) => update("role", event.target.value)} className="admin-field" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Organization<input value={selected.organization} onChange={(event) => update("organization", event.target.value)} className="admin-field" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Email<input value={selected.email} onChange={(event) => update("email", event.target.value)} className="admin-field" /></label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-black text-slate-600">Instagram<input value={selected.instagram} onChange={(event) => update("instagram", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">LinkedIn<input value={selected.linkedin} onChange={(event) => update("linkedin", event.target.value)} className="admin-field" /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-black text-slate-600">Order<input type="number" value={selected.display_order} onChange={(event) => update("display_order", Number(event.target.value))} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Status<select value={selected.status} onChange={(event) => update("status", event.target.value)} className="admin-field"><option>Published</option><option>Draft</option></select></label>
              </div>
              <button disabled={saving} className="w-fit rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white">{saving ? "Saving..." : "Save member"}</button>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}

export default TeamCmsPage;
