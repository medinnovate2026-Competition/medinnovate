import About from '../components/About'
import Contact from '../components/Contact'
import Credibility from '../components/Credibility'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import Global from '../components/Global'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Participants from '../components/Participants'
import Prizes from '../components/Prizes'
import Registration from '../components/Registration'
import Speakers from '../components/Speakers'
import Timeline from '../components/Timeline'

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#09051A] font-sans text-[#F5F0FF] antialiased selection:bg-fuchsia-300 selection:text-[#12091F]">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(168,85,247,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.07)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_12%_8%,rgba(168,85,247,0.35),transparent_30%),radial-gradient(circle_at_88%_4%,rgba(236,72,153,0.24),transparent_32%),radial-gradient(circle_at_50%_92%,rgba(34,211,238,0.13),transparent_34%),linear-gradient(180deg,rgba(9,5,26,0)_0%,rgba(9,5,26,0.92)_76%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-40 bg-gradient-to-b from-fuchsia-300/10 to-transparent" />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Global />
          <Participants />
          <Timeline />
          <Speakers />
          <Prizes />
          <Registration />
          <Credibility />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Home
