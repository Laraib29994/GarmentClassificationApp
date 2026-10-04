import {
    formatPrice,
    getEstimatedPrice,
    getPriceCurrency,
    getPriceLastUpdated,
} from "../priceEstimator";

describe("Price Estimator", () => {
  test("returns standard shirt price", () => {
    expect(getEstimatedPrice("Shirt", "COTTON")).toEqual({
      price: 8,
      isFabricSpecific: false,
    });
  });

  test("returns linen shirt price", () => {
    expect(getEstimatedPrice("Shirt", "LINEN")).toEqual({
      price: 12.5,
      isFabricSpecific: true,
    });
  });

  test("returns standard jacket price", () => {
    expect(getEstimatedPrice("Jacket", "COTTON")).toEqual({
      price: 23,
      isFabricSpecific: false,
    });
  });

  test("returns linen jacket price", () => {
    expect(getEstimatedPrice("Jacket", "LINEN")).toEqual({
      price: 25,
      isFabricSpecific: true,
    });
  });

  test("returns wool jacket price", () => {
    expect(getEstimatedPrice("Jacket", "WOOL")).toEqual({
      price: 28,
      isFabricSpecific: true,
    });
  });

  test("returns standard dress price", () => {
    expect(getEstimatedPrice("Dress", "COTTON")).toEqual({
      price: 35,
      isFabricSpecific: false,
    });
  });

  test("returns linen dress price", () => {
    expect(getEstimatedPrice("Dress", "LINEN")).toEqual({
      price: 40,
      isFabricSpecific: true,
    });
  });

  test("returns silk dress price", () => {
    expect(getEstimatedPrice("Dress", "SILK")).toEqual({
      price: 45,
      isFabricSpecific: true,
    });
  });

  test("returns standard trousers price", () => {
    expect(getEstimatedPrice("Trousers", "COTTON")).toEqual({
      price: 20,
      isFabricSpecific: false,
    });
  });

  test("returns linen trousers price", () => {
    expect(getEstimatedPrice("Trousers", "LINEN")).toEqual({
      price: 22,
      isFabricSpecific: true,
    });
  });

  test("returns silk trousers price", () => {
    expect(getEstimatedPrice("Trousers", "SILK")).toEqual({
      price: 24.5,
      isFabricSpecific: true,
    });
  });

  test("uses standard price when selected fabric has no specific price", () => {
    expect(getEstimatedPrice("Jacket", "POLYESTER")).toEqual({
      price: 23,
      isFabricSpecific: false,
    });
  });

  test("returns null for unsupported garment", () => {
    expect(getEstimatedPrice("Shoes", "LEATHER")).toBeNull();
  });

  test("formats whole number price correctly", () => {
    expect(formatPrice(23)).toBe("$23.00");
  });

  test("formats decimal price correctly", () => {
    expect(formatPrice(24.5)).toBe("$24.50");
  });

  test("returns price list update date", () => {
    expect(getPriceLastUpdated()).toBe("2025-03-17");
  });

  test("returns NZD currency", () => {
    expect(getPriceCurrency()).toBe("NZD");
  });
});
