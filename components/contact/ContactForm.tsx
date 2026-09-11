"use client";

import { useState, useTransition } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(formData: FormData): string | null {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) {
    return "Please enter your full name.";
  }
  if (!EMAIL_PATTERN.test(email)) {
    return "Please enter a valid email address.";
  }
  if (!message) {
    return "Please enter a message.";
  }
  return null;
}

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (status === "success") {
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
        const formData = new FormData(event.currentTarget);
        const validationError = validate(formData);
        if (validationError) {
          setStatus("error");
          setError(validationError);
          return;
        }
        setStatus("idle");
        setError(null);
        startTransition(async () => {
          try {
            // Simulated network call — no backend exists yet; replace when a real submit endpoint is wired up
            await new Promise((resolve) => setTimeout(resolve, 600));
            setStatus("success");
          } catch {
            setStatus("error");
            setError("Something went wrong. Please try again.");
          }
        });
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
            className="rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text/40 focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
            className="rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text/40 focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
          className="rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text/40 focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
          className="rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text/40 focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 self-start rounded-sm bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
      {status === "error" && error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </form>
  );
}
