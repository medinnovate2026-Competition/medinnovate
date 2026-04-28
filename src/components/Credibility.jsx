const credibility = [
  { value: '1,000+', label: 'Past participants and community reach' },
  { value: 'GAIMS', label: 'Organizing credibility and academic network' },
  { value: 'Global', label: 'Cross-border healthcare innovation focus' },
]

function Credibility() {
  return (
    <section id="credibility" className="bg-[#120A2A]/80 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200">
            Past events / credibility
          </p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
            Built on a growing innovation ecosystem.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {credibility.map((item) => (
            <article key={item.value} className="rounded-3xl border border-purple-200/15 bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-8 text-center shadow-2xl shadow-purple-950/20">
              <p className="font-display text-5xl font-black text-fuchsia-200">{item.value}</p>
              <p className="mt-4 leading-7 text-slate-300">{item.label}</p>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-fuchsia-300/25 bg-fuchsia-300/10 p-6 text-center text-violet-100/80 shadow-[0_0_36px_rgba(168,85,247,0.12)]">
          "A practical platform for students and young professionals to test
          healthcare ideas with real-world relevance."
        </div>
      </div>
    </section>
  )
}

export default Credibility
