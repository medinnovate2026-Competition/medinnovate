import { Eye, Smartphone } from "lucide-react";

function PreviewPanel({ title = "Live preview" }) {
  return (
    <aside className="admin-card rounded-[32px] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">Preview</p>
          <h3 className="mt-1 text-xl font-black">{title}</h3>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-violet-700">
          <Eye size={20} />
        </span>
      </div>
      <div className="rounded-[28px] border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-4">
        <div className="rounded-[24px] bg-slate-950 p-3 shadow-2xl">
          <div className="mb-3 flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <div className="rounded-[20px] bg-gradient-to-br from-violet-100 via-white to-cyan-50 p-5">
            <div className="h-4 w-24 rounded-full bg-violet-200" />
            <div className="mt-4 h-8 w-4/5 rounded-full bg-slate-900/80" />
            <div className="mt-3 h-3 w-full rounded-full bg-slate-300" />
            <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-200" />
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((item) => <div key={item} className="h-20 rounded-2xl bg-white shadow-sm" />)}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-500">
          <Smartphone size={16} />
          Responsive preview placeholder
        </div>
      </div>
    </aside>
  );
}

export default PreviewPanel;
