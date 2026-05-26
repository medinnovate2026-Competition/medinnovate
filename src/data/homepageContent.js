export const defaultHomepageContent = {
  hero_title: "Medinnovate",
  hero_subtitle: "International Healthcare Innovation Hackathon",
  hero_description: "Build practical healthcare solutions with global mentors, clinical insight, and cross-border teams.",
  about_text: "Medinnovate is an international healthcare innovation hackathon that brings together students and young professionals from diverse disciplines, medicine, public health, engineering, design, and social sciences, to collaboratively develop feasible, scalable, and impactful solutions to real-world healthcare challenges.",
  stats_json: [
    { value: "20+", label: "Countries" },
    { value: "5", label: "Members per team" },
    { value: "2", label: "Competition phases" },
  ],
  timeline_json: [
    { title: "Registration", detail: "Sign up and form your team of five undergraduate students." },
    { title: "Abstract Submission", detail: "Teams submit a first abstract outlining their healthcare innovation idea." },
    { title: "Review & Selection", detail: "Expert panel reviews abstracts to shortlist the most feasible and impactful ideas." },
    { title: "Mentorship & Guidance", detail: "Selected teams receive expert guidance to refine their solutions and prepare for their pitch." },
    { title: "Grand Finale", detail: "Present your final solution in India. Hybrid format with online participation available." },
  ],
  why_participate_json: [
    { title: "Team of 5 is mandatory", detail: "Every submission must come from a team of exactly five members." },
    { title: "All members should be undergraduate students", detail: "Each participant in the team must be an undergraduate student." },
    { title: "Theme: Public Health", detail: "Ideas should address a meaningful public health challenge." },
    { title: "Original and feasible idea", detail: "The solution must be your own concept and practical enough to be implemented." },
  ],
  cta_title: "Ready to build for public health?",
  cta_description: "Register your team, submit your idea, and move through Phase 1 screening.",
  contact_json: {
    email: "medinnovate2026@gmail.com",
    instagram: "https://www.instagram.com/medinnovate_26?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    whatsapp_label: "WhatsApp support",
  },
  primary_cta_label: "Submit Idea",
  primary_cta_url: "/registration",
  secondary_cta_label: "Current Phase: PHASE 1",
  secondary_cta_url: "",
  hero_media_url: "",
};

function parseList(value, fallback) {
  if (Array.isArray(value)) return value;
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function parseObject(value, fallback) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function normalizeHomepageContent(content = {}) {
  return {
    ...defaultHomepageContent,
    ...content,
    stats_json: parseList(content.stats_json, defaultHomepageContent.stats_json),
    timeline_json: parseList(content.timeline_json, defaultHomepageContent.timeline_json),
    why_participate_json: parseList(content.why_participate_json, defaultHomepageContent.why_participate_json),
    contact_json: parseObject(content.contact_json, defaultHomepageContent.contact_json),
  };
}
