import { useEffect, useMemo, useState } from "react";
import { AtSign, Eye, EyeOff, Globe, ImagePlus, Link, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { cmsFetchJson } from "../utils/cmsApi";
import { resolveAssetUrl } from "../../config";

const tiers = [
  { value: "title", label: "Title" },
  { value: "platinum", label: "Platinum" },
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "bronze", label: "Bronze" },
  { value: "community", label: "Community" },
  { value: "exhibitor", label: "Exhibitor" },
  { value: "support", label: "Support" },
];

const emptySponsor = {
  name: "",
  tier: "support",
  description: "",
  logo_url: "",
  website_url: "",
  instagram_url: "",
  linkedin_url: "",
  booth_number: "",
  session_enabled: false,
  session_title: "",
  session_description: "",
  display_order: 0,
  featured: false,
  active: true,
};

function getTierLabel(tier) {
  return tiers.find((item) => item.value === tier)?.label || "Support";
}

function getInitial(name) {
  return String(name || "S").slice(0, 1).toUpperCase();
}

function SponsorsCmsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const filteredSponsors = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return sponsors;
    return sponsors.filter((sponsor) =>
      `${sponsor.name} ${sponsor.tier} ${sponsor.description} ${sponsor.booth_number} ${sponsor.session_title}`.toLowerCase().includes(normalized),
    );
  }, [sponsors, query]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3200);
  };

  const loadSponsors = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cmsFetchJson("/api/admin/sponsors");
      setSponsors(data.items || []);
    } catch (loadError) {
      const message = loadError.message || "Unable to load sponsors.";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSponsors();
  }, []);

  const startCreate = () => {
    setSelected({ ...emptySponsor, display_order: sponsors.length + 1 });
    setEditorOpen(true);
  };

  const startEdit = (sponsor) => {
    setSelected({ ...emptySponsor, ...sponsor });
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setSelected(null);
    setEditorOpen(false);
  };

  const update = (key, value) => setSelected((current) => ({ ...current, [key]: value }));

  const handleLogoUpload = (event) => {
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
            folder: "sponsors",
            alt_text: selected?.name ? `${selected.name} logo` : "Sponsor logo",
          }),
        });
        update("logo_url", data.url || data.item?.url || "");
        showToast("success", "Logo uploaded.");
      } catch (uploadError) {
        const message = uploadError.message || "Unable to upload logo.";
        setError(message);
        showToast("error", message);
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const saveSponsor = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await cmsFetchJson(`/api/admin/sponsors${selected.id ? `/${selected.id}` : ""}`, {
        method: selected.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });
      showToast("success", selected.id ? "Sponsor updated." : "Sponsor added.");
      closeEditor();
      loadSponsors();
    } catch (saveError) {
      const message = saveError.message || "Unable to save sponsor.";
      setError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const deleteSponsor = async (id) => {
    if (!window.confirm("Delete this sponsor?")) return;
    setError("");

    try {
      await cmsFetchJson(`/api/admin/sponsors/${id}`, { method: "DELETE" });
      showToast("success", "Sponsor deleted.");
      closeEditor();
      loadSponsors();
    } catch (deleteError) {
      const message = deleteError.message || "Unable to delete sponsor.";
      setError(message);
      showToast("error", message);
    }
  };

  const toggleActive = async (sponsor) => {
    try {
      await cmsFetchJson(`/api/admin/sponsors/${sponsor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sponsor, active: !sponsor.active }),
      });
      showToast("success", !sponsor.active ? "Sponsor shown." : "Sponsor hidden.");
      loadSponsors();
    } catch (toggleError) {
      const message = toggleError.message || "Unable to update sponsor.";
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
        title="Sponsors CMS"
        eyebrow="Sponsors"
        description="Manage sponsors, partners, exhibitors, tiers, logos, links, booths, and sponsor sessions."
        actions={<button type="button" onClick={startCreate} className="admin-primary-button"><Plus size={18} />Add Sponsor</button>}
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}

      <section className="admin-card mb-6 flex flex-wrap items-center gap-3 rounded-[32px] p-4">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-field pl-12" placeholder="Search sponsors..." />
        </div>
      </section>

      {loading ? (
        <section className="admin-card rounded-[32px] p-8 text-center font-bold text-slate-400">Loading sponsors...</section>
      ) : sponsors.length === 0 ? (
        <section className="admin-card grid place-items-center rounded-[32px] p-10 text-center">
          <p className="text-lg font-black text-[#514aa3]">No sponsors added</p>
          <button type="button" onClick={startCreate} className="admin-primary-button mt-5"><Plus size={18} />Add Sponsor</button>
        </section>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredSponsors.map((sponsor) => (
            <article key={sponsor.id} className="rounded-[28px] border border-violet-100 bg-white/90 p-5 shadow-[0_18px_55px_rgba(124,58,237,0.08)]">
              <div className="flex gap-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white text-xl font-black text-[#7C3AED] ring-1 ring-violet-100">
                  {sponsor.logo_url ? <img src={resolveAssetUrl(sponsor.logo_url)} alt="" className="h-16 w-16 object-contain" /> : getInitial(sponsor.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black text-[#514aa3]">{sponsor.name}</h3>
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-violet-400">{getTierLabel(sponsor.tier)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {sponsor.featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-600"><Star size={13} fill="currentColor" />Featured</span>}
                      {sponsor.session_enabled && <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-black text-fuchsia-600">Session</span>}
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${sponsor.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>{sponsor.active ? "Active" : "Hidden"}</span>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold text-slate-500">{sponsor.description || "No description set."}</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-slate-300">Order {sponsor.display_order}{sponsor.booth_number ? ` · Booth ${sponsor.booth_number}` : ""}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex gap-2 text-violet-500">
                      {sponsor.website_url && <Globe size={16} />}
                      {sponsor.instagram_url && <AtSign size={16} />}
                      {sponsor.linkedin_url && <Link size={16} />}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(sponsor)} className="admin-icon-button h-9 w-9" aria-label={`Edit ${sponsor.name}`}><Pencil size={15} /></button>
                      <button type="button" onClick={() => toggleActive(sponsor)} className="admin-icon-button h-9 w-9" aria-label={`${sponsor.active ? "Hide" : "Show"} ${sponsor.name}`}>{sponsor.active ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                      <button type="button" onClick={() => deleteSponsor(sponsor.id)} className="admin-icon-button h-9 w-9 text-rose-500" aria-label={`Delete ${sponsor.name}`}><Trash2 size={15} /></button>
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
              <h3 className="text-xl font-black text-[#514aa3]">{selected.id ? "Sponsor editor" : "Create sponsor"}</h3>
              <button type="button" onClick={closeEditor} className="admin-icon-button h-10 w-10" aria-label="Close editor"><X size={17} /></button>
            </div>
            <form onSubmit={saveSponsor} className="grid gap-5">
              <label className="grid gap-2 text-sm font-black text-slate-600">Sponsor name<input required value={selected.name} onChange={(event) => update("name", event.target.value)} className="admin-field" /></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Tier<select value={selected.tier} onChange={(event) => update("tier", event.target.value)} className="admin-field">{tiers.map((tier) => <option key={tier.value} value={tier.value}>{tier.label}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-black text-slate-600">Description<textarea value={selected.description} onChange={(event) => update("description", event.target.value)} className="admin-field min-h-24" /></label>
              <section className="grid gap-4 rounded-[28px] border border-dashed border-violet-200 bg-violet-50/70 p-5">
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-violet-400">Logo upload</h4>
                {selected.logo_url && <img src={resolveAssetUrl(selected.logo_url)} alt="" className="h-24 w-24 rounded-2xl object-contain ring-1 ring-violet-100" />}
                <input value={selected.logo_url} onChange={(event) => update("logo_url", event.target.value)} className="admin-field" placeholder="Logo URL" />
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[22px] bg-violet-50 px-4 py-3 text-sm font-black text-[#5d55b9]">
                  <ImagePlus size={17} />
                  {uploading ? "Uploading..." : "Upload logo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
                </label>
              </section>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-black text-slate-600">Website<input value={selected.website_url} onChange={(event) => update("website_url", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Instagram<input value={selected.instagram_url} onChange={(event) => update("instagram_url", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">LinkedIn<input value={selected.linkedin_url} onChange={(event) => update("linkedin_url", event.target.value)} className="admin-field" /></label>
              </div>
              <label className="grid gap-2 text-sm font-black text-slate-600">Booth number<input value={selected.booth_number} onChange={(event) => update("booth_number", event.target.value)} className="admin-field" /></label>
              <label className="flex items-center gap-3 text-sm font-black text-slate-600"><input type="checkbox" checked={selected.session_enabled} onChange={(event) => update("session_enabled", event.target.checked)} /> Enable sponsor session</label>
              {selected.session_enabled && (
                <div className="grid gap-4">
                  <label className="grid gap-2 text-sm font-black text-slate-600">Session title<input value={selected.session_title} onChange={(event) => update("session_title", event.target.value)} className="admin-field" /></label>
                  <label className="grid gap-2 text-sm font-black text-slate-600">Session description<textarea value={selected.session_description} onChange={(event) => update("session_description", event.target.value)} className="admin-field min-h-24" /></label>
                </div>
              )}
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

export default SponsorsCmsPage;
