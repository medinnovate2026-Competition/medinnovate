import { SlidersHorizontal } from "lucide-react";

const defaultFilters = ["Status", "Section", "Owner", "Date"];

function FilterBar({ filters = defaultFilters }) {
  return (
    <div className="admin-card flex flex-wrap items-center gap-3 rounded-[28px] p-4">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-violet-700">
        <SlidersHorizontal size={18} />
      </div>
      {filters.map((filter) => (
        <button key={filter} className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-[#6250aa] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          {filter}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
