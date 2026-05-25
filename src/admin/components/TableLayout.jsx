import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";

const rows = [
  ["Innovation Sprint", "Published", "Homepage", "2 min ago"],
  ["Workshop Registration", "Draft", "Workshops", "18 min ago"],
  ["Sponsor Showcase", "Review", "Website", "1 hr ago"],
  ["Judges Panel", "Published", "Competitions", "Today"],
];

function StatusPill({ status }) {
  const styles = {
    Published: "bg-emerald-100 text-emerald-700",
    Draft: "bg-slate-100 text-slate-600",
    Review: "bg-amber-100 text-amber-700",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${styles[status]}`}>{status}</span>;
}

function TableLayout({ title = "Content inventory" }) {
  return (
    <section className="admin-card rounded-[32px] p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-black">{title}</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input className="admin-field h-10 w-52 pl-9 text-sm" placeholder="Search table" />
          </div>
          <button className="admin-icon-button h-10 w-10" aria-label="Filter table">
            <Filter size={16} />
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-[26px] border border-violet-100/80 bg-white/60">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-[#f5f2ff] text-xs uppercase tracking-[0.16em] text-[#9b93b4]">
            <tr>
              {["Title", "Status", "Area", "Updated"].map((head) => <th key={head} className="px-5 py-4">{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-violet-100/70">
                <td className="px-5 py-4 font-black text-[#454083]">{row[0]}</td>
                <td className="px-5 py-4"><StatusPill status={row[1]} /></td>
                <td className="px-5 py-4 text-slate-500">{row[2]}</td>
                <td className="px-5 py-4 text-slate-400">{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-400">Showing 4 of 24</p>
        <div className="flex gap-2">
          <button className="admin-icon-button h-10 w-10"><ChevronLeft size={17} /></button>
          <button className="admin-icon-button h-10 w-10"><ChevronRight size={17} /></button>
        </div>
      </div>
    </section>
  );
}

export default TableLayout;
