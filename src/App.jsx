import { Navigate, Route, Routes } from 'react-router-dom';
import About from './components/About';
import AcademicPartners from './components/AcademicPartners';
import Credibility from './components/Credibility';
import FAQ from './components/FAQ';
import Global from './components/Global';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Participants from './components/Participants';
import PrizeReveal from './components/PrizeReveal';
import Prizes from './components/Prizes';
import Registration from './components/Registration';
import Speakers from './components/Speakers';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import OrganisingCommittee from './pages/OrganisingCommittee';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import CmsPlaceholderPage from './admin/pages/CmsPlaceholderPage';
import HomepageCmsEditor from './admin/pages/HomepageCmsEditor';
import SiteSettingsEditor from './admin/pages/SiteSettingsEditor';
import NavigationCmsPage from './admin/pages/NavigationCmsPage';
import FaqCmsPage from './admin/pages/FaqCmsPage';
import CouponsCmsPage from './admin/pages/CouponsCmsPage';
import RegistrationsPage from './admin/pages/RegistrationsPage';
import AcademicPartnersPage from './admin/pages/AcademicPartnersPage';
import OrganisingCommitteeCmsPage from './admin/pages/OrganisingCommitteeCmsPage';
import ProtectedRoute from './components/ProtectedRoute';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Global />
      <AcademicPartners />
      <About />
      <Prizes />
      <Participants />
      <Speakers />
      <section id="rewards" className="relative overflow-hidden bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute left-10 top-10 h-56 w-56 rounded-full bg-[#EC4899]/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-[#7C3AED]/10 blur-3xl" />
        <PrizeReveal />
      </section>
      <Timeline />
      <Registration />
      <FAQ />
      <Footer />
    </>
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
        <Route path="site-settings" element={<SiteSettingsEditor />} />
        <Route path="navigation" element={<NavigationCmsPage />} />
        <Route path="academic-partners" element={<AcademicPartnersPage />} />
        <Route path="organising-committee" element={<OrganisingCommitteeCmsPage />} />
        <Route path="faq" element={<FaqCmsPage />} />
        <Route path="website" element={<CmsPlaceholderPage title="Website CMS" description="Global brand, theme, SEO, footer, announcements, and contact controls." />} />
        <Route path="homepage" element={<HomepageCmsEditor />} />
        <Route path="registrations" element={<RegistrationsPage />} />
        <Route path="coupons" element={<CouponsCmsPage />} />
        <Route path="payments" element={<CmsPlaceholderPage title="Payments" description="Revenue review, payment statuses, transaction references, and finance work queues." variant="table" />} />
        <Route path="users" element={<CmsPlaceholderPage title="Users" description="Admin profiles, roles, permissions, volunteers, and content ownership." variant="table" />} />
        <Route path="analytics" element={<CmsPlaceholderPage title="Analytics" description="Traffic, conversion, campaign, registration, and content performance views." variant="table" />} />
        <Route path="settings" element={<CmsPlaceholderPage title="Settings" description="System preferences, access controls, integrations, maintenance mode, and admin defaults." />} />
      </Route>
    </Routes>
  );
}

export default App;
