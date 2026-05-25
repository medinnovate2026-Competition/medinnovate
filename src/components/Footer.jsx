import { useState } from "react";
import { Camera, ChevronDown, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Why Attend", href: "#prizes" },
  { label: "Who Can Join", href: "#participants" },
  { label: "Judges", href: "#speakers" },
  { label: "Event Flow", href: "#timeline" },
  { label: "FAQ", href: "#faq" },
  { label: "Register", href: "#registration" },
];

const partners = [
  ["GAIMS", "Global Association of Indian Medical Students"],
  ["FAMSA", "Federation of African Medical Students Association"],
  ["Blue Ozone Health", "Blue Ozone Health"],
  ["NIMSA", "Nigerian Medical Students Association"],
];

const instagramUrl = "https://www.instagram.com/medinnovate_26?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

const whatsappContacts = [
  { name: "Girik Subudhi", organization: "GAIMS", phone: "+91 8169011833", href: "https://wa.me/918169011833" },
  { name: "Sofiyullah Salaudeen", organization: "NIMSA", phone: "+234 7038939481", href: "https://wa.me/2347038939481" },
  { name: "Elton M Mahulu", organization: "FAMSA", phone: "+255 628049726", href: "https://wa.me/255628049726" },
  { name: "Ogunka Favour", organization: "Blue Ozone Health", phone: "+234 8052747225", href: "https://wa.me/2348052747225" },
];

const socials = [
  { label: "Instagram", href: instagramUrl, icon: Camera },
  { label: "Email", href: "mailto:medinnovate2026@gmail.com", icon: Mail },
];

function Footer() {
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  return (
    <footer id="footer" className="relative overflow-hidden border-t border-violet-100 bg-[#fbf9ff] px-4 py-14 sm:px-6 lg:px-8">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#EC4899]/10 blur-3xl" />
      <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-[#4F46E5]/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#A855F7]/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mx-auto max-w-7xl"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <section className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_70px_rgba(124,58,237,0.10)] backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-violet-100 bg-white p-1.5 shadow-[0_14px_34px_rgba(124,58,237,0.12)]">
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="MedInnovate Logo" className="h-full w-full object-contain" />
              </div>
              <h2 className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#EC4899] bg-clip-text text-2xl font-black text-transparent">
                MedInnovate
              </h2>
            </div>
            <p className="mt-5 text-base leading-7 text-slate-600">
              A global platform bringing together future healthcare leaders and innovators to solve real-world challenges.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-violet-100 bg-white text-[#7C3AED] shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-200 hover:text-[#EC4899] hover:shadow-[0_14px_34px_rgba(236,72,153,0.14)]"
                >
                  <item.icon size={19} />
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/70 bg-white/72 p-6 shadow-[0_24px_70px_rgba(124,58,237,0.08)] backdrop-blur">
            <h3 className="text-lg font-black text-[#111827]">Quick Links</h3>
            <nav className="mt-5 grid gap-3">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={`${import.meta.env.BASE_URL}${link.href}`}
                  className="group flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-violet-50 hover:text-[#7C3AED]"
                >
                  <span>{link.label}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-200 transition group-hover:bg-[#EC4899]" />
                </a>
              ))}
            </nav>
          </section>

          <section className="rounded-3xl border border-white/70 bg-white/72 p-6 shadow-[0_24px_70px_rgba(124,58,237,0.08)] backdrop-blur">
            <h3 className="text-lg font-black text-[#111827]">Organizers & Partners</h3>
            <div className="mt-5 grid gap-3">
              {partners.map(([name, detail]) => (
                <div key={name} className="rounded-2xl border border-violet-100 bg-white/78 px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-fuchsia-200">
                  <p className="text-sm font-black text-[#111827]">{name}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_70px_rgba(124,58,237,0.10)] backdrop-blur">
            <h3 className="text-lg font-black text-[#111827]">Contact</h3>
            <div className="mt-5 space-y-3 text-sm font-semibold text-slate-600">
              <a href="mailto:medinnovate2026@gmail.com" className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 transition hover:-translate-y-0.5 hover:text-[#7C3AED]">
                <Mail size={17} />
                <span className="break-all">medinnovate2026@gmail.com</span>
              </a>
              <a href={instagramUrl} className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 transition hover:-translate-y-0.5 hover:text-[#EC4899]">
                <Camera size={17} />
                <span>Instagram</span>
              </a>
              <div className="rounded-2xl bg-white/80">
                <button
                  type="button"
                  onClick={() => setWhatsappOpen((current) => !current)}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:-translate-y-0.5 hover:text-[#4F46E5]"
                  aria-expanded={whatsappOpen}
                >
                  <MessageCircle size={17} />
                  <span className="flex-1">WhatsApp support</span>
                  <ChevronDown className={`transition ${whatsappOpen ? "rotate-180" : ""}`} size={16} />
                </button>
                {whatsappOpen && (
                  <div className="grid gap-2 px-3 pb-3">
                    {whatsappContacts.map((contact) => (
                      <a
                        key={contact.phone}
                        href={contact.href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-violet-100 bg-white px-3 py-3 transition hover:-translate-y-0.5 hover:border-fuchsia-200 hover:text-[#7C3AED]"
                      >
                        <span className="block text-sm font-black text-[#111827]">{contact.name}</span>
                        <span className="mt-1 block text-xs font-bold text-slate-500">{contact.organization}</span>
                        <span className="mt-1 block text-xs font-black text-[#7C3AED]">{contact.phone}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <a
              href="mailto:medinnovate2026@gmail.com"
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-6 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(124,58,237,0.22)] transition hover:-translate-y-1"
            >
              Need support? Contact the team
            </a>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-2 rounded-3xl border border-white/70 bg-white/70 px-6 py-5 text-sm font-semibold text-slate-500 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 MedInnovate</p>
          <p>All rights reserved.</p>
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer;
