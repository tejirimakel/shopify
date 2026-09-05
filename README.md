# WordPress → Next.js + Shopify Migration

## Overview

Proof-of-concept migration of a WordPress/WooCommerce
storefront to a headless Next.js application backed by Shopify.

## Objective

Demonstrate the architecture and implementation approach
for migrating a WordPress commerce experience to:

- Next.js App Router
- TypeScript
- Shopify Storefront API
- React Server Components

## Migration Scope

For demonstration purposes, eight products were migrated
from the existing WordPress/WooCommerce environment.

## Architecture

WordPress/WooCommerce
        ↓
Product Export
        ↓
Data Transformation
        ↓
Shopify
        ↓
Storefront API
        ↓
Next.js App Router

## Features

- Product listing
- Dynamic product pages
- Shopify Storefront API integration
- Product image optimization
- Shopify cart
- Shopify checkout
- Dynamic SEO metadata
- Loading states
- Not-found handling
- Responsive UI

## Migration Decisions

used shopify inbuilt data importer for syncing products and credentials from woo commerce in csv format

## Getting Started

### Prerequisites

- Node.js 20+
- A Shopify store with the Storefront API enabled, and a Storefront API access token

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and fill in your Shopify credentials:

   ```bash
   cp .env.example .env.local
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Visit `/api/health/shopify` and confirm `{ "ok": true }` before relying on live product data.

### Environment Variables

Defined in `.env.example`; copy it to `.env.local` and set:

| Variable | Required | Purpose |
| --- | --- | --- |
| `SHOPIFY_STORE_DOMAIN` | Yes (unless using mock data) | Your store's domain, e.g. `your-store.myshopify.com` — no protocol needed. |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes (unless using mock data) | Storefront API access token. |
| `SHOPIFY_API_VERSION` | No | Storefront API version to pin to. Defaults to `2024-01`. After changing this, hit `/api/health/shopify` and confirm `ok: true`. |
| `SHOPIFY_MOCK_DATA` | No | Set to `true` to run against bundled mock product/cart data instead of a live store — see below. Defaults to `false`. |
| `SHOPIFY_REVALIDATE_SECONDS` | No | Seconds product data is cached before revalidating. Lower means fresher data after editing products in Shopify admin, at the cost of more requests. Defaults to `30`. |

If `SHOPIFY_STORE_DOMAIN` or `SHOPIFY_STOREFRONT_ACCESS_TOKEN` is missing while `SHOPIFY_MOCK_DATA` is not `true`, pages render a "not configured correctly" notice rather than a generic error, so a missing credential is easy to tell apart from a real Shopify outage.

### Mock Data Mode

Setting `SHOPIFY_MOCK_DATA=true` in `.env.local` swaps every product and cart operation (`lib/shopify/client.ts`) over to the fixtures in `lib/shopify/mock-data.ts` and `lib/shopify/mock-cart.ts`, with no network calls to Shopify. Useful for offline development or as a demo fallback when a live store isn't reachable. Production code paths never hardcode product data outside of this explicit opt-in mode.

### Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Run the production build (run `npm run build` first). |
| `npm run test` | Run the Vitest test suite. |
| `npm run lint` | Run ESLint. |
