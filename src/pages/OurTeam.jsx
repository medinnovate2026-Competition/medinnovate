import TeamCard from '../components/TeamCard';
import { teamSections } from '../data/teamData';
import '../styles/OurTeam.css';

function OurTeam() {
  const totalMembers = teamSections.reduce((total, section) => total + section.members.length, 0);

  return (
    <main className="our-team-page">
      {/* Hero Section */}
      <section className="team-hero" aria-labelledby="team-hero-title">
        <div className="team-hero__glow team-hero__glow--blue" />
        <div className="team-hero__glow team-hero__glow--cyan" />

        <div className="team-hero__content">
          <p className="team-eyebrow">MedInnovate Team</p>
          <h1 id="team-hero-title">Meet the people building the future of healthcare innovation.</h1>
          <p className="team-hero__description">
            A multidisciplinary team of student leaders, healthcare innovators, and technology operators working together
            to make MedInnovate a premium global platform for medical innovation.
          </p>

          <div className="team-hero__stats" aria-label="Team overview">
            <div>
              <strong>{totalMembers}</strong>
              <span>Team Members</span>
            </div>
            <div>
              <strong>{teamSections.length}</strong>
              <span>Core Groups</span>
            </div>
            <div>
              <strong>Global</strong>
              <span>Healthcare Focus</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamically rendered team sections */}
      <section className="team-sections" aria-label="MedInnovate team groups">
        {teamSections.map((section) => (
          <section className="team-section" key={section.title} aria-labelledby={`${section.title}-title`}>
            <div className="team-section__header">
              <p className="team-eyebrow">{section.eyebrow}</p>
              <h2 id={`${section.title}-title`}>{section.title}</h2>
              <p>{section.description}</p>
            </div>

            <div className="team-grid">
              {section.members.map((member) => (
                <TeamCard key={`${section.title}-${member.name}`} member={member} />
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}

export default OurTeam;
