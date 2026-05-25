import { Sparkles } from "lucide-react";

function EmptyState({ title = "Nothing here yet", description = "Create your first item to start shaping this CMS section.", actionLabel = "Create item", icon: Icon = Sparkles }) {
  return (
    <div className="admin-card grid place-items-center rounded-[32px] p-10 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-violet-100 text-violet-700">
        <Icon size={26} />
      </div>
      <h3 className="mt-5 text-2xl font-black text-[#514aa3]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      <button className="mt-6 rounded-2xl bg-[#5d55b9] px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200">
        {actionLabel}
      </button>
    </div>
  );
}

export default EmptyState;
