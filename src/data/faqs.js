export const FAQ_STORAGE_KEY = "medinnovate_faq_cms";

export const defaultFaqs = [
  {
    id: 1,
    question: "Is Medinnovate an online or offline event?",
    answer: "Medinnovate will follow a hybrid format. Phase 1 will be conducted online, and the Grand Finale will be held offline in India with a virtual presentation option for eligible participants who cannot attend in person.",
    category: "Format",
    status: "Published",
    order_index: 1,
  },
  {
    id: 2,
    question: "Can I participate solo?",
    answer: "No. Participation requires a team of 3 to 5 undergraduate students.",
    category: "Eligibility",
    status: "Published",
    order_index: 2,
  },
  {
    id: 3,
    question: "Who can participate?",
    answer: "Undergraduate students from Africa and India can participate.",
    category: "Eligibility",
    status: "Published",
    order_index: 3,
  },
  {
    id: 4,
    question: "Can team members be from different colleges or countries?",
    answer: "Yes. Team members can be from different colleges, disciplines, or countries, as long as all members meet the eligibility criteria.",
    category: "Team",
    status: "Published",
    order_index: 4,
  },
  {
    id: 5,
    question: "Is there any registration fee?",
    answer: "Yes. The registration fee is $10 per team, with teams allowed to register 3 to 5 members.",
    category: "Payment",
    status: "Published",
    order_index: 5,
  },
  {
    id: 6,
    question: "Will certificates be provided?",
    answer: "Yes. Certificates will be provided based on participation and completion criteria.",
    category: "Benefits",
    status: "Published",
    order_index: 6,
  },
  {
    id: 7,
    question: "What is the selection process?",
    answer: "The selection process follows registration, submission, screening, mentorship, and final pitch.",
    category: "Selection",
    status: "Published",
    order_index: 7,
  },
  {
    id: 8,
    question: "What happens if I cannot attend the final round in person?",
    answer: "A virtual option will be available for participants who cannot attend the final round in person.",
    category: "Finale",
    status: "Published",
    order_index: 8,
  },
  {
    id: 9,
    question: "What kind of ideas can we submit?",
    answer: "You can submit healthcare innovation ideas that address meaningful real-world healthcare challenges.",
    category: "Ideas",
    status: "Published",
    order_index: 9,
  },
  {
    id: 10,
    question: "How can I contact the team for support?",
    answer: "You can contact the team through email, Instagram, or WhatsApp.",
    category: "Support",
    status: "Published",
    order_index: 10,
  },
];

export function normalizeFaq(faq = {}, index = 0) {
  return {
    id: faq.id ?? `${faq.question || "faq"}-${index}`,
    question: String(faq.question || "").trim(),
    answer: String(faq.answer || "").trim(),
    category: String(faq.category || "").trim(),
    status: faq.status || (faq.is_published === false ? "Draft" : "Published"),
    order_index: Number(faq.order_index ?? faq.display_order ?? index + 1),
  };
}

export function normalizeFaqList(faqs = defaultFaqs) {
  const source = Array.isArray(faqs) ? faqs : defaultFaqs;
  return source
    .map(normalizeFaq)
    .filter((faq) => faq.question && faq.answer)
    .sort((a, b) => a.order_index - b.order_index);
}
