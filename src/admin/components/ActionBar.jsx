function ActionBar({ children }) {
  return (
    <div className="admin-card flex flex-wrap items-center justify-between gap-3 rounded-[28px] p-4">
      <div className="text-sm font-black uppercase tracking-[0.18em] text-[#9b93b4]">Actions</div>
      <div className="flex flex-wrap gap-2">
        {children || (
          <>
            <button className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-[#6250aa] shadow-sm">Save draft</button>
            <button className="rounded-2xl bg-[#5d55b9] px-4 py-2 text-sm font-black text-white shadow-lg shadow-violet-200">Publish</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ActionBar;
