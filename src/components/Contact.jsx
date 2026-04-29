const contacts = [
  { label: 'Email', value: 'support@medinnovate.global', href: 'mailto:support@medinnovate.global' },
  { label: 'WhatsApp', value: '+91 00000 00000', href: 'https://wa.me/910000000000' },
  { label: 'Instagram', value: '@medinnovate.global', href: 'https://instagram.com/' },
]

function Contact() {
  return (
    <section id="contact" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-fuchsia-200">
              Contact & support
            </p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00dcff] sm:text-6xl">
              Need help with registration or participation?
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {contacts.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                className="rounded-3xl border border-purple-200/15 bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-fuchsia-300/45 hover:shadow-[0_0_34px_rgba(168,85,247,0.16)]"
              >
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-fuchsia-200">
                  {contact.label}
                </p>
                <p className="mt-4 break-words text-sm text-slate-300">{contact.value}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
