import path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: {
      SHOPIFY_MOCK_DATA: "true",
    },
    // lib/shopify/mock-cart.ts persists to a real file on disk
    // (.tmp/mock-carts.json) rather than an in-memory store, and more than
    // one test file (cart-actions.test.ts, mock-cart.test.ts) exercises it.
    // Running test files in parallel races on that shared file; keep file
    // execution serialized so each file's beforeEach reset is safe.
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
