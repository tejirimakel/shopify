export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="logo-flame" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E8A93A" />
          <stop offset="0.5" stopColor="#C88A0A" />
          <stop offset="1" stopColor="#A03828" />
        </linearGradient>
        <linearGradient id="logo-leaf" x1="4" y1="32" x2="60" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7A7030" />
          <stop offset="1" stopColor="#4A3A18" />
        </linearGradient>
      </defs>
      <path
        d="M32 4c4 6 6 11 6 15.5 0 4-2.5 7-6 7s-6-3-6-7C26 15 28 10 32 4Z"
        fill="url(#logo-flame)"
      />
      <path
        d="M32 60c4-6 6-11 6-15.5 0-4-2.5-7-6-7s-6 3-6 7C26 49 28 54 32 60Z"
        fill="url(#logo-flame)"
      />
      <path
        d="M4 32c7-3.5 12.5-4.5 16.5-3 3.5 1.3 4.7 4.6 3.2 7.7-1.5 3.1-5 4.2-8.5 2.9C11 38 7.3 35.5 4 32Z"
        fill="url(#logo-leaf)"
      />
      <path
        d="M60 32c-7-3.5-12.5-4.5-16.5-3-3.5 1.3-4.7 4.6-3.2 7.7 1.5 3.1 5 4.2 8.5 2.9C53 38 56.7 35.5 60 32Z"
        fill="url(#logo-leaf)"
      />
      <path
        d="M13 13c6.5 1 11 3.5 13 6.8 1.9 3.1 1 6.4-2 8-3 1.6-6.4.4-8.7-2.5C12.9 22.4 12.2 17.8 13 13Z"
        fill="url(#logo-flame)"
        opacity="0.9"
      />
      <path
        d="M51 51c-6.5-1-11-3.5-13-6.8-1.9-3.1-1-6.4 2-8 3-1.6 6.4-.4 8.7 2.5C51.1 41.6 51.8 46.2 51 51Z"
        fill="url(#logo-flame)"
        opacity="0.9"
      />
      <path
        d="M51 13c-1 6.5-3.5 11-6.8 13-3.1 1.9-6.4 1-8-2-1.6-3-.4-6.4 2.5-8.7C41.6 12.9 46.2 12.2 51 13Z"
        fill="url(#logo-flame)"
        opacity="0.9"
      />
      <path
        d="M13 51c1-6.5 3.5-11 6.8-13 3.1-1.9 6.4-1 8 2 1.6 3 .4 6.4-2.5 8.7C22.4 51.1 17.8 51.8 13 51Z"
        fill="url(#logo-flame)"
        opacity="0.9"
      />
      <circle cx="32" cy="32" r="6" fill="url(#logo-flame)" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark className={markClassName ?? "h-9 w-9"} />
      <span
        className={`font-display leading-[0.95] tracking-wide text-secondary ${wordmarkClassName ?? "text-lg"}`}
      >
        <span className="block">Madhura</span>
        <span className="block">Kitchen</span>
      </span>
    </span>
  );
}
