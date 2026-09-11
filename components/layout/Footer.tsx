export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-text/70 sm:px-6">
        <p>&copy; {new Date().getFullYear()} Shop. All rights reserved.</p>
        <p className="text-xs">A headless storefront proof of concept, built on Next.js and Shopify.</p>
      </div>
    </footer>
  );
}
