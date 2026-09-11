import { describe, expect, it } from "vitest";

import {
  buildSearchHref,
  parseProductSearchParams,
  toggleFilterInput,
} from "./product-search";

describe("parseProductSearchParams", () => {
  it("defaults to featured/empty query/no filters when nothing is set", () => {
    const state = parseProductSearchParams(new URLSearchParams());
    expect(state).toEqual({ query: "", sort: "featured", filters: [], after: null });
  });

  it("reads q, sort, filter, and after", () => {
    const params = new URLSearchParams(
      "q=dosai&sort=price-asc&filter=%7B%22available%22%3Atrue%7D&after=cursor1"
    );
    const state = parseProductSearchParams(params);
    expect(state.query).toBe("dosai");
    expect(state.sort).toBe("price-asc");
    expect(state.filters).toEqual(['{"available":true}']);
    expect(state.after).toBe("cursor1");
  });

  it("falls back to featured for an unrecognized sort value", () => {
    const params = new URLSearchParams("sort=not-a-real-sort");
    expect(parseProductSearchParams(params).sort).toBe("featured");
  });

  it("dedupes repeated filter params", () => {
    const params = new URLSearchParams();
    params.append("filter", "a");
    params.append("filter", "a");
    params.append("filter", "b");
    expect(parseProductSearchParams(params).filters).toEqual(["a", "b"]);
  });
});

describe("buildSearchHref", () => {
  const base = { query: "", sort: "featured" as const, filters: [], after: null };

  it("returns the bare path when nothing is set", () => {
    expect(buildSearchHref(base)).toBe("/products");
  });

  it("includes q, sort, and filter params when present", () => {
    const href = buildSearchHref({
      query: "dosai",
      sort: "price-asc",
      filters: ["a", "b"],
      after: null,
    });
    const url = new URL(href, "http://example.com");
    expect(url.pathname).toBe("/products");
    expect(url.searchParams.get("q")).toBe("dosai");
    expect(url.searchParams.get("sort")).toBe("price-asc");
    expect(url.searchParams.getAll("filter")).toEqual(["a", "b"]);
  });

  it("omits sort when it's the default", () => {
    const href = buildSearchHref({ ...base, sort: "featured" });
    expect(href).not.toContain("sort=");
  });

  it("applies overrides on top of the current state", () => {
    const href = buildSearchHref(base, { query: "rice" });
    expect(new URL(href, "http://example.com").searchParams.get("q")).toBe("rice");
  });

  it("resets `after` when something other than `after` changes", () => {
    const withCursor = { ...base, after: "cursor1" };
    const href = buildSearchHref(withCursor, { query: "rice" });
    expect(new URL(href, "http://example.com").searchParams.get("after")).toBeNull();
  });

  it("keeps an explicit `after` override", () => {
    const href = buildSearchHref(base, { after: "cursor2" });
    expect(new URL(href, "http://example.com").searchParams.get("after")).toBe("cursor2");
  });
});

describe("toggleFilterInput", () => {
  it("adds an input not already present", () => {
    expect(toggleFilterInput(["a"], "b")).toEqual(["a", "b"]);
  });

  it("removes an input already present", () => {
    expect(toggleFilterInput(["a", "b"], "a")).toEqual(["b"]);
  });
});
