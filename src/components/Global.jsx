import { motion } from "framer-motion"

const partners = [
  {
    name: 'GAIMS',
    detail: 'Global Association of Indian Medical Students',
    logo: 'https://i.postimg.cc/Jh52t0p1/GAIMS-(2).png',
    href: 'https://www.gaims.org',
  },
  {
    name: 'FAMSA',
    detail: 'Federation of African Medical Students Association',
    logo: 'https://i.postimg.cc/DwMzHfrz/FAMSA.jpg',
    href: 'https://famsanet.org/',
  },
  {
    name: 'Blue Ozone Health',
    detail: 'Blue Ozone Health',
    logo: 'https://i.postimg.cc/j5zdDzBp/Blue-Ozone.png',
    href: '',
  },
  {
    name: 'NIMSA',
    detail: 'Nigerian Medical Students Association',
    logo: 'https://i.postimg.cc/x83C4KR3/NIMSA.png',
    href: 'https://www.nimsa.ng/',
  },
]

function Global() {
  return (
    <motion.section
      id="global"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden bg-white px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="absolute left-0 top-10 h-56 w-56 rounded-full bg-[#EC4899]/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#7C3AED]/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Partners</p>
        <h2 className="mt-5 text-4xl font-black tracking-tight text-[#111827] sm:text-6xl">
          Collaboration Between
        </h2>
        <p className="mt-7 text-xl text-slate-600 sm:text-2xl">
          Supported by global organizations driving healthcare innovation.
        </p>

        <div className="mx-auto mt-16 grid max-w-5xl gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner) => {
            const CardTag = partner.href ? 'a' : 'article'
            const cardProps = partner.href
              ? { href: partner.href, target: '_blank', rel: 'noreferrer' }
              : {}

            return (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              whileHover={{ y: -6 }}
            >
            <CardTag {...cardProps} className="group block h-full rounded-3xl border border-violet-100 bg-white/85 p-8 shadow-[0_18px_55px_rgba(124,58,237,0.08)] transition hover:border-fuchsia-200 hover:shadow-[0_28px_80px_rgba(236,72,153,0.16)]">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-fuchsia-50 shadow-sm transition group-hover:scale-105">
                <img src={partner.logo} alt={`${partner.name} logo`} className="h-14 w-14 object-contain" />
              </div>
              <h3 className="mt-7 text-lg font-black text-[#111827]">{partner.name}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{partner.detail}</p>
            </CardTag>
            </motion.div>
          )})}
        </div>
      </div>
    </motion.section>
  )
}

export default Global
