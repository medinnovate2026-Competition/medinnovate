import { NavLink } from "react-router-dom";
import {
  Activity,
  BadgePercent,
  BarChart3,
  Crown,
  Gauge,
  GraduationCap,
  Globe2,
  Gavel,
  Home,
  Layers3,
  Menu,
  MessageCircle,
  Mic2,
  Settings,
  Users,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { label: "MASTER CMS", to: "/admin/master-cms", icon: Crown },
  { label: "Dashboard", to: "/admin/dashboard", icon: Gauge },
  { label: "Website", to: "/admin/master-cms", icon: Globe2 },
  { label: "Site Settings", to: "/admin/site-settings", icon: Settings },
  { label: "Navigation", to: "/admin/navigation", icon: Layers3 },
  { label: "Website Builder", to: "/admin/website-builder", icon: Layers3 },
  { label: "Partner Sections", to: "/admin/academic-partners", icon: GraduationCap },
  { label: "Sponsors", to: "/admin/sponsors", icon: BadgePercent },
  { label: "Judges", to: "/admin/judges", icon: Gavel },
  { label: "Speakers", to: "/admin/speakers", icon: Mic2 },
  { label: "Competition", to: "/admin/competition", icon: Activity },
  { label: "Homepage", to: "/admin/homepage", icon: Home },
  { label: "Community CTA", to: "/admin/community-section", icon: MessageCircle },
  { label: "Team", to: "/admin/team", icon: Users },
  { label: "FAQ", to: "/admin/faq", icon: Activity },
  { label: "Registrations", to: "/admin/registrations", icon: Activity },
  { label: "Coupons", to: "/admin/coupons", icon: BadgePercent },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", to: "/admin/master-cms", icon: Settings },
];

function Sidebar({ open, onClose, onOpen }) {
  const mobileDrawerClass = open ? "max-[820px]:translate-x-0" : "max-[820px]:-translate-x-[120%]";

  return (
    <>
      <button className="admin-icon-button admin-mobile-menu fixed left-4 top-4 z-50" onClick={onOpen} aria-label="Open admin navigation">
        <Menu size={20} />
      </button>

      {open && <button className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm md:hidden" onClick={onClose} aria-label="Close overlay" />}

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : undefined }}
        className={`admin-sidebar absolute left-16 top-16 z-50 flex h-[calc(100vh-152px)] w-[202px] flex-col overflow-hidden rounded-[28px] border border-white/20 bg-[#5d55b9] p-5 text-white shadow-[0_26px_64px_rgba(80,68,171,0.34)] transition-transform duration-300 ease-out max-[1180px]:left-6 max-[1180px]:w-[82px] max-[820px]:fixed max-[820px]:left-4 max-[820px]:top-4 max-[820px]:h-[calc(100vh-32px)] max-[820px]:w-[272px] ${mobileDrawerClass}`}
      >
        <div className="shrink-0 flex items-center justify-between gap-3 pb-7">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="MedInnovate Logo" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 max-[1180px]:hidden max-[820px]:block">
              <p className="text-lg font-black tracking-tight">MedInnovate</p>
              <p className="text-xs text-white/70">Conference CMS</p>
            </div>
          </div>
          <button onClick={onClose} className="hidden rounded-full bg-white/10 p-2 max-[820px]:block" aria-label="Close admin navigation">
            <X size={18} />
          </button>
        </div>

        <nav className="admin-sidebar-nav min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
          <div className="grid gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition ${
                  isActive ? "bg-white text-[#4d459e] shadow-xl shadow-violet-950/10" : "text-white/48 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <link.icon size={20} className="shrink-0" />
              <span className="truncate max-[1180px]:hidden max-[820px]:block">{link.label}</span>
            </NavLink>
          ))}
          </div>
        </nav>

        <div className="mt-4 shrink-0 rounded-[24px] border border-white/12 bg-white/10 p-3 shadow-2xl shadow-violet-950/10 backdrop-blur max-[1180px]:p-2 max-[820px]:p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-white to-violet-100 text-lg font-black text-violet-700">A</div>
            <div className="min-w-0 max-[1180px]:hidden max-[820px]:block">
              <p className="truncate text-sm font-black">Admin Lead</p>
              <p className="truncate text-xs text-white/70">Super Admin</p>
            </div>
          </div>
          <button className="mt-4 w-full rounded-2xl bg-white/18 px-3 py-2 text-xs font-black text-white transition hover:bg-white/25 max-[1180px]:hidden max-[820px]:block">
            Quick settings
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;
