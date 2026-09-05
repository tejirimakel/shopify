/**
 * Rendered inline by a page's Server Component when required Shopify
 * environment variables are missing. Deliberately distinct from the
 * generic error.tsx boundaries (see app/products/error.tsx, app/cart/error.tsx,
 * app/error.tsx): a Server Component's thrown error message/name does not
 * reliably survive to a client error boundary in production (Next.js
 * redacts it to a bare `digest`), so a page-level try/catch around
 * `instanceof ShopifyConfigError` is the only place this distinction can be
 * made correctly. See lib/shopify/client.ts for ShopifyConfigError.
 */
export function ConfigErrorNotice() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <h1 className="text-xl font-semibold text-error">
        This store isn&apos;t configured correctly
      </h1>
      <p className="max-w-md text-sm text-text/60">
        Missing required environment variables. If you&apos;re the site
        administrator, check the Shopify configuration for this deployment.
      </p>
    </div>
  );
}
