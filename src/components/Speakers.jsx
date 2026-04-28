const speakers = [
  {
    name: 'Dr. Amina Okoro',
    designation: 'Public Health Innovation Lead',
    credibility: 'Advises digital health programs across Africa.',
  },
  {
    name: 'Prof. Rohan Mehta',
    designation: 'Clinical AI Researcher',
    credibility: 'Builds translational AI systems for hospitals.',
  },
  {
    name: 'Dr. Elena Park',
    designation: 'MedTech Strategy Advisor',
    credibility: 'Guides early-stage healthcare product validation.',
  },
  {
    name: 'Nadia Silva',
    designation: 'Healthcare Design Principal',
    credibility: 'Specialist in accessible patient-centered services.',
  },
]

function Speakers() {
  return (
    <section id="speakers" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200">
            Speakers / Judges
          </p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
            Guided by credible health innovation voices.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((speaker) => (
            <article
              key={speaker.name}
              className="rounded-3xl border border-purple-200/15 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-7 text-center transition hover:-translate-y-1 hover:border-fuchsia-300/45 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]"
            >
              <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full border border-fuchsia-300/30 bg-gradient-to-br from-fuchsia-400/25 to-violet-500/20 text-2xl font-black text-white shadow-[0_0_34px_rgba(168,85,247,0.2)]">
                {speaker.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </div>
              <h3 className="font-display text-2xl font-black text-white">{speaker.name}</h3>
              <p className="mt-2 text-sm font-semibold text-fuchsia-200">{speaker.designation}</p>
              <p className="mt-4 text-sm leading-6 text-slate-400">{speaker.credibility}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Speakers
