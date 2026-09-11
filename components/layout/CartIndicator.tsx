import Link from "next/link";

export function CartIndicator({ count = 0 }: { count?: number }) {
  return (
    <Link
      href="/cart"
      aria-label={`View cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative flex h-11 w-11 items-center justify-center rounded-md text-text transition-colors hover:bg-surface hover:text-primary"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h1.5l2.4 12.6a1.5 1.5 0 0 0 1.48 1.24h8.24a1.5 1.5 0 0 0 1.48-1.24L19.5 8.25H6"
        />
        <circle cx="9.75" cy="20.25" r="1" />
        <circle cx="17.25" cy="20.25" r="1" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-background">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
