"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-6">
        <p className="font-display text-xl text-secondary">Message sent</p>
        <p className="text-sm text-text/60">
          Thanks for reaching out — we&rsquo;ll get back to you within 24
          hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-widest text-text/60">
            Full name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="E.g. Julianne Moore"
            className="rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-widest text-text/60">
            Email address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="E.g. julianne@example.com"
            className="rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-phone" className="text-xs font-semibold uppercase tracking-widest text-text/60">
          Phone number (optional)
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          placeholder="+1 (___) ___-____"
          className="rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-widest text-text/60">
          Your message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          className="rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text/40 focus:border-primary focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="mt-2 self-start rounded-sm bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:opacity-90"
      >
        Send Message
      </button>
    </form>
  );
}
