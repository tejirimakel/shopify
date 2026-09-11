import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Madhura Kitchen — orders, catering, and feedback.",
};

const infoCards = [
  {
    icon: PinIcon,
    label: "Our Location",
    lines: ["824 Heritage Square, 4th Avenue", "Calgary, AB"],
  },
  {
    icon: PhoneIcon,
    label: "Order by Phone",
    lines: ["+1 (403) 555-0182", "Daily 11:00 AM – 10:00 PM"],
  },
  {
    icon: MailIcon,
    label: "Email Us",
    lines: ["info@madhurakitchen.ca", "We reply within 24 hours"],
  },
];

const hours = [
  { day: "Tue — Fri", time: "11am – 10pm" },
  { day: "Saturday", time: "10am – 11pm" },
  { day: "Sunday", time: "10am – 10pm" },
  { day: "Monday", time: "Closed" },
];

const faqs = [
  {
    question: "Do you offer delivery or pickup?",
    answer:
      "Both. Choose either option at checkout — delivery typically arrives within 30–60 minutes, and pickup orders are ready in about 20 minutes.",
  },
  {
    question: "Can I customize my order or note an allergy?",
    answer:
      "Yes. Every dish has a special instructions field at checkout — let us know about spice level, allergies, or any substitutions.",
  },
  {
    question: "Do you cater large orders or events?",
    answer:
      "We do. For groups of 10 or more, reach out ahead of time using the form on this page so we can prepare enough for everyone.",
  },
  {
    question: "What if something's wrong with my order?",
    answer:
      "Contact us within 24 hours of delivery and we'll make it right — a replacement or a refund, your call.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-sienna)_0%,_transparent_45%),radial-gradient(ellipse_at_bottom_right,_var(--primary)_0%,_transparent_40%)] opacity-20"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            We&rsquo;d Love to Hear From You
          </p>
          <h1 className="mt-4 font-display text-4xl text-secondary sm:text-5xl md:text-6xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-text/70">
            Questions about an order, catering for your next event, or
            feedback on your last meal — we&rsquo;re here for it.
          </p>
        </div>
      </section>

      {/* Info cards */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-3 sm:px-6">
          {infoCards.map((card) => (
            <div
              key={card.label}
              className="flex flex-col gap-3 rounded-md border border-border bg-surface p-5"
            >
              <card.icon className="h-6 w-6 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-widest text-text/50">
                {card.label}
              </p>
              <div className="text-sm text-text/80">
                {card.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + visit panel */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Reach Out
            </p>
            <h2 className="font-display text-3xl text-secondary sm:text-4xl">
              Send an Inquiry
            </h2>
            <p className="text-text/70">
              For special events, media inquiries, or simply to share your
              feedback, use the form below. Our team will respond within 24
              hours.
            </p>
            <ContactForm />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-md border border-border bg-gradient-to-br from-primary/20 via-surface to-background text-center">
              <PinIcon className="h-8 w-8 text-primary" />
              <p className="font-display text-lg text-secondary">Find Us</p>
              <p className="max-w-[14rem] text-sm text-text/60">
                824 Heritage Square, 4th Avenue
                <br />
                Calgary, AB
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
                Opening Hours
              </h3>
              <ul className="mt-3 flex flex-col gap-1.5">
                {hours.map((item) => (
                  <li
                    key={item.day}
                    className="flex items-center justify-between text-sm text-text/70"
                  >
                    <span className="text-text/50">{item.day}</span>
                    <span>{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Curiosity
            </p>
            <h2 className="font-display text-3xl text-secondary sm:text-4xl">
              Frequently Asked
            </h2>
          </div>
          <div className="mt-10 flex flex-col gap-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-md border border-border bg-surface px-5 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-text marker:content-none">
                  {faq.question}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    className="h-4 w-4 flex-shrink-0 text-primary transition-transform group-open:rotate-180"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-text/60">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"
      />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 4.5h3.2l1.3 4.3-2 1.6a12 12 0 0 0 5.6 5.6l1.6-2 4.3 1.3v3.2c0 1-.9 1.8-1.9 1.6-9.1-1.4-14.5-6.8-15.9-15.9-.2-1 .8-1.9 1.8-1.7Z"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 6.5 8 6 8-6" />
    </svg>
  );
}
