"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageProps = {
  src: string | undefined;
  alt: string;
  sizes?: string;
  priority?: boolean;
};

export function ProductImage({ src, alt, sizes, priority }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full items-center justify-center bg-border/40 text-xs text-text/50"
      >
        Image unavailable
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
      priority={priority}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}
