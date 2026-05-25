import { useEffect, useMemo, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { API_BASE } from "../config/api";

const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Site Settings", to: "/admin/site-settings" },
  { label: "Navigation", to: "/admin/navigation" },
  { label: "Media", to: "/admin/media" },
  { label: "Homepage", to: "/admin/homepage" },
  { label: "Team", to: "/admin/team" },
  { label: "FAQ", to: "/admin/faq" },
  { label: "Coupons", to: "/admin/coupons" },
];

const fieldTypes = {
  answer: "textarea",
  bio: "textarea",
  footer_content: "textarea",
  hero_description: "textarea",
  seo_description: "textarea",
  announcement_bar: "textarea",
  highlights: "textarea",
  stats: "textarea",
  announcements: "textarea",
  social_links: "textarea",
  theme_colors: "textarea",
  metadata: "textarea",
  is_external: "checkbox",
  is_published: "checkbox",
};

const emptyCollectionItem = (fields) =>
  fields.reduce((item, field) => {
    item[field] = fieldTypes[field] === "checkbox" ? true : "";
    return item;
  }, {});

function AdminCard({ children, className = "" }) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function Field({ name, value, onChange }) {
  const type = fieldTypes[name] || "text";
  const label = name.replace(/_/g, " ");

  if (type === "textarea") {
    return (
      <label className="grid gap-2 text-sm font-semibold capitalize text-slate-700">
        {label}
        <textarea
          rows={4}
          value={value || ""}
          onChange={(event) => onChange(name, event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 font-normal text-slate-900 outline-none focus:border-blue-500"
        />
      </label>
    );
  }

  if (type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm font-semibold capitalize text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(name, event.target.checked)}
        />
        {label}
      </label>
    );
  }

  return (
    <label className="grid gap-2 text-sm font-semibold capitalize text-slate-700">
      {label}
      <input
        value={value || ""}
        onChange={(event) => onChange(name, event.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 font-normal text-slate-900 outline-none focus:border-blue-500"
      />
    </label>
  );
}

function useApiState() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return { loading, setLoading, message, setMessage, error, setError };
}

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-slate-950 p-5 text-white lg:block">
        <Link to="/" className="block text-xl font-black">MedInnovate CMS</Link>
        <nav className="mt-8 grid gap-1">
          {adminLinks.map((link) => (
            <Link key={link.to} to={link.to} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-black">Admin Panel</h1>
            <div className="flex flex-wrap gap-2 lg:hidden">
              {adminLinks.map((link) => (
                <Link key={link.to} to={link.to} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/dashboard`)
      .then((response) => response.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const stats = data?.stats || {};

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700">Overview</p>
        <h2 className="mt-2 text-3xl font-black">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        {[
          ["Registrations", stats.registrations],
          ["Teams", stats.teams],
          ["Payments", stats.payments],
          ["Workshop Registrations", stats.workshopRegistrations],
          ["Revenue", `$${Number(stats.revenue || 0).toFixed(2)}`],
          ["Coupons", stats.coupons],
          ["Media", stats.media],
        ].map(([label, value]) => (
          <AdminCard key={label}>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black">{value ?? "0"}</p>
          </AdminCard>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard>
          <h3 className="text-lg font-black">Recent Activities</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            {(data?.recentActivities || []).map((activity) => (
              <div key={activity.id} className="rounded-md bg-slate-50 p-3">{activity.label}</div>
            ))}
          </div>
        </AdminCard>
        <AdminCard>
          <h3 className="text-lg font-black">Latest Registrations</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            {(data?.latestRegistrations || []).map((team) => (
              <div key={team.id} className="rounded-md bg-slate-50 p-3">{team.team_name}</div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

export function SingleEntryEditor({ title, endpoint, responseKey, fields }) {
  const api = useApiState();
  const [form, setForm] = useState({});

  useEffect(() => {
    api.setLoading(true);
    fetch(`${API_BASE}${endpoint}`)
      .then((response) => response.json())
      .then((data) => setForm(data[responseKey] || {}))
      .catch((error) => api.setError(error.message || "Unable to load content."))
      .finally(() => api.setLoading(false));
  }, [endpoint, responseKey]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const save = async (event) => {
    event.preventDefault();
    api.setMessage("");
    api.setError("");
    api.setLoading(true);

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save.");
      setForm(data[responseKey] || {});
      api.setMessage("Saved successfully.");
    } catch (error) {
      api.setError(error.message || "Unable to save.");
    } finally {
      api.setLoading(false);
    }
  };

  return (
    <AdminCard>
      <h2 className="text-2xl font-black">{title}</h2>
      <form onSubmit={save} className="mt-6 grid gap-4 md:grid-cols-2">
        {fields.map((field) => <Field key={field} name={field} value={form[field]} onChange={updateField} />)}
        <div className="md:col-span-2">
          <button className="rounded-md bg-blue-700 px-5 py-2 text-sm font-bold text-white disabled:opacity-50" disabled={api.loading}>
            {api.loading ? "Saving..." : "Save"}
          </button>
          {api.message && <p className="mt-3 text-sm font-semibold text-green-700">{api.message}</p>}
          {api.error && <p className="mt-3 text-sm font-semibold text-red-700">{api.error}</p>}
        </div>
      </form>
    </AdminCard>
  );
}

export function CollectionManager({ title, endpoint, fields }) {
  const api = useApiState();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(() => emptyCollectionItem(fields));
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const loadItems = () => {
    api.setLoading(true);
    fetch(`${API_BASE}${endpoint}?search=${encodeURIComponent(search)}`)
      .then((response) => response.json())
      .then((data) => setItems(data.items || []))
      .catch((error) => api.setError(error.message || "Unable to load items."))
      .finally(() => api.setLoading(false));
  };

  useEffect(() => {
    loadItems();
  }, [endpoint]);

  const resetForm = () => {
    setForm(emptyCollectionItem(fields));
    setEditingId(null);
  };

  const save = async (event) => {
    event.preventDefault();
    api.setMessage("");
    api.setError("");

    try {
      const response = await fetch(`${API_BASE}${endpoint}${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save.");
      api.setMessage("Saved successfully.");
      resetForm();
      loadItems();
    } catch (error) {
      api.setError(error.message || "Unable to save.");
    }
  };

  const remove = async (id) => {
    await fetch(`${API_BASE}${endpoint}/${id}`, { method: "DELETE" });
    loadItems();
  };

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <div className="grid gap-6">
      <AdminCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black">{title}</h2>
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <button type="button" onClick={loadItems} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold">Search</button>
          </div>
        </div>
        <form onSubmit={save} className="mt-6 grid gap-4 md:grid-cols-2">
          {fields.map((field) => <Field key={field} name={field} value={form[field]} onChange={updateField} />)}
          <div className="md:col-span-2 flex gap-2">
            <button className="rounded-md bg-blue-700 px-5 py-2 text-sm font-bold text-white">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="rounded-md border border-slate-300 px-5 py-2 text-sm font-bold">Cancel</button>}
          </div>
        </form>
        {api.message && <p className="mt-3 text-sm font-semibold text-green-700">{api.message}</p>}
        {api.error && <p className="mt-3 text-sm font-semibold text-red-700">{api.error}</p>}
      </AdminCard>
      <AdminCard>
        <h3 className="text-lg font-black">Entries</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                {fields.slice(0, 4).map((field) => <th key={field} className="px-3 py-2 capitalize">{field.replace(/_/g, " ")}</th>)}
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  {fields.slice(0, 4).map((field) => <td key={field} className="max-w-64 truncate px-3 py-3">{String(item[field] ?? "")}</td>)}
                  <td className="px-3 py-3">
                    <button type="button" onClick={() => { setEditingId(item.id); setForm({ ...emptyCollectionItem(fields), ...item }); }} className="mr-2 rounded-md border border-slate-300 px-3 py-1 font-bold">Edit</button>
                    <button type="button" onClick={() => remove(item.id)} className="rounded-md border border-red-200 px-3 py-1 font-bold text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}

export function MediaPage() {
  const [file, setFile] = useState(null);
  const mediaFields = useMemo(() => ["file_name", "original_name", "url", "mime_type", "folder", "alt_text", "size_bytes", "metadata"], []);

  const upload = async (event) => {
    event.preventDefault();
    if (!file) return;

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    await fetch(`${API_BASE}/api/admin/media/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileDataUrl: dataUrl, originalName: file.name }),
    });
    window.location.reload();
  };

  return (
    <div className="grid gap-6">
      <AdminCard>
        <h2 className="text-2xl font-black">Media Upload</h2>
        <form onSubmit={upload} className="mt-4 flex flex-wrap gap-3">
          <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          <button className="rounded-md bg-blue-700 px-5 py-2 text-sm font-bold text-white">Upload</button>
        </form>
      </AdminCard>
      <CollectionManager title="Media Library" endpoint="/api/admin/media" fields={mediaFields} />
    </div>
  );
}

export const SiteSettingsPage = () => (
  <SingleEntryEditor
    title="Site Settings"
    endpoint="/api/admin/site-settings"
    responseKey="settings"
    fields={["website_name", "tagline", "logo_url", "favicon_url", "seo_title", "seo_description", "contact_email", "contact_phone", "social_links", "footer_content", "copyright_text", "announcement_bar", "theme_colors"]}
  />
);

export const HomepagePage = () => (
  <SingleEntryEditor
    title="Homepage CMS"
    endpoint="/api/admin/homepage-content"
    responseKey="content"
    fields={["hero_title", "hero_subtitle", "hero_description", "primary_cta_label", "primary_cta_url", "secondary_cta_label", "secondary_cta_url", "hero_media_url", "highlights", "stats", "announcements"]}
  />
);

export const NavigationPage = () => (
  <CollectionManager title="Navigation" endpoint="/api/admin/navigation" fields={["label", "url", "location", "parent_id", "display_order", "is_external", "is_published"]} />
);

export const TeamPage = () => (
  <CollectionManager title="Team Members" endpoint="/api/admin/team-members" fields={["name", "role", "group_name", "email", "phone", "bio", "image_url", "display_order", "is_published"]} />
);

export const FaqPage = () => (
  <CollectionManager title="FAQ" endpoint="/api/admin/faq" fields={["question", "answer", "category", "display_order", "is_published"]} />
);
