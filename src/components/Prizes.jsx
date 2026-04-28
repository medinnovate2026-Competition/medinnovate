const benefits = [
  { title: 'Cash prizes', detail: 'Awards for the strongest healthcare innovation pitches.' },
  { title: 'Certificates', detail: 'Participation and finalist recognition for portfolios.' },
  { title: 'Networking', detail: 'Connect with mentors, judges, peers, and collaborators.' },
  { title: 'Exposure / internships', detail: 'Visibility for teams seeking pilots and opportunities.' },
]

function Prizes() {
  return (
    <section id="prizes" className="bg-[#120A2A]/80 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200">
            Prizes & benefits
          </p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
            More than a competition.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="rounded-3xl border border-fuchsia-300/20 bg-fuchsia-300/[0.07] p-7 shadow-[0_0_40px_rgba(168,85,247,0.12)] transition hover:-translate-y-1 hover:border-fuchsia-300/55 hover:shadow-[0_0_48px_rgba(236,72,153,0.2)]"
            >
              <div className="mb-6 h-1 w-14 rounded-full bg-gradient-to-r from-fuchsia-300 to-cyan-300" />
              <h3 className="font-display text-2xl font-black text-white">{benefit.title}</h3>
              <p className="mt-4 leading-7 text-slate-300">{benefit.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Prizes
