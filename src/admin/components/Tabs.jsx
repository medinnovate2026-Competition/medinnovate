function Tabs({ tabs = ["Content", "Design", "SEO"], active = "Content", onChange }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[24px] bg-white/60 p-2">
      {tabs.map((tab) => {
        const selected = tab === active;
        return (
          <button
            key={tab}
            onClick={() => onChange?.(tab)}
            className={`rounded-2xl px-4 py-2 text-sm font-black transition ${selected ? "bg-[#5d55b9] text-white shadow-lg shadow-violet-200" : "text-[#7b718f] hover:bg-white"}`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
