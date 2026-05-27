import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Flag, Home, Menu, Send, X } from 'lucide-react'

const CURRENT_PHASE = 'PHASE 1'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Reach', href: '#global' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'Competition', href: '#competition' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Judges', href: '#judges' },
  { label: 'FAQ', href: '#faq' },
]

function Navbar() {
  const [moreOpen, setMoreOpen] = useState(false)

  const closeMore = () => setMoreOpen(false)
  const scrollToSection = (event, href) => {
    event.preventDefault()
    closeMore()

    const target = document.querySelector(href)
    if (!target) return

    window.history.pushState(null, '', `${window.location.pathname}${href}`)
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY,
      behavior: 'smooth',
    })
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 hidden px-3 pt-3 sm:px-5 lg:block">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/85 px-4 shadow-[0_18px_70px_rgba(124,58,237,0.14)] backdrop-blur-2xl sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-2xl border border-violet-100 bg-white p-1 shadow-[0_0_26px_rgba(236,72,153,0.18)]">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="MedInnovate Logo" className="h-full w-full object-contain" />
            </div>
            <span className="truncate bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#EC4899] bg-clip-text text-base font-black tracking-tight text-transparent sm:text-lg">
              Medinnovate
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              link.to ? (
                <Link key={link.to} to={link.to} className="text-sm font-semibold text-slate-700 transition hover:text-[#A855F7]">
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} onClick={(event) => scrollToSection(event, link.href)} className="text-sm font-semibold text-slate-700 transition hover:text-[#A855F7]">
                  {link.label}
                </a>
              )
            ))}
            <Link to="/organising-committee" className="text-sm font-semibold text-slate-700 transition hover:text-[#A855F7]">
              Organising Committee
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED] shadow-sm">
              Current Phase: {CURRENT_PHASE}
            </div>
            <Link
              to="/registration"
              className="rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-5 py-2.5 text-sm font-black text-white shadow-[0_12px_34px_rgba(168,85,247,0.28)] transition hover:-translate-y-0.5"
            >
              Submit Idea
            </Link>
          </div>
        </nav>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 lg:hidden">
        {moreOpen && (
          <div className="mb-3 rounded-[28px] border border-white/80 bg-white/95 p-3 shadow-[0_18px_70px_rgba(124,58,237,0.18)] backdrop-blur-2xl">
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7C3AED]">Menu</p>
              <button type="button" onClick={closeMore} className="grid h-9 w-9 place-items-center rounded-full bg-violet-50 text-[#7C3AED]" aria-label="Close menu">
                <X size={17} />
              </button>
            </div>
            <div className="grid gap-2">
              {navLinks.map((link) => (
                link.to ? (
                  <Link key={link.to} to={link.to} onClick={closeMore} className="rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-violet-50 hover:text-[#7C3AED]">
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.href} href={link.href} onClick={(event) => scrollToSection(event, link.href)} className="rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-violet-50 hover:text-[#7C3AED]">
                    {link.label}
                  </a>
                )
              ))}
              <Link to="/organising-committee" onClick={closeMore} className="rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-violet-50 hover:text-[#7C3AED]">
                Organising Committee
              </Link>
            </div>
          </div>
        )}

        <div className="mx-auto grid max-w-md grid-cols-4 items-center gap-2 rounded-[28px] border border-white/80 bg-white/92 p-2 shadow-[0_18px_70px_rgba(124,58,237,0.22)] backdrop-blur-2xl">
          <Link to="/" onClick={closeMore} className="grid min-h-14 place-items-center rounded-3xl text-[#5d55b9] transition hover:bg-violet-50" aria-label="Home">
            <Home size={23} />
            <span className="mt-1 text-[10px] font-black uppercase tracking-wide">Home</span>
          </Link>
          <div className="grid min-h-14 place-items-center rounded-3xl border border-violet-100 bg-violet-50/70 text-[#7C3AED]" aria-label={`Current phase ${CURRENT_PHASE}`}>
            <Flag size={21} />
            <span className="mt-1 text-[10px] font-black uppercase tracking-wide">Phase 1</span>
          </div>
          <button type="button" onClick={() => setMoreOpen((current) => !current)} className="grid min-h-14 place-items-center rounded-3xl text-[#5d55b9] transition hover:bg-violet-50" aria-expanded={moreOpen} aria-label="More navigation options">
            <Menu size={24} />
            <span className="mt-1 text-[10px] font-black uppercase tracking-wide">More</span>
          </button>
          <Link to="/registration" onClick={closeMore} className="grid min-h-14 place-items-center rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white shadow-[0_12px_34px_rgba(168,85,247,0.28)]" aria-label="Submit idea">
            <Send size={22} />
            <span className="mt-1 text-[10px] font-black uppercase tracking-wide">Submit</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar
