function PolicyPage({ title, children }) {
  return (
    <section className="min-h-screen bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#EC4899] bg-clip-text text-4xl font-black text-transparent">
          {title}
        </h1>
        <p className="mt-2 text-sm font-semibold text-slate-400">Last updated: June 2026</p>
        <div className="mt-10 space-y-8 text-sm leading-7 text-slate-600">
          {children}
        </div>
      </div>
    </section>
  );
}

function Section({ heading, children }) {
  return (
    <div>
      <h2 className="text-base font-black text-[#111827]">{heading}</h2>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function TermsPage() {
  return (
    <PolicyPage title="Terms and Conditions">
      <Section heading="1. Acceptance of Terms">
        <p>By registering for MedInnovate 2026, you agree to these terms. If you do not agree, do not register.</p>
      </Section>
      <Section heading="2. Eligibility">
        <p>Participation is open to undergraduate students from Africa and India. Teams must consist of 3 to 5 members. All members must meet the eligibility criteria at the time of registration.</p>
      </Section>
      <Section heading="3. Registration Fee">
        <p>A non-refundable registration fee of USD $10 per team is required to complete registration. Payment must be completed in full before registration is confirmed.</p>
      </Section>
      <Section heading="4. Event Format">
        <p>MedInnovate 2026 follows a hybrid format. Phase 1 is conducted online. The Grand Finale will be held in India, with a virtual participation option for eligible teams unable to attend in person.</p>
      </Section>
      <Section heading="5. Intellectual Property">
        <p>All ideas, abstracts, and submissions remain the intellectual property of the respective teams. MedInnovate does not claim ownership over participant submissions.</p>
      </Section>
      <Section heading="6. Conduct">
        <p>Participants are expected to conduct themselves professionally. MedInnovate reserves the right to disqualify any team for misconduct, plagiarism, or violation of these terms.</p>
      </Section>
      <Section heading="7. Modifications">
        <p>MedInnovate reserves the right to modify these terms, event format, or schedule at any time. Registered participants will be notified of significant changes via email.</p>
      </Section>
      <Section heading="8. Contact">
        <p>For questions, contact us at <a href="mailto:medinnovate2026@gmail.com" className="text-[#7C3AED] font-bold">medinnovate2026@gmail.com</a>.</p>
      </Section>
    </PolicyPage>
  );
}

export function PrivacyPage() {
  return (
    <PolicyPage title="Privacy Policy">
      <Section heading="1. Information We Collect">
        <p>When you register for MedInnovate 2026, we collect: full name, email address, phone number, college/university, country, field of study, year of study, gender, and payment transaction ID.</p>
      </Section>
      <Section heading="2. How We Use Your Information">
        <p>We use your information to process registration, verify payment, communicate event updates, issue certificates, and manage team coordination. We do not sell or share your data with third parties for marketing purposes.</p>
      </Section>
      <Section heading="3. Data Storage">
        <p>Your data is stored securely on our servers. We retain registration data for the duration of the event and for up to 2 years after for record-keeping purposes.</p>
      </Section>
      <Section heading="4. Cookies">
        <p>Our website does not use tracking cookies. We use browser local storage only to save your registration draft so you do not lose progress.</p>
      </Section>
      <Section heading="5. Third-Party Services">
        <p>We use Razorpay for payment processing. Razorpay's privacy policy governs any data you provide during payment. We do not store your card details.</p>
      </Section>
      <Section heading="6. Your Rights">
        <p>You may request access to, correction of, or deletion of your personal data by contacting us at <a href="mailto:medinnovate2026@gmail.com" className="text-[#7C3AED] font-bold">medinnovate2026@gmail.com</a>.</p>
      </Section>
    </PolicyPage>
  );
}

export function ShippingPage() {
  return (
    <PolicyPage title="Shipping Policy">
      <Section heading="Digital Event — No Physical Shipping">
        <p>MedInnovate 2026 is a digital and hybrid event. We do not ship any physical goods as part of the registration process.</p>
      </Section>
      <Section heading="Digital Deliverables">
        <p>All deliverables including confirmation emails, participation certificates, and event materials are delivered digitally via email to the registered team leader's email address.</p>
      </Section>
      <Section heading="Certificate Delivery">
        <p>Participation and achievement certificates are issued digitally after the conclusion of the event. Delivery is made within 30 days of event completion to the registered email address.</p>
      </Section>
      <Section heading="Grand Finale">
        <p>Teams selected for the Grand Finale are responsible for their own travel and accommodation arrangements to attend in person. MedInnovate does not arrange or cover travel logistics.</p>
      </Section>
      <Section heading="Contact">
        <p>For questions about event deliverables, contact <a href="mailto:medinnovate2026@gmail.com" className="text-[#7C3AED] font-bold">medinnovate2026@gmail.com</a>.</p>
      </Section>
    </PolicyPage>
  );
}

export function ContactPage() {
  return (
    <PolicyPage title="Contact Us">
      <Section heading="General Enquiries">
        <p>Email: <a href="mailto:medinnovate2026@gmail.com" className="text-[#7C3AED] font-bold">medinnovate2026@gmail.com</a></p>
        <p className="mt-2">Instagram: <a href="https://www.instagram.com/medinnovate_26" target="_blank" rel="noreferrer" className="text-[#7C3AED] font-bold">@medinnovate_26</a></p>
      </Section>
      <Section heading="Organising Secretaries">
        <div className="mt-2 space-y-4">
          {[
            { name: "Girik Subudhi", org: "GAIMS", phone: "+91 8169011833", wa: "https://wa.me/918169011833" },
            { name: "Sofiyullah Salaudeen", org: "NiMSA", phone: "+234 7038939481", wa: "https://wa.me/2347038939481" },
            { name: "Elton M Mahulu", org: "FAMSA", phone: "+255 628049726", wa: "https://wa.me/255628049726" },
            { name: "Ogunka Favour", org: "Blue Ozone Health", phone: "+234 8052747225", wa: "https://wa.me/2348052747225" },
          ].map((person) => (
            <div key={person.phone} className="rounded-2xl border border-violet-100 bg-[#fbf9ff] p-4">
              <p className="font-black text-[#111827]">{person.name}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{person.org}</p>
              <a href={person.wa} target="_blank" rel="noreferrer" className="mt-1 block text-sm font-bold text-[#7C3AED]">{person.phone}</a>
            </div>
          ))}
        </div>
      </Section>
      <Section heading="Response Time">
        <p>We aim to respond to all enquiries within 48 hours. For urgent matters, contact us via WhatsApp.</p>
      </Section>
    </PolicyPage>
  );
}

export function RefundsPage() {
  return (
    <PolicyPage title="Cancellation and Refunds">
      <Section heading="Registration Fee">
        <p>The registration fee of USD $10 per team is non-refundable once payment has been completed. This applies regardless of the reason for cancellation.</p>
      </Section>
      <Section heading="Team Cancellation">
        <p>If a team wishes to withdraw from the event after registration, they may do so by contacting us at <a href="mailto:medinnovate2026@gmail.com" className="text-[#7C3AED] font-bold">medinnovate2026@gmail.com</a>. No refund will be issued.</p>
      </Section>
      <Section heading="Event Cancellation by Organizers">
        <p>In the unlikely event that MedInnovate 2026 is cancelled by the organizers, registered teams will be offered a full refund of the registration fee. Refunds will be processed within 14 business days via the original payment method.</p>
      </Section>
      <Section heading="Event Postponement">
        <p>If the event is postponed, registrations will remain valid for the rescheduled date. Teams may request a refund within 7 days of the postponement announcement.</p>
      </Section>
      <Section heading="Duplicate Payments">
        <p>If you have been charged more than once due to a technical error, contact us immediately at <a href="mailto:medinnovate2026@gmail.com" className="text-[#7C3AED] font-bold">medinnovate2026@gmail.com</a> with your transaction details and we will process a refund for the duplicate charge.</p>
      </Section>
    </PolicyPage>
  );
}
