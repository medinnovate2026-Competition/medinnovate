import { Bold, Italic, Link, List, Quote } from "lucide-react";

const tools = [
  { label: "Bold", icon: Bold },
  { label: "Italic", icon: Italic },
  { label: "List", icon: List },
  { label: "Quote", icon: Quote },
  { label: "Link", icon: Link },
];

function RichTextEditor({ label = "Body content", value = "Write polished MedInnovate CMS copy here..." }) {
  return (
    <div className="rounded-[28px] border border-violet-100 bg-white/70 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-black text-[#514aa3]">{label}</p>
        <div className="flex gap-2">
          {tools.map((tool) => (
            <button key={tool.label} className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-700" title={tool.label}>
              <tool.icon size={16} />
            </button>
          ))}
        </div>
      </div>
      <textarea className="admin-field min-h-44 rounded-[22px]" defaultValue={value} />
    </div>
  );
}

export default RichTextEditor;
