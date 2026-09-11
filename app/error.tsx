"use client";

import { ErrorNotice } from "@/components/ErrorNotice";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorNotice reset={reset} />;
}
