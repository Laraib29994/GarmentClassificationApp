import { getRecommendation } from "../recommendationUtils";

describe("Recommendation Rules", () => {
  test("returns recommendation for cotton and coffee", () => {
    const result = getRecommendation("Coffee", "COTTON");

    expect(result).not.toBeNull();
    expect(result?.cleaningMethod).toBe("Professional Cleaning");
    expect(result?.treatment).toBe("Stain Treatment");
    expect(result?.recommendation).toBe("Recommended");
  });

  test("uses wool fabric rule", () => {
    const result = getRecommendation("Coffee", "WOOL");

    expect(result?.explanation).toContain("wool");
  });

  test("uses silk fabric rule", () => {
    const result = getRecommendation("Coffee", "SILK");

    expect(result?.explanation).toContain("silk");
  });

  test("uses oil stain rule", () => {
    const result = getRecommendation("Oil", "COTTON");

    expect(result?.explanation).toContain("oil");
  });

  test("uses ink stain rule", () => {
    const result = getRecommendation("Ink", "COTTON");

    expect(result?.explanation).toContain("ink");
  });

  test("returns null for unsupported fabric", () => {
    const result = getRecommendation("Coffee", "LEATHER");

    expect(result).toBeNull();
  });

  test("returns null for unsupported stain", () => {
    const result = getRecommendation("Paint", "COTTON");

    expect(result).toBeNull();
  });
});
