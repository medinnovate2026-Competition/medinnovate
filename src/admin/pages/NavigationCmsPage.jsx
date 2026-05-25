import { useEffect, useMemo, useState } from "react";
import { ExternalLink, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Tabs from "../components/Tabs";
import { cmsFetchJson, isCmsApiUnavailable, readLocalCms, writeLocalCms } from "../utils/cmsApi";

const emptyItem = {
  label: "",
  path: "",
  parent_id: "",
  order_index: 0,
  visible: true,
  target: "_self",
  location: "navbar",
};

const NAVIGATION_KEY = "medinnovate_navigation_cms";
const seedNavigation = [
  { id: 1, label: "About", path: "#about", parent_id: "", order_index: 1, visible: true, target: "_self", location: "navbar" },
  { id: 2, label: "Why Attend", path: "#why-attend", parent_id: "", order_index: 2, visible: true, target: "_self", location: "navbar" },
  { id: 3, label: "Who Can Join", path: "#participants", parent_id: "", order_index: 3, visible: true, target: "_self", location: "navbar" },
  { id: 4, label: "Judges", path: "#judges", parent_id: "", order_index: 4, visible: true, target: "_self", location: "navbar" },
  { id: 5, label: "Organising Committee", path: "/organising-committee", parent_id: "", order_index: 5, visible: true, target: "_self", location: "navbar" },
  { id: 6, label: "Register", path: "/registration", parent_id: "", order_index: 6, visible: true, target: "_self", location: "navbar" },
];

function NavTree({ items, selected, onSelect, onMove, onDelete }) {
  const parentLabel = (parentId) => items.find((item) => item.id === parentId)?.label;

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div key={item.id} className={`flex items-center gap-3 rounded-[24px] border p-4 text-left transition hover:-translate-y-0.5 ${selected?.id === item.id ? "border-violet-300 bg-white" : "border-white/80 bg-white/60"}`}>
          <GripVertical className="text-slate-300" size={18} />
          <button type="button" onClick={() => onMove(item, -1)} disabled={index === 0} className="rounded-full bg-violet-50 px-2 py-1 text-xs font-black text-violet-600 disabled:opacity-30">Up</button>
          <button type="button" onClick={() => onMove(item, 1)} disabled={index === items.length - 1} className="rounded-full bg-violet-50 px-2 py-1 text-xs font-black text-violet-600 disabled:opacity-30">Down</button>
          <button type="button" onClick={() => onSelect(item)} className="min-w-0 flex-1 text-left">
            <p className="font-black text-[#514aa3]">{item.label}</p>
            <p className="truncate text-xs font-semibold text-slate-400">{item.path}</p>
            {item.parent_id ? <p className="mt-1 text-xs font-bold text-violet-400">Nested under {parentLabel(item.parent_id) || `#${item.parent_id}`}</p> : null}
          </button>
          {item.path?.startsWith("http") && <ExternalLink size={16} className="text-violet-500" />}
          <button type="button" onClick={() => onSelect(item)} className="admin-icon-button h-10 w-10" aria-label="Edit navigation"><Pencil size={16} /></button>
          <button type="button" onClick={() => onDelete(item.id)} className="admin-icon-button h-10 w-10 text-rose-500" aria-label="Delete navigation"><Trash2 size={16} /></button>
        </div>
      ))}
    </div>
  );
}

function NavigationCmsPage() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("navbar");
  const [selected, setSelected] = useState(emptyItem);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const visibleItems = useMemo(
    () => items.filter((item) => item.location === tab).sort((a, b) => a.order_index - b.order_index),
    [items, tab],
  );
  const navbarItems = useMemo(() => items.filter((item) => item.location === "navbar" && item.visible), [items]);
  const footerItems = useMemo(() => items.filter((item) => item.location === "footer" && item.visible), [items]);

  const loadNavigation = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ location: "All" });
      const data = await cmsFetchJson(`/api/admin/navigation?${params}`);
      setItems(data.items || []);
      setUsingFallback(false);
    } catch (loadError) {
      if (isCmsApiUnavailable(loadError)) {
        setItems(readLocalCms(NAVIGATION_KEY, seedNavigation));
        setUsingFallback(true);
      } else {
        setError(loadError.message || "Unable to load navigation.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNavigation();
  }, [tab]);

  const startCreate = () => {
    setEditingId(null);
    setSelected({ ...emptyItem, location: tab, order_index: visibleItems.length + 1 });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setSelected({ ...item, parent_id: item.parent_id || "" });
  };

  const update = (key, value) => setSelected((current) => ({ ...current, [key]: value }));

  const saveItem = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    if (usingFallback) {
      const nextItem = { ...selected, id: editingId || Date.now() };
      const nextItems = editingId
        ? items.map((item) => item.id === editingId ? nextItem : item)
        : [...items, nextItem];
      setItems(nextItems);
      writeLocalCms(NAVIGATION_KEY, nextItems);
      setEditingId(nextItem.id);
      setSelected({ ...nextItem, parent_id: nextItem.parent_id || "" });
      setSaving(false);
      return;
    }

    try {
      const data = await cmsFetchJson(`/api/admin/navigation${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selected,
          parent_id: selected.parent_id || null,
        }),
      });
      setEditingId(data.item.id);
      setSelected({ ...data.item, parent_id: data.item.parent_id || "" });
      loadNavigation();
    } catch (saveError) {
      setError(saveError.message || "Unable to save navigation item.");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this navigation item?")) return;

    if (usingFallback) {
      const nextItems = items.filter((item) => item.id !== id);
      setItems(nextItems);
      writeLocalCms(NAVIGATION_KEY, nextItems);
      if (editingId === id) startCreate();
      return;
    }

    try {
      await cmsFetchJson(`/api/admin/navigation/${id}`, { method: "DELETE" });
      if (editingId === id) startCreate();
      loadNavigation();
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete navigation item.");
    }
  };

  const toggleVisibility = async (item) => {
    const next = { ...item, visible: !item.visible };
    if (usingFallback) {
      const nextItems = items.map((current) => current.id === item.id ? next : current);
      setItems(nextItems);
      writeLocalCms(NAVIGATION_KEY, nextItems);
      return;
    }
    await cmsFetchJson(`/api/admin/navigation/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    loadNavigation();
  };

  const moveItem = async (item, direction) => {
    const ordered = [...visibleItems];
    const index = ordered.findIndex((candidate) => candidate.id === item.id);
    const swapIndex = index + direction;

    if (index < 0 || swapIndex < 0 || swapIndex >= ordered.length) return;

    const other = ordered[swapIndex];
    const nextOne = { ...item, order_index: other.order_index };
    const nextTwo = { ...other, order_index: item.order_index };
    if (usingFallback) {
      const nextItems = items.map((current) => current.id === item.id ? nextOne : current.id === other.id ? nextTwo : current);
      setItems(nextItems);
      writeLocalCms(NAVIGATION_KEY, nextItems);
      return;
    }
    await Promise.all([
      cmsFetchJson(`/api/admin/navigation/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextOne),
      }),
      cmsFetchJson(`/api/admin/navigation/${other.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextTwo),
      }),
    ]);
    loadNavigation();
  };

  return (
    <>
      <PageHeader
        title="Navigation CMS"
        eyebrow="Navigation"
        description="Manage navbar links, footer links, nested items, target behavior, visibility, and ordering."
        actions={<button type="button" onClick={startCreate} className="rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white"><Plus className="mr-2 inline" size={17} />Add link</button>}
      />

      {error && <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}
      {usingFallback && <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">Navigation is using a local browser draft because the production CMS API route is not deployed yet.</div>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="grid gap-5">
          <section className="admin-card rounded-[32px] p-6">
            <Tabs tabs={["navbar", "footer", "external"]} active={tab} onChange={setTab} />
            <div className="mt-5">
              {loading ? (
                <div className="rounded-[24px] bg-violet-50 p-8 text-center text-sm font-bold text-slate-400">Loading navigation...</div>
              ) : visibleItems.length === 0 ? (
                <div className="rounded-[24px] bg-violet-50 p-8 text-center text-sm font-bold text-slate-400">No links in this group yet.</div>
              ) : (
                <NavTree items={visibleItems} selected={selected} onSelect={startEdit} onMove={moveItem} onDelete={deleteItem} />
              )}
            </div>
          </section>

          <form onSubmit={saveItem} className="admin-card rounded-[32px] p-6">
            <h3 className="text-xl font-black text-[#514aa3]">{editingId ? "Nav item editor" : "Create nav item"}</h3>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-black text-slate-600">Label<input required value={selected.label} onChange={(event) => update("label", event.target.value)} className="admin-field" /></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Path<input required value={selected.path} onChange={(event) => update("path", event.target.value)} className="admin-field" /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-black text-slate-600">Group<select value={selected.location} onChange={(event) => update("location", event.target.value)} className="admin-field"><option value="navbar">Navbar</option><option value="footer">Footer</option><option value="external">External</option></select></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Parent<select value={selected.parent_id || ""} onChange={(event) => update("parent_id", event.target.value ? Number(event.target.value) : "")} className="admin-field"><option value="">None</option>{items.filter((item) => item.id !== editingId).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
                <label className="grid gap-2 text-sm font-black text-slate-600">Target<select value={selected.target} onChange={(event) => update("target", event.target.value)} className="admin-field"><option value="_self">Same tab</option><option value="_blank">New tab</option></select></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-black text-slate-600">Order<input type="number" value={selected.order_index} onChange={(event) => update("order_index", Number(event.target.value))} className="admin-field" /></label>
                <label className="mt-8 flex items-center gap-3 text-sm font-black text-slate-600"><input type="checkbox" checked={selected.visible} onChange={(event) => update("visible", event.target.checked)} />Visible</label>
              </div>
              <button disabled={saving} className="w-fit rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white">{saving ? "Saving..." : "Save link"}</button>
            </div>
          </form>
        </main>

        <aside className="admin-card sticky top-28 h-fit rounded-[32px] p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">Live Preview</p>
          <h3 className="mt-1 text-xl font-black text-[#514aa3]">Navigation</h3>
          <div className="mt-5 rounded-[26px] bg-[#5d55b9] p-4 text-white">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-white/60">Navbar</p>
            <div className="flex flex-wrap gap-3">
              {navbarItems.map((item) => (
                <button key={item.id} type="button" onClick={() => toggleVisibility(item)} className="rounded-full bg-white/14 px-3 py-2 text-xs font-black">{item.label}</button>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-[26px] bg-white/70 p-4">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-violet-400">Footer</p>
            <div className="grid gap-2">
              {footerItems.length === 0 ? <p className="text-sm font-bold text-slate-400">No footer links yet.</p> : footerItems.map((item) => <span key={item.id} className="text-sm font-black text-[#514aa3]">{item.label}</span>)}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default NavigationCmsPage;
