import {
    createClassificationResult,
    formatConfidence,
    isValidClassificationResult,
} from "../classificationUtils";

describe("Classification Results", () => {
  test("garment result is correctly stored in classification result", () => {
    const result = createClassificationResult("Shirt", 92, "Coffee", 87);

    expect(result.garmentType).toBe("Shirt");
    expect(result.garmentConfidence).toBe(92);
  });

  test("stain result is correctly stored in classification result", () => {
    const result = createClassificationResult("Shirt", 92, "Coffee", 87);

    expect(result.stainType).toBe("Coffee");
    expect(result.stainConfidence).toBe(87);
  });

  test("classification result contains the values required by results screen", () => {
    const result = createClassificationResult("Shirt", 92, "Coffee", 87);

    expect(result).toEqual({
      garmentType: "Shirt",
      garmentConfidence: 92,
      stainType: "Coffee",
      stainConfidence: 87,
    });
  });

  test("garment confidence is displayed as a percentage", () => {
    expect(formatConfidence(92)).toBe("92%");
  });

  test("stain confidence is displayed as a percentage", () => {
    expect(formatConfidence(87)).toBe("87%");
  });

  test("valid classification result is accepted", () => {
    const result = createClassificationResult("Shirt", 92, "Coffee", 87);

    expect(isValidClassificationResult(result)).toBe(true);
  });

  test("missing classification result is rejected", () => {
    expect(isValidClassificationResult(null)).toBe(false);
  });

  test("classification result with missing garment type is rejected", () => {
    const result = createClassificationResult("", 92, "Coffee", 87);

    expect(isValidClassificationResult(result)).toBe(false);
  });

  test("classification result with missing stain type is rejected", () => {
    const result = createClassificationResult("Shirt", 92, "", 87);

    expect(isValidClassificationResult(result)).toBe(false);
  });

  test("classification result with invalid confidence is rejected", () => {
    const result = createClassificationResult("Shirt", 120, "Coffee", 87);

    expect(isValidClassificationResult(result)).toBe(false);
  });

  test.todo("real garment classification result is received from ML model");

  test.todo("real stain classification result is received from ML model");
});
