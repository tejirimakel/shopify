import Link from "next/link";
import Image from "next/image";
import { NewsletterForm } from "./NewsletterForm";

const navigate = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Menu" },
  { href: "/contact", label: "Contact" },
];

const hours = [
  { day: "Tue — Fri", time: "11am – 10pm" },
  { day: "Saturday", time: "10am – 11pm" },
  { day: "Sunday", time: "10am – 10pm" },
  { day: "Monday", time: "Closed" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Image src="/logoh2.png" alt="Madhura Kitchen Logo" width={100} height={100} className="h-16 w-40" />
          <p className="max-w-xs text-sm text-text/60">
            Celebrating the soul of South India in Calgary, since 2026.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            Navigate
          </h3>
          <ul className="flex flex-col gap-2">
            {navigate.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-text/70 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            Hours
          </h3>
          <ul className="flex flex-col gap-1.5">
            {hours.map((item) => (
              <li key={item.day} className="text-sm text-text/70">
                <span className="text-text/50">{item.day}</span>{" "}
                <span>{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            Stay Connected
          </h3>
          <p className="text-sm text-text/60">
            Specials, new dishes, and events — delivered to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-text/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} Madhura Kitchen, Calgary AB.</p>
          <p>824 Heritage Square, 4th Avenue &middot; +1 (403) 555-0182</p>
        </div>
      </div>
    </footer>
  );
}
