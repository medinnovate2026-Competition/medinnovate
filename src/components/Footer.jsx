function Footer() {
  return (
    <footer className="border-t border-purple-200/15 bg-[#070314] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-2xl font-black text-white">MedInnovate 2.0</p>
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
