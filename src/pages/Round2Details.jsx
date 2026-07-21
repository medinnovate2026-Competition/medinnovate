import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Trophy } from "lucide-react";
import gsap from "gsap";
import "../styles/Round2Details.css";

function Round2Details() {
  const pageRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      pageRef.current?.classList.add("r2-ready");
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.from(".r2-icon", { opacity: 0, scale: 0.8, y: 30, duration: 1, ease: "power3.out" });
      gsap.from(".r2-heading > *", { opacity: 0, y: 28, filter: "blur(8px)", stagger: 0.12, duration: 0.85, ease: "power3.out", delay: 0.3 });
      gsap.from(".r2-message", { opacity: 0, y: 22, duration: 0.8, ease: "power3.out", delay: 0.7 });
      gsap.from(".r2-back", { opacity: 0, y: 14, duration: 0.6, ease: "power2.out", delay: 0.95 });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="r2-page">
      <div className="r2-vignette" aria-hidden="true" />
      <div className="r2-glow" aria-hidden="true" />

      <Link to="/round-1-results" className="r2-back">
        <ArrowLeft size={18} strokeWidth={2} />
        <span>Back to Results</span>
      </Link>

      <div className="r2-content">
        <div className="r2-icon">
          <Trophy size={48} strokeWidth={1.2} />
        </div>

        <div className="r2-heading">
          <p className="r2-kicker">MedInnovate 2026</p>
          <h1>Round 2 Details</h1>
        </div>

        <div className="r2-message">
          <div className="r2-message__icon">
            <Clock size={22} strokeWidth={1.6} />
          </div>
          <h2>Details Coming Soon</h2>
          <p>
            The specifics for Round 2 &mdash; including timelines, deliverables,
            and evaluation criteria &mdash; are currently being finalised.
          </p>
          <p>
            All qualified teams will be notified directly via email once
            everything is ready. Please keep an eye on your inbox.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Round2Details;
