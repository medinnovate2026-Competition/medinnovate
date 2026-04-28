const steps = [
  'Registration',
  'Idea Submission',
  'Screening / Shortlisting',
  'Mentorship',
  'Final Pitch',
]

function Timeline() {
  return (
    <section id="timeline" className="bg-[#120A2A]/80 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200">
            Event structure
          </p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
            A clear path from idea to pitch.
          </h2>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-5">
          {steps.map((step, index) => (
            <article key={step} className="relative rounded-3xl border border-purple-200/15 bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-6 shadow-2xl shadow-purple-950/20 transition hover:-translate-y-1 hover:border-fuchsia-300/40">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-black text-fuchsia-200">
                  0{index + 1}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-fuchsia-300/70 to-transparent" />
              </div>
              <h3 className="text-lg font-bold text-white">{step}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Structured milestone with clear instructions, review, and support.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Timeline
