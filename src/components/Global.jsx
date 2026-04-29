const stats = [
  { value: '20+', label: 'Placeholder countries' },
  { value: '5', label: 'Regional collaboration tracks' },
  { value: 'Africa+', label: 'Focused partnership network' },
]

function Global() {
  return (
    <section id="global" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200">
            International reach
          </p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00dcff] sm:text-6xl">
            Collaborate beyond borders.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            MedInnovate 2.0 is designed for international partnerships, Africa
            collaboration, and global participation across healthcare systems,
            cultures, and disciplines.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-purple-200/15 bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <p className="font-display text-4xl font-black text-fuchsia-200">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-80 overflow-hidden rounded-[2rem] border border-fuchsia-300/20 bg-[#09051A] p-6 shadow-[0_0_80px_rgba(168,85,247,0.18)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(168,85,247,0.3),transparent_9%),radial-gradient(circle_at_55%_35%,rgba(236,72,153,0.22),transparent_8%),radial-gradient(circle_at_72%_54%,rgba(34,211,238,0.2),transparent_10%),radial-gradient(circle_at_42%_66%,rgba(168,85,247,0.18),transparent_8%)]" />
          <div className="absolute inset-8 rounded-full border border-fuchsia-300/20" />
          <div className="absolute inset-16 rounded-full border border-purple-300/25" />
          <div className="relative z-10 flex h-full min-h-72 flex-col justify-end">
            <div className="rounded-3xl border border-purple-200/15 bg-[#09051A]/75 p-6 backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-fuchsia-200">
                Global network
              </p>
              <p className="mt-3 font-display text-3xl font-black text-white">
                Africa collaboration + worldwide teams
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Global
