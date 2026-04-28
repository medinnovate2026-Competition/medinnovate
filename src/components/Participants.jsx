const participants = [
  'Medical students',
  'Public health graduates',
  'Engineers & designers',
  'Social science professionals',
  'Interns / young professionals',
]

function Participants() {
  return (
    <section id="participants" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200">
            Who can participate
          </p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
            Open to builders across health, tech, and society.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {participants.map((item) => (
            <article
              key={item}
              className="rounded-3xl border border-purple-200/15 bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-6 text-center transition hover:-translate-y-1 hover:border-fuchsia-300/50 hover:shadow-[0_0_38px_rgba(168,85,247,0.2)]"
            >
              <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-400/25 to-purple-400/20 text-lg font-black text-fuchsia-100">
                +
              </div>
              <h3 className="font-bold text-white">{item}</h3>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 rounded-3xl border border-fuchsia-300/25 bg-fuchsia-300/10 p-5 text-center text-sm font-semibold text-fuchsia-100 shadow-[0_0_34px_rgba(236,72,153,0.12)] sm:flex-row sm:justify-center">
          <span>Solo + team participation allowed</span>
          <span className="hidden text-fuchsia-200/50 sm:block">|</span>
          <span>Beginner-friendly format</span>
        </div>
      </div>
    </section>
  )
}

export default Participants
