function TeamCard({ member }) {
  return (
    <article className="team-card">
      <div className="team-card__image-ring">
        <img
          className="team-card__image"
          src={member.image}
          alt={`${member.name}, ${member.role}`}
          loading="lazy"
        />
      </div>

      <div className="team-card__content">
        <h3>{member.name}</h3>
        <p>{member.role}</p>

        {(member.email || member.phone) && (
          <div className="team-card__contact" aria-label={`Contact details for ${member.name}`}>
            {member.email && (
              <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                {member.email}
              </a>
            )}

            {member.phone && (
              <a href={`tel:${member.phone}`} aria-label={`Call ${member.name}`}>
                {member.phone}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default TeamCard;
