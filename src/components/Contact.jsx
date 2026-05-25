const contacts = [
  { label: 'Email', value: 'support@medinnovate.global', href: 'mailto:support@medinnovate.global' },
  { label: 'WhatsApp', value: '+91 00000 00000', href: 'https://wa.me/910000000000' },
  { label: 'Instagram', value: '@medinnovate_26', href: 'https://www.instagram.com/medinnovate_26?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
]

function Contact() {
  return (
    <section id="contact" className="bg-[#100821] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-fuchsia-200">Contact & support</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Need help with registration or participation?
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {contacts.map((contact) => (
              <a key={contact.label} href={contact.href} className="rounded-[1.75rem] border border-white/15 bg-white/10 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/14">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-fuchsia-200">{contact.label}</p>
                <p className="mt-4 break-words text-sm text-white/72">{contact.value}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
