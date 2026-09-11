"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type NavLinkProps = ComponentProps<typeof Link> & { href: string };

export function NavLink({ href, className, children, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        isActive ? "text-primary" : "text-text"
      } ${className ?? ""}`}
      {...props}
    >
      {children}
    </Link>
  );
}
