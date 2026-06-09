import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, GripVertical, ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { cmsFetchJson, isCmsApiUnavailable, readLocalCms, writeLocalCms } from "../utils/cmsApi";
import { resolveAssetUrl } from "../../config";
import partnerCategoryConfig from "../../../shared/partnerCategories.json";

const STORAGE_KEY = "medinnovate_academic_partners_cms";
const partnerTypeOptions = partnerCategoryConfig.categories;
const defaultPartnerType = partnerCategoryConfig.defaultType;
const partnerTypeAliases = new Map(
  partnerTypeOptions.flatMap((option) => [
    [option.value, option.value],
    ...(option.aliases || []).map((alias) => [alias, option.value]),
  ]),
);
const defaultPartnerLabel = partnerTypeOptions.find((option) => option.value === defaultPartnerType)?.label || "Academic partners";

const emptyPartner = {
  name: "",
  country: "",
  description: "",
  logo_url: "",
  website: "",
  partner_type: defaultPartnerType,
  display_order: 0,
  is_visible: true,
};

function getPartnerTypeLabel(type) {
  return partnerTypeOptions.find((option) => option.value === normalizePartnerType(type))?.label || defaultPartnerLabel;
}

function normalizePartnerType(type) {
  const normalized = String(type || defaultPartnerType).trim().toLowerCase();
  return partnerTypeAliases.get(normalized) || defaultPartnerType;
}

function normalizePartner(partner, index = 0) {
  return {
    ...emptyPartner,
    ...partner,
    id: partner.id || `local-${Date.now()}-${index}`,
    partner_type: normalizePartnerType(partner.partner_type),
    display_order: Number(partner.display_order ?? index + 1),
    is_visible: Boolean(partner.is_visible ?? true),
  };
}

function AcademicPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(emptyPartner);
  const [editingId, setEditingId] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const visiblePartners = useMemo(
    () => partners.filter((partner) => partner.is_visible).sort((a, b) => a.display_order - b.display_order),
    [partners],
  );

  const loadPartners = async (nextQuery = query) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ search: nextQuery });
      const data = await cmsFetchJson(`/api/admin/academic-partners?${params}`);
      setPartners((data.items || []).map(normalizePartner));
      setUsingFallback(false);
    } catch (loadError) {
      if (isCmsApiUnavailable(loadError)) {
        const localItems = readLocalCms(STORAGE_KEY, []);
        const filtered = localItems
          .filter((partner) => !nextQuery || `${partner.name} ${partner.country} ${partner.description} ${partner.partner_type}`.toLowerCase().includes(nextQuery.toLowerCase()))
          .sort((a, b) => a.display_order - b.display_order)
          .map(normalizePartner);
        setPartners(filtered);
        setUsingFallback(true);
      } else {
        setError(loadError.message || "Unable to load academic partners.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners("");
  }, []);

  const persistLocal = (items) => writeLocalCms(STORAGE_KEY, items.map(normalizePartner));

  const startCreate = () => {
    setEditingId(null);
    setSelected({ ...emptyPartner, display_order: partners.length + 1 });
    setEditorOpen(true);
  };

  const startEdit = (partner) => {
    setEditingId(partner.id);
    setSelected(partner);
    setEditorOpen(true);
  };

  const updateSelected = (key, value) => {
    setSelected((current) => ({ ...current, [key]: value }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const fileDataUrl = reader.result;

      if (usingFallback) {
        updateSelected("logo_url", fileDataUrl);
        return;
      }

      try {
        const data = await cmsFetchJson("/api/admin/media/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileDataUrl,
            originalName: file.name,
            folder: "academic-partners",
            alt_text: selected.name ? `${selected.name} logo` : "Academic partner logo",
          }),
        });
        updateSelected("logo_url", data.url || data.item?.url || "");
      } catch (uploadError) {
        setError(uploadError.message || "Unable to upload logo.");
      }
    };
    reader.readAsDataURL(file);
  };

  const savePartner = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = normalizePartner(selected);

    if (usingFallback) {
      const localItems = readLocalCms(STORAGE_KEY, []);
      const nextItem = { ...payload, id: editingId || payload.id };
      const nextItems = editingId ? localItems.map((partner) => partner.id === editingId ? nextItem : partner) : [...localItems, nextItem];
      persistLocal(nextItems);
      setEditorOpen(false);
      setSaving(false);
      loadPartners(query);
      return;
    }

    try {
      await cmsFetchJson(`/api/admin/academic-partners${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditorOpen(false);
      loadPartners(query);
    } catch (saveError) {
      setError(saveError.message || "Unable to save academic partner.");
    } finally {
      setSaving(false);
    }
  };

  const deletePartner = async (id) => {
    if (!window.confirm("Delete this academic partner?")) return;
    setError("");

    if (usingFallback) {
      persistLocal(readLocalCms(STORAGE_KEY, []).filter((partner) => partner.id !== id));
      loadPartners(query);
      return;
    }

    try {
      await cmsFetchJson(`/api/admin/academic-partners/${id}`, { method: "DELETE" });
      loadPartners(query);
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete academic partner.");
    }
  };

  const saveOrder = async (items) => {
    const ordered = items.map((partner, index) => ({ ...partner, display_order: index + 1 }));
    setPartners(ordered);

    if (usingFallback) {
      persistLocal(ordered);
      return;
    }

    await Promise.all(
      ordered.map((partner) =>
        cmsFetchJson(`/api/admin/academic-partners/${partner.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(partner),
        }),
      ),
    ).catch((orderError) => setError(orderError.message || "Unable to save order."));
  };

  const handleDrop = (targetId) => {
    if (!dragId || dragId === targetId) return;
    const current = [...partners].sort((a, b) => a.display_order - b.display_order);
    const fromIndex = current.findIndex((partner) => partner.id === dragId);
    const toIndex = current.findIndex((partner) => partner.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const [moved] = current.splice(fromIndex, 1);
    current.splice(toIndex, 0, moved);
    setDragId(null);
    saveOrder(current);
  };

  const toggleVisibility = async (partner) => {
    const next = { ...partner, is_visible: !partner.is_visible };
    if (usingFallback) {
      persistLocal(readLocalCms(STORAGE_KEY, []).map((item) => item.id === partner.id ? next : item));
      loadPartners(query);
      return;
    }

    try {
      await cmsFetchJson(`/api/admin/academic-partners/${partner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      loadPartners(query);
    } catch (toggleError) {
      setError(toggleError.message || "Unable to update visibility.");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin / Academic Partners"
        title="Partner Sections"
        description="Control academic, research, innovation, title, knowledge, Georgian regional, and outreach partner cards on the public website."
        actions={(
          <button onClick={startCreate} className="admin-primary-button">
            <Plus size={18} />
            Add partner
          </button>
        )}
      />

      {usingFallback && (
        <div className="rounded-[24px] border border-amber-200 bg-amber-50/80 px-6 py-4 text-sm font-bold text-amber-700">
          Production partner sections API is not available yet. This page is temporarily using a local browser draft.
        </div>
      )}
      {error && <div className="rounded-[24px] border border-rose-100 bg-rose-50 px-6 py-4 text-sm font-bold text-rose-600">{error}</div>}

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <section className="rounded-[32px] bg-white/78 p-6 shadow-[0_22px_80px_rgba(91,76,143,0.09)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  loadPartners(event.target.value);
                }}
                className="admin-field pl-14"
                placeholder="Search institutions, countries, descriptions, partner types..."
              />
            </div>
            <button onClick={() => loadPartners(query)} className="admin-secondary-button">Refresh</button>
          </div>

          <div className="mt-6 space-y-3">
            {loading ? (
              <div className="rounded-[28px] bg-violet-50/70 p-8 text-center text-sm font-black text-violet-300">Loading partners...</div>
            ) : partners.length === 0 ? (
              <div className="rounded-[28px] bg-violet-50/70 p-8 text-center text-sm font-black text-violet-300">No partners yet.</div>
            ) : partners.map((partner) => (
              <article
                key={partner.id}
                draggable
                onDragStart={() => setDragId(partner.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(partner.id)}
                className="grid gap-4 rounded-[26px] border border-violet-100 bg-white/82 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-[auto_1fr_auto]"
              >
                <div className="flex items-center gap-3">
                  <GripVertical size={18} className="cursor-grab text-violet-300" />
                  <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-violet-50 text-lg font-black text-violet-600">
                    {partner.logo_url ? <img src={resolveAssetUrl(partner.logo_url)} alt="" className="h-full w-full object-contain p-2" /> : partner.name.slice(0, 1)}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-black text-[#514aa3]">{partner.name}</h3>
                    <StatusBadge status={partner.is_visible ? "Published" : "Draft"} />
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-500">{partner.country || "Country not set"}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-fuchsia-500">{getPartnerTypeLabel(partner.partner_type)}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">{partner.description || "No description added."}</p>
                </div>
                <div className="flex items-center gap-2 md:justify-end">
                  <button onClick={() => toggleVisibility(partner)} className="admin-icon-button" aria-label="Toggle visibility">
                    {partner.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button onClick={() => startEdit(partner)} className="admin-icon-button" aria-label="Edit partner">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => deletePartner(partner.id)} className="admin-icon-button text-rose-500" aria-label="Delete partner">
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-[32px] bg-white/78 p-6 shadow-[0_22px_80px_rgba(91,76,143,0.09)] backdrop-blur">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">Live preview</p>
          <h2 className="mt-3 text-2xl font-black text-[#514aa3]">OUR PARTNERS</h2>
          <p className="mt-2 text-sm font-semibold text-slate-400">Only sections with visible cards appear publicly.</p>
          <div className="mt-6 space-y-5">
            {partnerTypeOptions.map((type) => {
              const typePartners = visiblePartners.filter((partner) => partner.partner_type === type.value);
              if (typePartners.length === 0) return null;

              return (
                <div key={type.value}>
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-violet-400">{type.label}</p>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                    {typePartners.slice(0, 2).map((partner) => (
                      <div key={partner.id} className="rounded-[26px] border border-violet-100 bg-white p-5 text-center shadow-sm">
                        <div className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-violet-50 text-violet-600">
                          {partner.logo_url ? <img src={resolveAssetUrl(partner.logo_url)} alt="" className="h-full w-full object-contain p-2" /> : partner.name.slice(0, 1)}
                        </div>
                        <h3 className="mt-4 font-black text-slate-900">{partner.name}</h3>
                        <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-fuchsia-500">{partner.country}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {visiblePartners.length === 0 && (
              <div className="rounded-[26px] bg-violet-50/70 p-8 text-center text-sm font-black text-violet-300">The public partner section stays hidden until a visible card is added.</div>
            )}
          </div>
        </aside>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/20 backdrop-blur-sm">
          <form onSubmit={savePartner} className="h-full w-full max-w-xl overflow-y-auto bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">{editingId ? "Edit" : "Create"}</p>
                <h2 className="mt-2 text-3xl font-black text-[#514aa3]">Partner card</h2>
              </div>
              <button type="button" onClick={() => setEditorOpen(false)} className="admin-icon-button" aria-label="Close editor">
                <X size={20} />
              </button>
            </div>

            <div className="mt-8 grid gap-5">
              <label className="admin-label">Institution name<input className="admin-field mt-2" value={selected.name} onChange={(event) => updateSelected("name", event.target.value)} required /></label>
              <label className="admin-label">
                Partner section
                <select className="admin-field mt-2" value={selected.partner_type} onChange={(event) => updateSelected("partner_type", event.target.value)}>
                  {partnerTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="admin-label">Country<input className="admin-field mt-2" value={selected.country} onChange={(event) => updateSelected("country", event.target.value)} /></label>
              <label className="admin-label">Description<textarea className="admin-field mt-2 min-h-32" value={selected.description} onChange={(event) => updateSelected("description", event.target.value)} /></label>
              <label className="admin-label">Website<input className="admin-field mt-2" value={selected.website} onChange={(event) => updateSelected("website", event.target.value)} placeholder="https://..." /></label>
              <label className="admin-label">Logo URL<input className="admin-field mt-2" value={selected.logo_url} onChange={(event) => updateSelected("logo_url", event.target.value)} /></label>
              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[24px] border border-dashed border-violet-200 bg-violet-50/60 p-5 text-sm font-black text-[#5d55b9]">
                <ImagePlus size={18} />
                Upload logo
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
              <label className="admin-label">Display order<input type="number" className="admin-field mt-2" value={selected.display_order} onChange={(event) => updateSelected("display_order", Number(event.target.value))} /></label>
              <label className="flex items-center justify-between rounded-[22px] bg-violet-50/70 px-5 py-4 text-sm font-black text-[#514aa3]">
                Visible on public website
                <input type="checkbox" checked={selected.is_visible} onChange={(event) => updateSelected("is_visible", event.target.checked)} />
              </label>
            </div>

            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => setEditorOpen(false)} className="admin-secondary-button flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="admin-primary-button flex-1 justify-center">{saving ? "Saving..." : "Save partner"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AcademicPartnersPage;
