function FormCard({ title = "Editor", description = "Reusable CMS form surface.", children }) {
  return (
    <section className="admin-card rounded-[32px] p-6">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">Form</p>
        <h3 className="mt-1 text-2xl font-black text-[#514aa3]">{title}</h3>
        {description && <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

export default FormCard;
