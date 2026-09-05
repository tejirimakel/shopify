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
