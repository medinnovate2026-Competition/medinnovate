function Hero() {
  return (
    <section id="hero" className="relative min-h-screen px-4 pt-28 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-24 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-fuchsia-300/70 to-transparent" />
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="text-center lg:text-left">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.24em] text-fuchsia-100 shadow-[0_0_34px_rgba(236,72,153,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-200 shadow-[0_0_16px_rgba(244,114,182,0.9)]" />
            <span>Global Participation</span>
          </div>

          <h1 className="font-display animate-[gradient-shift_4s_ease-in-out_infinite] bg-[length:200%_auto] bg-gradient-to-r from-white via-[#00dcff] to-white bg-clip-text text-6xl font-black leading-[0.92] tracking-tight text-transparent drop-shadow-[0_0_28px_rgba(0,220,255,0.25)] sm:text-8xl lg:text-9xl">
            MedInnovate 2.0
          </h1>
          <p className="mt-6 text-xl font-semibold tracking-wide text-fuchsia-100 sm:text-2xl">
            International Healthcare Innovation Hackathon
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-violet-100/75 sm:text-lg lg:mx-0">
            Build practical healthcare solutions with global mentors, clinical
            insight, and cross-border teams.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <a
              href="#registration"
              className="w-full rounded-full bg-gradient-to-r from-fuchsia-300 via-purple-400 to-cyan-300 px-8 py-4 text-center text-sm font-black uppercase tracking-wide text-[#12091F] shadow-[0_0_42px_rgba(168,85,247,0.42)] transition hover:-translate-y-1 hover:shadow-[0_0_54px_rgba(236,72,153,0.45)] sm:w-auto"
            >
              Register Now
            </a>
            <a
              href="#registration"
              className="w-full rounded-full border border-purple-200/25 bg-white/5 px-8 py-4 text-center text-sm font-black uppercase tracking-wide text-[#F5F0FF] backdrop-blur transition hover:-translate-y-1 hover:border-fuchsia-300 hover:text-fuchsia-100 sm:w-auto"
            >
              Submit Idea
            </a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-violet-100/75 lg:justify-start">
            <span className="rounded-full border border-purple-200/15 bg-white/5 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              Date: Announcing Soon
            </span>
            <span className="rounded-full border border-purple-200/15 bg-white/5 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              Mode: Online / Hybrid
            </span>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {['Global mentors', 'Clinical review', 'Premium pitch stage'].map((item) => (
              <div key={item} className="rounded-2xl border border-purple-200/15 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-violet-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-lg rounded-[2.5rem] border border-purple-200/15 bg-white/[0.035] p-6 shadow-[0_40px_120px_rgba(10,5,30,0.55),0_0_80px_rgba(168,85,247,0.18)] backdrop-blur">
          <div className="absolute inset-0 rounded-full border border-purple-300/20 bg-[radial-gradient(circle,rgba(168,85,247,0.22),transparent_62%)] shadow-[0_0_100px_rgba(168,85,247,0.22)]" />
          <div className="absolute inset-10 rounded-full border border-fuchsia-300/25" />
          <div className="absolute inset-20 rounded-full border border-cyan-300/20" />
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-500 opacity-80 blur-2xl" />
          <div className="absolute inset-8 rounded-full bg-[linear-gradient(90deg,transparent_48%,rgba(168,85,247,0.42)_49%,rgba(168,85,247,0.42)_51%,transparent_52%),linear-gradient(0deg,transparent_48%,rgba(236,72,153,0.3)_49%,rgba(236,72,153,0.3)_51%,transparent_52%)]" />
          <div className="absolute left-[18%] top-[28%] rounded-full border border-purple-300/40 bg-[#09051A] px-4 py-2 text-xs font-bold text-purple-100 shadow-[0_0_28px_rgba(168,85,247,0.32)]">
            AI Care
          </div>
          <div className="absolute right-[9%] top-[44%] rounded-full border border-fuchsia-300/40 bg-[#09051A] px-4 py-2 text-xs font-bold text-fuchsia-100 shadow-[0_0_28px_rgba(236,72,153,0.3)]">
            Public Health
          </div>
          <div className="absolute bottom-[22%] left-[24%] rounded-full border border-cyan-300/35 bg-[#09051A] px-4 py-2 text-xs font-bold text-cyan-100 shadow-[0_0_26px_rgba(34,211,238,0.18)]">
            MedTech
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
