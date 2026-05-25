import { Route, Routes } from 'react-router-dom';
import About from './components/About';
import Contact from './components/Contact';
import Credibility from './components/Credibility';
import FAQ from './components/FAQ';
import Global from './components/Global';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Participants from './components/Participants';
import Prizes from './components/Prizes';
import Registration from './components/Registration';
import Speakers from './components/Speakers';
import Timeline from './components/Timeline';
import OurTeam from './pages/OurTeam';
import AdminCoupons from './pages/AdminCoupons';
import OrganisingCommittee from './pages/OrganisingCommittee';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Global />
      <Timeline />
      <Speakers />
      <Prizes />
      <Participants />
      <Registration />
      <FAQ />
      <Contact />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/our-team"
        element={
          <>
            <Navbar />
            <OurTeam />
          </>
        }
      />
      <Route path="/organising-committee" element={<OrganisingCommittee />} />
      <Route path="/admin/coupons" element={<AdminCoupons />} />
    </Routes>
  );
}

export default App;
