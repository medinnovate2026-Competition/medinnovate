const aboutCards = [
  {
    title: 'What is MedInnovate?',
    body: 'A global healthcare innovation hackathon where ideas become clinically relevant solutions.',
  },
  {
    title: 'Who is it for?',
    body: 'Medical, technology, public health, design, business, and social science learners and professionals.',
  },
  {
    title: 'Why it matters',
    body: 'The event focuses on practical innovation for real healthcare access, quality, and delivery challenges.',
  },
]

function About() {
  return (
    <section id="about" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200">
            About the event
          </p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
            Healthcare problems need multidisciplinary builders.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {aboutCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.75rem] border border-purple-200/15 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-7 shadow-2xl shadow-purple-950/30 backdrop-blur transition hover:-translate-y-1 hover:border-fuchsia-300/45 hover:bg-white/[0.1] hover:shadow-[0_0_40px_rgba(168,85,247,0.16)]"
            >
              <h3 className="font-display text-2xl font-black text-white">{card.title}</h3>
              <p className="mt-4 leading-7 text-slate-300">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
