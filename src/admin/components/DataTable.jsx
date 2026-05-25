import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import StatusBadge from "./StatusBadge";

const defaultColumns = [
  { key: "title", label: "Title" },
  { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
  { key: "section", label: "Section" },
  { key: "updated", label: "Updated" },
];

const defaultRows = [
  { id: 1, title: "Homepage hero", status: "Published", section: "Website", updated: "Today" },
  { id: 2, title: "Workshop spotlight", status: "Draft", section: "Workshops", updated: "Yesterday" },
  { id: 3, title: "Competition FAQ", status: "Review", section: "Competitions", updated: "2 days ago" },
];

function DataTable({ columns = defaultColumns, rows = defaultRows, title = "CMS records" }) {
  return (
    <section className="admin-card rounded-[32px] p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-black text-[#514aa3]">{title}</h3>
        <button className="admin-icon-button h-10 w-10" aria-label="Table actions">
          <MoreHorizontal size={18} />
        </button>
      </div>
      <div className="overflow-hidden rounded-[26px] border border-violet-100/80 bg-white/70">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-[#f5f2ff] text-xs uppercase tracking-[0.16em] text-[#9b93b4]">
            <tr>
              {columns.map((column) => <th key={column.key} className="px-5 py-4">{column.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id || row.title} className="border-t border-violet-100/70">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 text-slate-500">
                    {column.render ? column.render(row[column.key], row) : <span className={column.key === "title" ? "font-black text-[#454083]" : ""}>{row[column.key]}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-400">Showing {rows.length} records</p>
        <div className="flex gap-2">
          <button className="admin-icon-button h-10 w-10"><ChevronLeft size={17} /></button>
          <button className="admin-icon-button h-10 w-10"><ChevronRight size={17} /></button>
        </div>
      </div>
    </section>
  );
}

export default DataTable;
