function Footer() {
  return (
    <footer className="border-t border-purple-200/15 bg-[#070314] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-purple-300/40 bg-purple-400/15 shadow-[0_0_26px_rgba(168,85,247,0.36)] overflow-hidden p-0.5">
              <img src="https://i.postimg.cc/ht3sjmj4/Medinnovate-Logo.png" alt="MedInnovate Logo" className="h-full w-full object-contain" />
            </div>
            <p className="font-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00dcff]">Medinnovate</p>
          </div>
          <p className="mt-2 text-sm text-slate-400">Credits: GAIMS</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-slate-400">
          <a href="#contact" className="transition hover:text-fuchsia-200">Social links</a>
          <a href="#footer" className="transition hover:text-fuchsia-200">Terms & Conditions</a>
          <a href="#footer" className="transition hover:text-fuchsia-200">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
