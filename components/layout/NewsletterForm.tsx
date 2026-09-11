"use client";

import { useState, useTransition } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(formData: FormData): string | null {
  const email = String(formData.get("email") ?? "").trim();

  if (!EMAIL_PATTERN.test(email)) {
    return "Please enter a valid email address.";
  }
  return null;
}

export function NewsletterForm({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (status === "success") {
    return (
      <p className={className ?? "text-sm text-text/70"}>
        Thanks — you&rsquo;re on the list!
      </p>
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
      className={className ?? "flex flex-col gap-2"}
    >
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="min-w-0 flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text/40 focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Joining..." : "Join"}
        </button>
      </div>
      {status === "error" && error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </form>
  );
}
