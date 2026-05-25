import { Search } from "lucide-react";

function SearchBar({ value = "", onChange, placeholder = "Search CMS content..." }) {
  return (
    <div className="relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9b93b4]" size={18} />
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="admin-field h-12 pl-12 text-sm"
      />
    </div>
  );
}

export default SearchBar;
