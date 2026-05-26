export const defaultCommunitySection = {
  id: 1,
  title: "Get In Contact With Us",
  description: "Stay connected with MedInnovate.\nJoin our community for updates, announcements, opportunities and event discussions.",
  image_url: "",
  whatsapp_link: "https://chat.whatsapp.com/KaUGYIbIMDr2HASOrnD7vp?mode=gi_t",
  scroll_text: "\u2193 Scroll down for registration",
  visible: true,
  updated_at: null,
};

export function normalizeCommunitySection(section = {}) {
  return {
    ...defaultCommunitySection,
    ...section,
    title: section.title || defaultCommunitySection.title,
    description: section.description || defaultCommunitySection.description,
    image_url: section.image_url || "",
    whatsapp_link: section.whatsapp_link || defaultCommunitySection.whatsapp_link,
    scroll_text: section.scroll_text || defaultCommunitySection.scroll_text,
    visible: section.visible !== false && section.visible !== 0,
  };
}
