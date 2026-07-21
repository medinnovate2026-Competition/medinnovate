import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, Trophy } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "../styles/Round1Results.css";

gsap.registerPlugin(ScrollTrigger);

const featuredTeams = [
  "Aastha Gupta Team",
  "Team Recovery Lens",
  "CODE BLUE",
];

const qualifiedTeams = [
  "Aastha Gupta Team",
  "Team Recovery Lens",
  "CODE BLUE",
  "Team Tibia Honest",
  "Medintel",
  "AetherMed",
  "Recura",
  "Vitanova",
  "Aegis",
  "the MATCHmakers",
  "Iris",
  "HRIDAI",
];

function getNameLengthClass(name) {
  const len = name.length;
  if (len <= 10) return "name-short";
  if (len <= 15) return "name-medium";
  if (len <= 20) return "name-long";
  return "name-very-long";
}

function GoldTrophy() {
  return (
    <div className="results-trophy" aria-hidden="true">
      <div className="results-trophy__cup">
        <div className="results-trophy__handle results-trophy__handle--left" />
        <div className="results-trophy__handle results-trophy__handle--right" />
      </div>
      <div className="results-trophy__stem" />
      <div className="results-trophy__base" />
      <div className="results-trophy__plinth" />
      <div className="results-trophy__dust">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} style={{ "--dust-index": index }} />
        ))}
      </div>
    </div>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = canvas.getContext("2d", { alpha: true });
    let animationFrame;
    let particles = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(92, Math.floor((window.innerWidth * window.innerHeight) / 15500));
      particles = Array.from({ length: count }).map((_, index) => ({
        x: (index * 127) % window.innerWidth,
        y: (index * 79) % window.innerHeight,
        radius: 0.75 + (index % 4) * 0.45,
        alpha: 0.16 + (index % 6) * 0.045,
        speed: 0.13 + (index % 7) * 0.025,
        drift: -0.08 + (index % 5) * 0.04,
      }));
    };

    const render = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += particle.drift;

        if (particle.y < -8) particle.y = window.innerHeight + 8;
        if (particle.x < -8) particle.x = window.innerWidth + 8;
        if (particle.x > window.innerWidth + 8) particle.x = -8;

        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 5,
        );
        gradient.addColorStop(0, `rgba(244, 215, 124, ${particle.alpha})`);
        gradient.addColorStop(0.45, `rgba(212, 175, 55, ${particle.alpha * 0.42})`);
        gradient.addColorStop(1, "rgba(212, 175, 55, 0)");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
        context.fill();
      });

      if (!reduceMotion) animationFrame = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="results-particle-canvas" aria-hidden="true" />;
}

function HallOfFameSection({ team, index }) {
  const nameClass = getNameLengthClass(team);

  return (
    <section className="hall-section" data-featured-section>
      <div className="hall-section__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
      <div className="hall-section__spotlight" aria-hidden="true" />
      <div className="hall-section__burst" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, dotIndex) => (
          <span key={dotIndex} style={{ "--burst-index": dotIndex }} />
        ))}
      </div>

      <div className="hall-section__content">
        <div className="hall-section__icon">
          <Trophy size={54} strokeWidth={1.25} />
        </div>
        <p className="hall-section__label">Featured Team</p>
        <h2 className={`hall-section__name ${nameClass}`} aria-label={team.toUpperCase()}>
          {team.toUpperCase().split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="hall-word">
              {word.split("").map((letter, letterIndex) => (
                <span key={`${team}-${wordIndex}-${letterIndex}`} className="hall-letter">
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <div className="hall-section__line" />
        <p className="hall-section__selected">Official Round 2 Qualifier ⭐</p>
      </div>
    </section>
  );
}

function QualifiedTeamCard({ team }) {
  return (
    <motion.article
      className="qualified-team-card"
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <Sparkles size={17} strokeWidth={1.6} />
      <h3>{team}</h3>
    </motion.article>
  );
}

function Round1Results() {
  const pageRef = useRef(null);
  const trophyRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      pageRef.current?.classList.add("results-ready");
      return undefined;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.86,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const context = gsap.context(() => {
      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTimeline
        .to(pageRef.current, { opacity: 1, duration: 0.45 })
        .from(".results-hero__ambient, .results-particle-canvas", { opacity: 0, duration: 0.9 }, "-=0.15")
        .from(".results-hero__spotlight", { opacity: 0, scale: 0.92, duration: 1.1 }, "-=0.45")
        .from(".results-trophy-shell", { opacity: 0, scale: 0.9, y: 28, duration: 1.15 }, "-=0.72")
        .from(".results-hero__kicker, .results-title-line, .results-hero__subtitle", {
          opacity: 0,
          y: 34,
          filter: "blur(10px)",
          stagger: 0.13,
          duration: 0.9,
        }, "-=0.44")
        .from(".results-scroll-indicator", { opacity: 0, y: -12, duration: 0.8 }, "-=0.2");

      gsap.to(".results-trophy-shell", {
        y: -15,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.utils.toArray("[data-featured-section]").forEach((section) => {
        const letters = section.querySelectorAll(".hall-letter");
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 66%",
            end: "bottom 32%",
            toggleActions: "play reverse play reverse",
            onEnter: () => pageRef.current?.classList.add("results-particle-surge"),
            onEnterBack: () => pageRef.current?.classList.add("results-particle-surge"),
            onLeave: () => pageRef.current?.classList.remove("results-particle-surge"),
            onLeaveBack: () => pageRef.current?.classList.remove("results-particle-surge"),
          },
          defaults: { ease: "power3.out" },
        });

        timeline
          .fromTo(section, { backgroundColor: "#090909" }, { backgroundColor: "#050505", duration: 0.8 }, 0)
          .fromTo(section.querySelector(".hall-section__spotlight"), { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 1 }, 0.05)
          .fromTo(section.querySelector(".hall-section__icon"), { opacity: 0, y: 34, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.72 }, 0.2)
          .fromTo(section.querySelector(".hall-section__label"), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.65 }, 0.35)
          .fromTo(letters, { opacity: 0, y: 32, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.026, duration: 0.62 }, 0.45)
          .fromTo(section.querySelector(".hall-section__line"), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.78, ease: "power2.inOut" }, "-=0.15")
          .fromTo(section.querySelector(".hall-section__selected"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.62 }, "-=0.45")
          .fromTo(section.querySelectorAll(".hall-section__burst span"), {
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0,
          }, {
            opacity: 0.82,
            scale: 1,
            x: (_, dot) => Math.cos((Number(dot.style.getPropertyValue("--burst-index")) * 20) * Math.PI / 180) * (52 + Number(dot.style.getPropertyValue("--burst-index")) % 5 * 14),
            y: (_, dot) => Math.sin((Number(dot.style.getPropertyValue("--burst-index")) * 20) * Math.PI / 180) * (52 + Number(dot.style.getPropertyValue("--burst-index")) % 5 * 14),
            stagger: 0.012,
            duration: 0.72,
            ease: "power2.out",
          }, "-=0.72")
          .to(section.querySelectorAll(".hall-section__burst span"), { opacity: 0, duration: 0.5 }, "-=0.22");
      });

      gsap.from(".transition-divider__line", {
        scrollTrigger: { trigger: ".transition-divider", start: "top 72%", once: true },
        scaleX: 0,
        opacity: 0,
        duration: 0.95,
        ease: "power2.inOut",
      });

      gsap.from(".transition-divider h2, .transition-divider p", {
        scrollTrigger: { trigger: ".transition-divider", start: "top 70%", once: true },
        opacity: 0,
        y: 34,
        filter: "blur(8px)",
        stagger: 0.12,
        duration: 0.85,
        ease: "power3.out",
      });

      gsap.from(".qualified-team-card", {
        scrollTrigger: { trigger: ".qualified-grid", start: "top 76%", once: true },
        opacity: 0,
        y: 28,
        scale: 0.96,
        stagger: 0.06,
        duration: 0.68,
        ease: "power3.out",
      });

      gsap.from(".qualified-copy > *", {
        scrollTrigger: { trigger: ".qualified-copy", start: "top 80%", once: true },
        opacity: 0,
        y: 28,
        filter: "blur(6px)",
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".results-cta", {
        scrollTrigger: { trigger: ".results-cta", start: "top 80%", once: true },
        opacity: 0,
        y: 38,
        filter: "blur(8px)",
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.fromTo(".results-scroll-down", { opacity: 0, y: 14 }, {
        scrollTrigger: {
          trigger: "#featured-teams",
          start: "top 40%",
          end: "bottom 60%",
          toggleActions: "play reverse play reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }, pageRef);

    return () => {
      context.revert();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    if (trophyRef.current) {
      gsap.to(trophyRef.current, {
        rotateY: x * 9,
        rotateX: y * -7,
        x: x * 18,
        y: y * 12,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    if (spotlightRef.current) {
      gsap.to(spotlightRef.current, {
        x: x * 28,
        y: y * 18,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  };

  return (
    <main ref={pageRef} className="round-results-page">
      <ParticleCanvas />
      <div className="results-vignette" aria-hidden="true" />
      <div className="results-global-rays" aria-hidden="true" />

      <section className="results-hero" onMouseMove={handleMouseMove}>
        <div className="results-hero__ambient" aria-hidden="true" />
        <div ref={spotlightRef} className="results-hero__spotlight" aria-hidden="true" />
        <Link to="/" className="results-brand" aria-label="Back to MedInnovate home">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" />
          <span>MedInnovate</span>
        </Link>

        <div ref={trophyRef} className="results-trophy-shell">
          <div className="results-trophy-glow" />
          <GoldTrophy />
        </div>

        <div className="results-hero__copy">
          <p className="results-hero__kicker">MedInnovate 2026</p>
          <h1 aria-label="Round 1 Results">
            <span className="results-title-line">Round 1</span>
            <span className="results-title-line">Results</span>
          </h1>
          <p className="results-hero__subtitle">The judges have made their decision.</p>
          <a href="#featured-teams" className="results-scroll-indicator" aria-label="Scroll to featured teams">
            <ChevronDown size={22} />
            <span>Scroll to Reveal</span>
          </a>
        </div>
      </section>

      <div id="featured-teams">
        {featuredTeams.map((team, index) => (
          <HallOfFameSection key={team} team={team} index={index} />
        ))}
      </div>

      <div className="results-scroll-down" aria-hidden="true">
        <span className="results-scroll-down__text">Scroll down to see the entire list</span>
        <ChevronDown size={20} strokeWidth={2.2} />
      </div>

      <section className="transition-divider">
        <div className="transition-divider__line" aria-hidden="true" />
        <p>Teams Advancing to</p>
        <h2>Round 2</h2>
      </section>

      <section id="qualified" className="qualified-section">
        <div className="qualified-copy">
          <p>Qualified Teams</p>
          <h2>
            Teams Advancing to
            <br />
            <span className="qualified-heading-accent">ROUND 2</span>
          </h2>
          <span className="qualified-subtitle">Congratulations to every team advancing to the next stage of MedInnovate 2026.</span>
        </div>

        <div className="qualified-grid">
          {qualifiedTeams.map((team) => (
            <QualifiedTeamCard key={team} team={team} />
          ))}
        </div>
        <p className="qualified-note">
          The three teams highlighted above received the highest scores from the jury. The remaining teams are listed in no particular order.
        </p>
      </section>

      <section className="results-cta">
        <div className="results-cta__icon" aria-hidden="true">
          <Trophy size={50} strokeWidth={1.2} />
        </div>
        <div className="results-cta__copy">
          <p>Congratulations to every qualifying team.</p>
          <h2>We look forward to seeing your innovations in Round 2.</h2>
          <span>Best wishes from the MedInnovate Organizing Committee.</span>
        </div>
        <Link to="/round-2-details" className="results-cta__button">
          <span>View Round 2 Details</span>
          <ArrowRight size={18} strokeWidth={1.8} />
        </Link>
      </section>
    </main>
  );
}

export default Round1Results;
