import { describe, expect, it } from "vitest";

import { mockSearchProducts } from "./mock-search";

describe("mockSearchProducts", () => {
  it("returns all products when no query/filters are given", async () => {
    const result = await mockSearchProducts({});
    expect(result.products.length).toBeGreaterThan(0);
    expect(result.totalCount).toBe(result.products.length);
  });

  it("filters by search text against title/description", async () => {
    const result = await mockSearchProducts({ query: "biryani" });
    expect(result.products).toHaveLength(1);
    expect(result.products[0].handle).toBe("chicken-biryani");
  });

  it("filters by availability", async () => {
    const result = await mockSearchProducts({
      filters: [JSON.stringify({ available: false })],
    });
    expect(result.products.every((p) => !p.availableForSale)).toBe(true);
    expect(result.products.length).toBeGreaterThan(0);
  });

  it("filters by product type", async () => {
    const result = await mockSearchProducts({
      filters: [JSON.stringify({ productType: "Mains" })],
    });
    expect(result.products.every((p) => p.productType === "Mains")).toBe(true);
    expect(result.products.length).toBeGreaterThan(0);
  });

  it("filters by price range", async () => {
    const result = await mockSearchProducts({
      filters: [JSON.stringify({ price: { min: 20, max: 30 } })],
    });
    for (const product of result.products) {
      const price = Number(product.priceRange.minVariantPrice.amount);
      expect(price).toBeGreaterThanOrEqual(20);
      expect(price).toBeLessThanOrEqual(30);
    }
    expect(result.products.length).toBeGreaterThan(0);
  });

  it("combines multiple filters with AND", async () => {
    const result = await mockSearchProducts({
      filters: [
        JSON.stringify({ productType: "Mains" }),
        JSON.stringify({ price: { max: 20 } }),
      ],
    });
    expect(result.products.length).toBeGreaterThan(0);
    for (const product of result.products) {
      expect(product.productType).toBe("Mains");
      expect(Number(product.priceRange.minVariantPrice.amount)).toBeLessThanOrEqual(20);
    }
  });

  it("sorts by price ascending and descending", async () => {
    const asc = await mockSearchProducts({ sort: "price-asc" });
    const prices = asc.products.map((p) => Number(p.priceRange.minVariantPrice.amount));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));

    const desc = await mockSearchProducts({ sort: "price-desc" });
    const pricesDesc = desc.products.map((p) => Number(p.priceRange.minVariantPrice.amount));
    expect(pricesDesc).toEqual([...pricesDesc].sort((a, b) => b - a));
  });

  it("sorts by newest first", async () => {
    const result = await mockSearchProducts({ sort: "newest" });
    const dates = result.products.map((p) => new Date(p.createdAt).getTime());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it("returns Availability, Price, and Product type facets", async () => {
    const result = await mockSearchProducts({});
    const labels = result.facets.map((f) => f.label);
    expect(labels).toEqual(expect.arrayContaining(["Availability", "Price", "Product type"]));
  });
});
