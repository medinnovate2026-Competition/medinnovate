import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import About from './components/About';
import AcademicPartners from './components/AcademicPartners';
import Credibility from './components/Credibility';
import FAQ from './components/FAQ';
import Global from './components/Global';
import Hero from './components/Hero';
import CommunitySection from './components/CommunitySection';
import CompetitionTracks from './components/CompetitionTracks';
import Navbar from './components/Navbar';
import Participants from './components/Participants';
import PrizeReveal from './components/PrizeReveal';
import Prizes from './components/Prizes';
import Registration from './components/Registration';
import Speakers from './components/Speakers';
import Judges from './components/Judges';
import Sponsors from './components/Sponsors';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import OrganisingCommittee from './pages/OrganisingCommittee';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import HomepageCmsEditor from './admin/pages/HomepageCmsEditor';
import CommunitySectionCmsPage from './admin/pages/CommunitySectionCmsPage';
import SiteSettingsEditor from './admin/pages/SiteSettingsEditor';
import NavigationCmsPage from './admin/pages/NavigationCmsPage';
import FaqCmsPage from './admin/pages/FaqCmsPage';
import CouponsCmsPage from './admin/pages/CouponsCmsPage';
import RegistrationsPage from './admin/pages/RegistrationsPage';
import AcademicPartnersPage from './admin/pages/AcademicPartnersPage';
import TeamCmsPage from './admin/pages/TeamCmsPage';
import SpeakersCmsPage from './admin/pages/SpeakersCmsPage';
import JudgesCmsPage from './admin/pages/JudgesCmsPage';
import CompetitionCmsPage from './admin/pages/CompetitionCmsPage';
import SponsorsCmsPage from './admin/pages/SponsorsCmsPage';
import WebsiteBuilderPage from './admin/pages/WebsiteBuilderPage';
import MasterCmsPage from './admin/pages/MasterCmsPage';
import AnalyticsPage from './admin/pages/AnalyticsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { API_BASE_URL } from './config';
import { defaultCommunitySection, normalizeCommunitySection } from './data/communitySection';
import { defaultHomepageContent, normalizeHomepageContent } from './data/homepageContent';

const defaultWebsiteSections = [
  { section_key: "hero", section_name: "Hero", title: "Medinnovate", subtitle: "International Healthcare Innovation Hackathon", visible: true, display_order: 1, background_type: "default", animation: "fade", custom_css_class: "" },
  { section_key: "about", section_name: "About", title: "About MedInnovate", subtitle: "A global healthcare innovation platform for student teams.", visible: true, display_order: 2, background_type: "light", animation: "slide-up", custom_css_class: "" },
  { section_key: "stats", section_name: "Stats", title: "Global participation", subtitle: "Event highlights and participation metrics.", visible: true, display_order: 3, background_type: "default", animation: "fade", custom_css_class: "" },
  { section_key: "competition", section_name: "Competition", title: "Competition Tracks", subtitle: "Research, posters, innovation pitches, and case presentations.", visible: true, display_order: 4, background_type: "light", animation: "slide-up", custom_css_class: "" },
  { section_key: "speakers", section_name: "Speakers", title: "Speakers", subtitle: "Meet keynote speakers and session leaders.", visible: true, display_order: 5, background_type: "default", animation: "fade", custom_css_class: "" },
  { section_key: "judges", section_name: "Judges", title: "Judges", subtitle: "Reviewers, evaluators, and panel members.", visible: true, display_order: 6, background_type: "light", animation: "fade", custom_css_class: "" },
  { section_key: "sponsors", section_name: "Sponsors", title: "Sponsors", subtitle: "Partners and supporting organisations.", visible: false, display_order: 7, background_type: "default", animation: "fade", custom_css_class: "" },
  { section_key: "committee", section_name: "Committee", title: "Organising Committee", subtitle: "Meet the people coordinating MedInnovate.", visible: true, display_order: 8, background_type: "light", animation: "slide-up", custom_css_class: "" },
  { section_key: "schedule", section_name: "Schedule", title: "Schedule", subtitle: "Event timeline and important milestones.", visible: false, display_order: 9, background_type: "default", animation: "fade", custom_css_class: "" },
  { section_key: "faq", section_name: "FAQ", title: "Frequently Asked Questions", subtitle: "Answers to common participant questions.", visible: true, display_order: 10, background_type: "light", animation: "fade", custom_css_class: "" },
  { section_key: "community", section_name: "Community", title: "Join the Community", subtitle: "Connect with MedInnovate for updates and announcements.", visible: true, display_order: 11, background_type: "default", animation: "slide-up", custom_css_class: "" },
  { section_key: "footer", section_name: "Footer", title: "Footer", subtitle: "", visible: true, display_order: 12, background_type: "default", animation: "none", custom_css_class: "" },
  { section_key: "gallery", section_name: "Gallery", title: "Gallery", subtitle: "Event photos and media highlights.", visible: false, display_order: 13, background_type: "default", animation: "fade", custom_css_class: "" },
];

const defaultMasterSettings = {
  site_theme: {
    mode: "default",
    primary_color: "#7C3AED",
    accent_color: "#EC4899",
    button_style: "rounded",
    animation_intensity: "normal",
  },
  maintenance_mode: false,
  maintenance_message: "MedInnovate is currently under maintenance. Please check back soon.",
  announcement_enabled: false,
  announcement_text: "Registrations Open",
  countdown_enabled: false,
  countdown_date: "",
  registration_banner_enabled: false,
  registration_banner_text: "Early Bird Open",
  popup_enabled: false,
  popup_title: "Registrations Open",
  popup_content: "Register your team and start building for public health.",
  schedule_enabled: false,
  gallery_enabled: false,
  sponsors_enabled: false,
  judges_enabled: true,
  speakers_enabled: true,
  competition_enabled: true,
  committee_enabled: true,
  faq_enabled: true,
  community_enabled: true,
};

function sectionFeatureEnabled(section, settings) {
  if (section.section_key === "hero" || section.section_key === "footer") return true;
  const flagKey = `${section.section_key}_enabled`;
  return settings[flagKey] === undefined ? true : Boolean(settings[flagKey]);
}

function normalizeWebsiteSections(items, settings = defaultMasterSettings) {
  const source = Array.isArray(items) && items.length > 0 ? items : defaultWebsiteSections;
  return source
    .map((section) => ({
      ...section,
      visible: section.section_key === "hero" || section.section_key === "footer" ? true : Boolean(section.visible),
      display_order: Number(section.display_order || 0),
    }))
    .filter((section) => section.visible && sectionFeatureEnabled(section, settings))
    .sort((a, b) => a.display_order - b.display_order);
}

function BuilderIntro({ section }) {
  if (!section?.title && !section?.subtitle) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-8 pt-16 text-center sm:px-6 lg:px-8">
      {section.title && <h2 className="text-3xl font-black tracking-tight text-[#111827] sm:text-5xl">{section.title}</h2>}
      {section.subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">{section.subtitle}</p>}
    </div>
  );
}

function BuilderSectionWrapper({ section, children, intro = true }) {
  const backgroundClass = {
    default: "",
    light: "bg-[#fbf9ff]",
    dark: "bg-slate-950 text-white",
    gradient: "bg-gradient-to-br from-violet-50 via-white to-cyan-50",
    transparent: "bg-transparent",
  }[section.background_type] || "";
  const animationClass = {
    fade: "animate-[fadeIn_0.45s_ease-out]",
    "slide-up": "animate-[slideUp_0.45s_ease-out]",
    zoom: "animate-[zoomIn_0.35s_ease-out]",
    none: "",
  }[section.animation] || "";

  return (
    <div className={`${backgroundClass} ${animationClass} ${section.custom_css_class || ""}`} data-section-key={section.section_key}>
      {intro && <BuilderIntro section={section} />}
      {children}
    </div>
  );
}

function AnnouncementBar({ settings }) {
  if (!settings.announcement_enabled || !settings.announcement_text) return null;
  return (
    <div className="sticky top-0 z-50 bg-[#111827] px-4 py-2 text-center text-sm font-black text-white shadow-lg">
      {settings.announcement_text}
    </div>
  );
}

function CountdownBar({ settings }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!settings.countdown_enabled || !settings.countdown_date) return undefined;

    const update = () => {
      const target = new Date(settings.countdown_date).getTime();
      const diff = target - Date.now();
      if (!Number.isFinite(target) || diff <= 0) {
        setRemaining("Starting soon");
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      setRemaining(`${days}d ${hours}h ${minutes}m`);
    };

    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, [settings.countdown_date, settings.countdown_enabled]);

  if (!settings.countdown_enabled || !settings.countdown_date) return null;
  return (
    <div className="bg-violet-50 px-4 py-3 text-center text-sm font-black text-[#514aa3]">
      Event countdown: {remaining}
    </div>
  );
}

function RegistrationBanner({ settings }) {
  if (!settings.registration_banner_enabled || !settings.registration_banner_text) return null;
  return (
    <div className="bg-[#EC4899] px-4 py-3 text-center text-sm font-black text-white">
      {settings.registration_banner_text}
    </div>
  );
}

function SitePopup({ settings }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!settings.popup_enabled) return;
    if (sessionStorage.getItem("medinnovate_master_popup_seen") === "true") return;
    setOpen(true);
  }, [settings.popup_enabled]);

  if (!open || !settings.popup_enabled) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-black text-[#514aa3]">{settings.popup_title || "Announcement"}</h2>
        <p className="mt-3 leading-7 text-slate-600">{settings.popup_content}</p>
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem("medinnovate_master_popup_seen", "true");
            setOpen(false);
          }}
          className="admin-primary-button mt-5 w-full justify-center"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function MaintenanceScreen({ message }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fbf9ff] px-4 text-center">
      <div className="max-w-xl rounded-[32px] border border-violet-100 bg-white p-8 shadow-[0_24px_80px_rgba(124,58,237,0.12)]">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#7C3AED]">Maintenance</p>
        <h1 className="mt-4 text-4xl font-black text-[#111827]">MedInnovate will be back soon</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{message}</p>
      </div>
    </main>
  );
}

function CompetitionBundle({ content }) {
  return (
    <>
      <Prizes />
      <CompetitionTracks />
      <Participants content={content} />
      <section id="rewards" className="relative overflow-hidden bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute left-10 top-10 h-56 w-56 rounded-full bg-[#EC4899]/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-[#7C3AED]/10 blur-3xl" />
        <PrizeReveal />
      </section>
      <section className="relative overflow-hidden bg-[#fbf9ff] px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-5xl rounded-[32px] border border-violet-100 bg-white/86 p-8 text-center shadow-[0_24px_80px_rgba(124,58,237,0.10)] sm:p-12">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#7C3AED]">Next Step</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#111827] sm:text-5xl">{content.cta_title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{content.cta_description}</p>
        </div>
      </section>
      <Registration />
    </>
  );
}

function CommitteeHomeSection({ section }) {
  return (
    <section id="committee" className="bg-white px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-5 rounded-[28px] border border-violet-100 bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)] sm:p-8">
        <div>
          <h3 className="text-2xl font-black text-[#514aa3]">{section.title || "Organising Committee"}</h3>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">{section.subtitle || "Meet the people coordinating MedInnovate."}</p>
        </div>
        <a href={`${import.meta.env.BASE_URL}organising-committee`} className="admin-primary-button">View Committee</a>
      </div>
    </section>
  );
}

function HomePage() {
  const [homepageContent, setHomepageContent] = useState(defaultHomepageContent);
  const [communitySection, setCommunitySection] = useState(defaultCommunitySection);
  const [websiteSections, setWebsiteSections] = useState(defaultWebsiteSections);
  const [masterSettings, setMasterSettings] = useState(defaultMasterSettings);
  const [loadingHomepage, setLoadingHomepage] = useState(true);
  const [loadingCommunity, setLoadingCommunity] = useState(true);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/api/homepage`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Homepage content unavailable")))
      .then((data) => {
        if (active) setHomepageContent(normalizeHomepageContent(data.content));
      })
      .catch(() => {
        if (active) setHomepageContent(defaultHomepageContent);
      })
      .finally(() => {
        if (active) setLoadingHomepage(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/api/community-section`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Community section unavailable")))
      .then((data) => {
        if (active) setCommunitySection(normalizeCommunitySection(data.section));
      })
      .catch(() => {
        if (active) setCommunitySection(defaultCommunitySection);
      })
      .finally(() => {
        if (active) setLoadingCommunity(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/api/master-config`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Master config unavailable")))
      .then((data) => {
        if (active) {
          const nextSettings = { ...defaultMasterSettings, ...(data.settings || {}) };
          setMasterSettings(nextSettings);
          setWebsiteSections(normalizeWebsiteSections(data.sections || data.visible_sections, nextSettings));
        }
      })
      .catch(() => {
        if (active) setWebsiteSections(normalizeWebsiteSections(defaultWebsiteSections, defaultMasterSettings));
      });

    return () => {
      active = false;
    };
  }, []);

  const content = normalizeHomepageContent(homepageContent);
  const visibleSections = normalizeWebsiteSections(websiteSections, masterSettings);
  const theme = masterSettings.site_theme || defaultMasterSettings.site_theme;
  const renderSection = (section) => {
    switch (section.section_key) {
      case "hero":
        return <Hero content={content} />;
      case "stats":
        return <Global />;
      case "about":
        return <><AcademicPartners /><About content={content} /></>;
      case "competition":
        return <CompetitionBundle content={content} />;
      case "speakers":
        return <Speakers />;
      case "judges":
        return <Judges />;
      case "sponsors":
        return <Sponsors />;
      case "committee":
        return <CommitteeHomeSection section={section} />;
      case "schedule":
        return <Timeline content={content} />;
      case "faq":
        return <FAQ />;
      case "community":
        return <CommunitySection section={communitySection} loading={loadingCommunity} />;
      case "gallery":
        return null;
      case "footer":
        return <Footer content={content} />;
      default:
        return null;
    }
  };

  if (masterSettings.maintenance_mode) {
    return <MaintenanceScreen message={masterSettings.maintenance_message} />;
  }

  return (
    <div
      style={{
        "--master-primary": theme.primary_color || "#7C3AED",
        "--master-accent": theme.accent_color || "#EC4899",
      }}
      data-theme-mode={theme.mode || "default"}
      data-button-style={theme.button_style || "rounded"}
      data-animation-intensity={theme.animation_intensity || "normal"}
    >
      <AnnouncementBar settings={masterSettings} />
      <CountdownBar settings={masterSettings} />
      <RegistrationBanner settings={masterSettings} />
      <SitePopup settings={masterSettings} />
      <Navbar />
      {loadingHomepage && (
        <div className="fixed left-1/2 top-24 z-40 -translate-x-1/2 rounded-full border border-violet-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#7C3AED] shadow-lg">
          Loading homepage
        </div>
      )}
      {visibleSections.map((section) => (
        <BuilderSectionWrapper key={section.section_key} section={section} intro={!["hero", "footer", "community", "about", "competition", "committee"].includes(section.section_key)}>
          {renderSection(section)}
        </BuilderSectionWrapper>
      ))}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/registration"
        element={
          <>
            <Registration full />
          </>
        }
      />
      <Route path="/organising-committee" element={<OrganisingCommittee />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="master-cms" element={<MasterCmsPage />} />
        <Route path="site-settings" element={<SiteSettingsEditor />} />
        <Route path="navigation" element={<NavigationCmsPage />} />
        <Route path="website-builder" element={<WebsiteBuilderPage />} />
        <Route path="academic-partners" element={<AcademicPartnersPage />} />
        <Route path="sponsors" element={<SponsorsCmsPage />} />
        <Route path="competition" element={<CompetitionCmsPage />} />
        <Route path="judges" element={<JudgesCmsPage />} />
        <Route path="speakers" element={<SpeakersCmsPage />} />
        <Route path="team" element={<TeamCmsPage />} />
        <Route path="organising-committee" element={<Navigate to="/admin/team" replace />} />
        <Route path="faq" element={<FaqCmsPage />} />
        <Route path="website" element={<Navigate to="/admin/master-cms" replace />} />
        <Route path="homepage" element={<HomepageCmsEditor />} />
        <Route path="community-section" element={<CommunitySectionCmsPage />} />
        <Route path="registrations" element={<RegistrationsPage />} />
        <Route path="coupons" element={<CouponsCmsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<Navigate to="/admin/master-cms" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
