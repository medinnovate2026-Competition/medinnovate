const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Reach', href: '#global' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'FAQ', href: '#faq' },
]

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-purple-300/15 bg-[#09051A]/75 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#hero" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-purple-300/40 bg-purple-400/15 shadow-[0_0_26px_rgba(168,85,247,0.36)] overflow-hidden p-0.5">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="MedInnovate Logo" className="h-full w-full object-contain" />
          </div>
          <span className="font-display text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00dcff] sm:text-lg">
            Medinnovate
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-violet-100/75 transition hover:text-fuchsia-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#registration"
          className="rounded-full bg-gradient-to-r from-fuchsia-300 via-purple-400 to-cyan-300 px-5 py-2 text-sm font-bold text-[#12091F] shadow-[0_0_32px_rgba(168,85,247,0.42)] transition hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(236,72,153,0.42)]"
        >
          Register
        </a>
      </nav>
    </header>
  )
}

export default Navbar
