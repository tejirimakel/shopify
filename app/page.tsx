import Link from "next/link";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductImage } from "@/components/products/ProductImage";
import { ShopifyConfigError, getProducts, searchProducts } from "@/lib/shopify/client";
import type { Product } from "@/lib/shopify/types";

function categoryHref(productType: string): string {
  return `/products?filter=${encodeURIComponent(JSON.stringify({ productType }))}`;
}

const MENU_CATEGORY_DEFS = [
  {
    title: "Starters & Street Food",
    description: "Golden samosas, crispy dosa, and tangy bites made fresh.",
    gradient: "from-accent-sienna/60 via-surface to-background",
    productType: "Starters & Street Food",
  },
  {
    title: "The Main Event",
    description: "Slow-cooked curries and biryanis layered with saffron.",
    gradient: "from-primary/50 via-surface to-background",
    productType: "Mains",
  },
  {
    title: "Sweet Endings",
    description: "Rose-scented, cardamom-laced desserts to finish the meal.",
    gradient: "from-accent-olive/50 via-surface to-background",
    productType: "Desserts",
  },
];

const features = [
  {
    title: "Authentic Recipes",
    description: "Family recipes from Tamil Nadu, unchanged for generations.",
    icon: FlameIcon,
  },
  {
    title: "Fresh Ingredients",
    description: "Hand-sourced spices from South India, local produce daily.",
    icon: LeafIcon,
  },
  {
    title: "Fast Online Ordering",
    description: "Order in minutes, delivered in 30–60 minutes.",
    icon: ClockIcon,
  },
  {
    title: "Family Friendly",
    description: "Children's menu, spacious seating, and a warm welcome for all.",
    icon: UsersIcon,
  },
];

const testimonials = [
  {
    quote:
      "The closest thing to home-cooked Tamil food I've found in Canada. Crispy dosa, rich sambar, genuine warmth.",
    name: "Priya S.",
    location: "Calgary",
  },
  {
    quote:
      "Lamb Rogan Josh — layers of flavour unlike anything I've had before. Now my go-to for special occasions.",
    name: "James M.",
    location: "Calgary",
  },
  {
    quote:
      "Ordered for a family gathering. Food arrived hot, beautifully packed. Butter chicken was a massive hit.",
    name: "Anika P.",
    location: "Calgary",
  },
];

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const result = await searchProducts({ sort: "featured", first: 4 });
    return result.products;
  } catch (error) {

    if (error instanceof ShopifyConfigError) {
      return [];
    }
    throw error;
  }
}

async function getShowcaseProducts(): Promise<Product[]> {
  try {
    return await getProducts(50);
  } catch (error) {
    if (error instanceof ShopifyConfigError) {
      return [];
    }
    throw error;
  }
}

export default async function Home() {
  const [featuredProducts, showcaseProducts] = await Promise.all([
    getFeaturedProducts(),
    getShowcaseProducts(),
  ]);

  const dishes = showcaseProducts.map((product) => product.title);

  const menuCategories = MENU_CATEGORY_DEFS.map((category) => ({
    ...category,
    href: categoryHref(category.productType),
    image:
      showcaseProducts.find(
        (product) => product.productType === category.productType
      )?.images[0] ?? null,
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="herobg absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-sienna)_0%,_transparent_45%),radial-gradient(ellipse_at_bottom_left,_var(--primary)_0%,_transparent_40%)] opacity-20"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 pb-40 pt-40 sm:px-6 sm:pt-84 sm:pb-88">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Est. 2026 &middot; Calgary, Alberta
          </p>
          <h1 className="font-display text-5xl leading-[1.05] text-secondary sm:text-6xl md:text-7xl">
            <span className="block">The Soul</span>
            <span className="block italic text-primary">of Madhura</span>
          </h1>
          <p className="max-w-lg text-base text-text/70 sm:text-lg">
            From Kari Dosai to Sukku Malli Kaapi, Madhura Kitchen brings dishes
            shaped by the ingredients, methods, and food culture of Tamil Nadu.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/products"
              className="rounded-sm bg-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-background transition-colors hover:opacity-90"
            >
              Order Online
            </Link>
            <Link
              href="/products"
              className="rounded-sm border border-border px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-text transition-colors hover:border-primary hover:text-primary"
            >
              Explore Menu
            </Link>
          </div>
        </div>

        {/* Dish ticker */}
        {dishes.length > 0 && (
          <div className="relative border-t border-border bg-surface py-3">
            <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-10">
              {[...dishes, ...dishes].map((dish, i) => (
                <span
                  key={`${dish}-${i}`}
                  className="flex items-center gap-10 text-xs uppercase tracking-[0.2em] text-text/40"
                >
                  {dish}
                  <span aria-hidden="true" className="text-primary/50">
                    &middot;
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Our Story */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 md:grid-cols-2 md:items-center">
          <div className="relative ">
            <div className="bg-p1 aspect-[4/5] w-full rounded-md bg-gradient-to-br from-primary/30 via-surface to-background" />
            <div className="absolute -bottom-6 -right-4 rounded-sm border border-border bg-surface px-5 py-4 shadow-lg sm:right-6">
              <p className="font-display text-xl text-primary">1987</p>
              <p className="max-w-[10rem] text-[10px] uppercase tracking-widest text-text/50">
                Year the recipes were first written
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Our Story
            </p>
            <h2 className="font-display text-4xl leading-tight text-secondary sm:text-5xl">
              Craft cuisine rooted in{" "}
              <span className="italic text-primary">centuries of fire</span>
            </h2>
            <p className="text-text/70">
              Madhura Kitchen was born from a single obsession: to bring the
              unapologetic boldness of Tamil Nadu&rsquo;s street kitchens to
              Calgary&rsquo;s table. Every spice is hand-sourced, every gravy is
              a day&rsquo;s work.
            </p>
            <p className="text-text/70">
              We call it Chennai craft cuisine — where ancient technique meets a
              modern room, and every plate carries the warmth of Southern
              hospitality.
            </p>
            <div className="flex gap-10 pt-4">
              <div>
                <p className="font-display text-2xl text-primary">35+</p>
                <p className="text-xs uppercase tracking-widest text-text/50">
                  Signature Dishes
                </p>
              </div>
              <div>
                <p className="font-display text-2xl text-primary">100%</p>
                <p className="text-xs uppercase tracking-widest text-text/50">
                  Authentic Spices
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Serve */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Our Menu
              </p>
              <h2 className="font-display text-4xl text-secondary sm:text-5xl">
                What we serve
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold uppercase tracking-widest text-primary hover:opacity-80"
            >
              Full Menu &rarr;
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {menuCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group flex flex-col gap-4 rounded-md border border-border bg-surface p-5 transition-colors hover:border-primary"
              >
                <div
                  className={`relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-gradient-to-br ${category.gradient}`}
                >
                  {category.image && (
                    <ProductImage
                      src={category.image.url}
                      alt={category.image.altText ?? category.title}
                      sizes="(min-width: 640px) 33vw, 100vw"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-xl text-secondary">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-sm text-text/60">
                    {category.description}
                  </p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary group-hover:opacity-80">
                  View Menu &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      {featuredProducts.length > 0 && (
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4 pb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Order Online
                </p>
                <h2 className="font-display text-4xl text-secondary sm:text-5xl">
                  Fan favourites
                </h2>
              </div>
              <Link
                href="/products"
                className="text-xs font-semibold uppercase tracking-widest text-primary hover:opacity-80"
              >
                Shop All &rarr;
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Why Madhura Kitchen */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-start">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Our Promise
              </p>
              <h2 className="font-display text-4xl text-secondary sm:text-5xl">
                Why Madhura Kitchen
              </h2>
              <p className="text-text/70">
                We don&rsquo;t cut corners. Every dish is a commitment to the
                original — to the fire, the patience, and the pride of South
                Indian cooking.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col gap-3 rounded-md border border-border bg-surface p-5"
                >
                  <feature.icon className="h-6 w-6 text-primary" />
                  <h3 className="text-sm font-semibold text-secondary">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text/60">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Guests
          </p>
          <h2 className="font-display text-4xl text-secondary sm:text-5xl">
            What people say
          </h2>
          <p className="mt-2 text-sm text-text/50">4.8 average &middot; 200+ reviews</p>
          <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="flex flex-col gap-4 rounded-md border border-border bg-surface p-6"
              >
                <div className="flex gap-1 text-primary" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-sm text-text/70">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-text/50">
                  {testimonial.name} &middot; {testimonial.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.77l-5.18 2.67.99-5.77-4.19-4.08 5.79-.84L10 1.5z" />
    </svg>
  );
}

function FlameIcon({ className }: { className?: string }) {
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
        d="M12 2c1.5 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1 .3-1.8.8-2.6C9.5 8.8 9 10 9 11a3 3 0 1 0 6 0c0-2.5-1.5-4-3-6.5C11.3 3.3 11.6 2.6 12 2Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 15a5 5 0 0 0 10 0c0-1.2-.3-2-.7-2.8"
      />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
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
        d="M5 19c8 0 14-6 14-14 0 0-11-1-14 6-2 5 0 8 0 8Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19c2-4 5-8 10-11" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3.5 2" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
    >
      <circle cx="9" cy="8" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6.5a3 3 0 0 1 0 5.8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 20c0-2.8-1.8-5.2-4.5-5.9" />
    </svg>
  );
}
