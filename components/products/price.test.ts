import { describe, expect, it } from "vitest";

import { formatMoney } from "./price";

describe("formatMoney", () => {
  it("formats a USD amount", () => {
    expect(formatMoney({ amount: "24.00", currencyCode: "USD" })).toBe(
      "$24.00"
    );
  });

  it("formats a non-USD currency without hardcoding the symbol", () => {
    expect(formatMoney({ amount: "18.50", currencyCode: "EUR" })).toBe(
      "€18.50"
    );
  });
});
