const variants = {
  published: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  active: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  draft: "bg-slate-100 text-slate-600 ring-slate-200",
  review: "bg-amber-100 text-amber-700 ring-amber-200",
  pending: "bg-violet-100 text-violet-700 ring-violet-200",
  archived: "bg-rose-100 text-rose-700 ring-rose-200",
};

function StatusBadge({ status = "Draft" }) {
  const key = String(status).toLowerCase();
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-black ring-1 ${variants[key] || variants.pending}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
