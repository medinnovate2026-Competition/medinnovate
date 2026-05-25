import { useMemo, useState } from "react";
import { File, FileImage, Film, Grid2X2, Image, List, MoreHorizontal, Search, UploadCloud, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const mediaTypes = {
  image: { icon: Image, label: "Image", color: "from-violet-100 to-white" },
  pdf: { icon: File, label: "PDF", color: "from-rose-100 to-white" },
  logo: { icon: FileImage, label: "Logo", color: "from-cyan-100 to-white" },
  banner: { icon: FileImage, label: "Banner", color: "from-fuchsia-100 to-white" },
  video: { icon: Film, label: "Video", color: "from-amber-100 to-white" },
};

const initialMedia = [
  { id: 1, name: "hero-healthcare-innovation.png", type: "banner", date: "Today", status: "Published" },
  { id: 2, name: "speaker-panel.jpg", type: "image", date: "Yesterday", status: "Review" },
  { id: 3, name: "sponsor-logo.svg", type: "logo", date: "Jan 18", status: "Published" },
  { id: 4, name: "competition-brochure.pdf", type: "pdf", date: "Jan 16", status: "Draft" },
  { id: 5, name: "opening-session.mp4", type: "video", date: "Jan 12", status: "Published" },
  { id: 6, name: "workshop-banner.png", type: "banner", date: "Jan 9", status: "Draft" },
];

function UploadZone() {
  return (
    <div className="rounded-[30px] border border-dashed border-violet-200 bg-violet-50/70 p-6 text-center">
      <UploadCloud className="mx-auto text-violet-600" size={30} />
      <p className="mt-3 text-sm font-black text-[#514aa3]">Drop files to upload</p>
      <p className="mt-1 text-xs font-semibold text-slate-400">Images, PDFs, logos, banners, and videos</p>
    </div>
  );
}

function MediaCard({ item, selected, onSelect }) {
  const TypeIcon = mediaTypes[item.type]?.icon || FileImage;
  const color = mediaTypes[item.type]?.color || "from-violet-100 to-white";

  return (
    <button
      onClick={() => onSelect(item)}
      className={`break-inside-avoid rounded-[28px] border p-3 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        selected ? "border-violet-400 bg-white" : "border-white/80 bg-white/72"
      }`}
    >
      <div className={`grid aspect-[4/3] place-items-center rounded-[24px] bg-gradient-to-br ${color} text-[#5d55b9]`}>
        <TypeIcon size={38} />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-[#514aa3]">{item.name}</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">{mediaTypes[item.type]?.label} · {item.date}</p>
        </div>
        <MoreHorizontal className="shrink-0 text-slate-400" size={18} />
      </div>
      <div className="mt-3">
        <StatusBadge status={item.status} />
      </div>
    </button>
  );
}

function MediaPreviewDrawer({ item, onClose }) {
  if (!item) return null;
  const TypeIcon = mediaTypes[item.type]?.icon || FileImage;
  return (
    <aside className="admin-card rounded-[32px] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-black text-[#514aa3]">Preview</h3>
        <button onClick={onClose} className="admin-icon-button h-10 w-10" aria-label="Close preview"><X size={17} /></button>
      </div>
      <div className="grid aspect-[4/3] place-items-center rounded-[28px] bg-gradient-to-br from-violet-100 to-white text-violet-700">
        <TypeIcon size={54} />
      </div>
      <p className="mt-5 text-lg font-black text-[#514aa3]">{item.name}</p>
      <p className="mt-2 text-sm font-semibold text-slate-400">{mediaTypes[item.type]?.label} · {item.date}</p>
      <div className="mt-4"><StatusBadge status={item.status} /></div>
    </aside>
  );
}

function MediaGrid({ items, selected, onSelect }) {
  if (!items.length) {
    return <div className="admin-card rounded-[32px] p-10 text-center text-sm font-bold text-slate-500">No media found.</div>;
  }
  return (
    <div className="columns-1 gap-4 space-y-4 sm:columns-2 xl:columns-3">
      {items.map((item) => <MediaCard key={item.id} item={item} selected={selected?.id === item.id} onSelect={onSelect} />)}
    </div>
  );
}

function MediaLibraryPage() {
  const [items] = useState(initialMedia);
  const [selected, setSelected] = useState(initialMedia[0]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const filtered = useMemo(() => items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) && (type === "all" || item.type === type)
  ), [items, query, type]);

  return (
    <>
      <PageHeader title="Media Library" eyebrow="Media" description="Organize visual assets, documents, logos, banners, and video placeholders with mock state only." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="grid gap-5">
          <section className="admin-card flex flex-wrap items-center gap-3 rounded-[32px] p-4">
            <div className="relative min-w-64 flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="admin-field pl-12" placeholder="Search media..." />
            </div>
            <select value={type} onChange={(event) => setType(event.target.value)} className="admin-field max-w-44">
              <option value="all">All types</option>
              {Object.keys(mediaTypes).map((key) => <option key={key} value={key}>{mediaTypes[key].label}</option>)}
            </select>
            <button className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#6250aa] shadow-sm">Filter</button>
            <button className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#6250aa] shadow-sm"><Grid2X2 className="inline" size={17} /></button>
            <button className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#6250aa] shadow-sm"><List className="inline" size={17} /></button>
            <button className="rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200">Upload</button>
          </section>
          <UploadZone />
          <MediaGrid items={filtered} selected={selected} onSelect={setSelected} />
        </main>
        <MediaPreviewDrawer item={selected} onClose={() => setSelected(null)} />
      </div>
    </>
  );
}

export default MediaLibraryPage;
