import { useMemo, useState } from "react";
import { Bell, ExternalLink, Moon, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const searchableSections = [
  { title: "MASTER CMS", description: "Central website controls, feature flags, announcements, countdowns, popups, maintenance, and theme", path: "/admin/master-cms", tags: "master cms website builder feature flags maintenance announcement popup countdown theme homepage modules" },
  { title: "Dashboard", description: "Stats, registrations, payments, recent activity", path: "/admin/dashboard", tags: "overview command center analytics" },
  { title: "Website", description: "Global website controls now live in MASTER CMS", path: "/admin/master-cms", tags: "website global master cms" },
  { title: "Site Settings", description: "Brand, SEO, footer, socials, announcement", path: "/admin/site-settings", tags: "website settings theme contact logo favicon" },
  { title: "Navigation", description: "Navbar, footer links, visibility, ordering", path: "/admin/navigation", tags: "menu links footer navbar" },
  { title: "Website Builder", description: "Homepage section visibility, ordering, titles, backgrounds, and animations", path: "/admin/website-builder", tags: "website builder homepage sections visibility order background animation" },
  { title: "Partner Sections", description: "Academic, research, innovation, title, knowledge, Georgian regional, and outreach partners", path: "/admin/academic-partners", tags: "partners institutions academic research innovation title knowledge georgian regional outreach logos" },
  { title: "Sponsors", description: "Sponsor tiers, logos, booths, links, featured sponsors, and sessions", path: "/admin/sponsors", tags: "sponsors partners exhibitors support logo tier booth session" },
  { title: "Judges", description: "Judges, reviewers, evaluators, expertise, and panel members", path: "/admin/judges", tags: "judges reviewers evaluators panel faculty industry research sponsor external expertise" },
  { title: "Speakers", description: "Speaker profiles, featured status, sessions, and social links", path: "/admin/speakers", tags: "speakers judges keynote sessions experts panel" },
  { title: "Team", description: "Committee sections, members, roles, contacts, photos", path: "/admin/team", tags: "team committee people members organisers organizing sections" },
  { title: "Homepage", description: "Hero, highlights, stats, timeline, FAQ", path: "/admin/homepage", tags: "home landing content editor" },
  { title: "FAQ", description: "Questions, answers, categories, publish state", path: "/admin/faq", tags: "help questions support" },
  { title: "Registrations", description: "Teams, leaders, payments, CSV export", path: "/admin/registrations", tags: "applicants teams users export" },
  { title: "Coupons", description: "Discount codes, QR settings, payment coupons", path: "/admin/coupons", tags: "discount qr medin10 payments" },
  { title: "Analytics", description: "Finance, revenue, coupon usage, verified payments", path: "/admin/analytics", tags: "reports metrics money revenue coupons finance" },
  { title: "Settings", description: "System preferences now live in MASTER CMS", path: "/admin/master-cms", tags: "system preferences maintenance master cms" },
];

function Topbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchableSections.slice(0, 6);

    return searchableSections
      .filter((item) => `${item.title} ${item.description} ${item.tags}`.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [query]);

  const goToResult = (path) => {
    setQuery("");
    setOpen(false);
    navigate(path);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (results[0]) goToResult(results[0].path);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-8 z-30 mb-7 rounded-[28px] bg-white/70 px-5 py-4 shadow-[0_18px_50px_rgba(91,76,143,0.08)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-[#5d55b9] shadow-lg shadow-violet-100/70 transition hover:-translate-y-0.5 hover:text-fuchsia-600 max-[760px]:px-3"
        >
          <ExternalLink size={17} />
          <span className="max-[620px]:hidden">Back to website</span>
        </Link>
        <form className="admin-topbar-search relative min-w-0 flex-1" onSubmit={handleSubmit}>
          <Search className="pointer-events-none absolute left-6 top-1/2 z-10 -translate-y-1/2 text-slate-400" size={19} />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 140)}
            className="admin-field h-11 border-0 pl-16 pr-5 shadow-none"
            placeholder="Search CMS pages, registrations, coupons..."
            aria-label="Search admin CMS"
          />
          {open && (
            <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-[24px] border border-violet-100 bg-white/95 p-2 shadow-[0_24px_70px_rgba(74,55,112,0.16)] backdrop-blur-xl">
              {results.length === 0 ? (
                <div className="rounded-2xl px-4 py-5 text-sm font-bold text-slate-400">No CMS pages found.</div>
              ) : results.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => goToResult(item.path)}
                  className="flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-violet-50"
                >
                  <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-400 text-xs font-black text-white">
                    {item.title.slice(0, 1)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black text-[#514aa3]">{item.title}</span>
                    <span className="mt-1 block truncate text-xs font-semibold text-slate-400">{item.description}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </form>
        <button className="admin-icon-button" aria-label="Notifications">
          <Bell size={19} />
        </button>
        <button className="admin-icon-button admin-topbar-optional max-[620px]:hidden" aria-label="Quick actions">
          <Plus size={20} />
        </button>
        <button className="admin-icon-button admin-topbar-optional max-[620px]:hidden" aria-label="Theme">
          <Moon size={18} />
        </button>
        <button className="admin-icon-button admin-topbar-optional max-[620px]:hidden" aria-label="Filters">
          <SlidersHorizontal size={18} />
        </button>
        <button className="flex h-12 items-center gap-3 rounded-2xl bg-white px-3 shadow-lg shadow-violet-100/70">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-400 text-sm font-black text-white">M</span>
          <span className="text-sm font-black text-slate-800 max-[720px]:hidden">Manager</span>
        </button>
      </div>
    </motion.header>
  );
}

export default Topbar;
