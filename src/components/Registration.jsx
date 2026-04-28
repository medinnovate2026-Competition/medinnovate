const paymentMethods = ['UPI', 'International payment']

function Registration() {
  return (
    <section id="registration" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-fuchsia-300/25 bg-gradient-to-br from-fuchsia-400/15 via-white/[0.05] to-purple-500/15 p-8 text-center shadow-[0_0_90px_rgba(168,85,247,0.18)] sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200">
          Registration & pricing
        </p>
        <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
          Join the global innovation sprint.
        </h2>
        <div className="mx-auto mt-8 max-w-md rounded-3xl border border-purple-200/15 bg-[#09051A]/80 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Fee</p>
          <p className="mt-2 font-display text-6xl font-black text-white">$5</p>
          <p className="mt-2 text-sm text-slate-400">+ INR equivalent</p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {paymentMethods.map((method) => (
            <span key={method} className="rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-4 py-2 text-sm font-semibold text-fuchsia-100">
              {method}
            </span>
          ))}
        </div>

        <p className="mt-8 text-slate-300">
          Deadline: Announcing soon. Limited slots available for shortlisted mentorship.
        </p>
        <a
          href="mailto:register@medinnovate.global?subject=MedInnovate%202.0%20Registration"
          className="mt-8 inline-flex rounded-full bg-gradient-to-r from-fuchsia-300 via-purple-400 to-cyan-300 px-9 py-4 text-sm font-black uppercase tracking-wide text-[#12091F] shadow-[0_0_42px_rgba(168,85,247,0.42)] transition hover:-translate-y-1"
        >
          Register Now
        </a>
      </div>
    </section>
  )
}

export default Registration
