import { validateAnalysis } from "../validateAnalysis";

describe("Analyse Input Validation", () => {
  test("analysis is allowed when all required inputs exist", () => {
    const result = validateAnalysis("garment.jpg", "stain.jpg", "COTTON");

    expect(result).toBeNull();
  });

  test("analysis is blocked when garment image is missing", () => {
    const result = validateAnalysis(null, "stain.jpg", "COTTON");

    expect(result).toBe("Garment image required");
  });

  test("analysis is blocked when stain image is missing", () => {
    const result = validateAnalysis("garment.jpg", null, "COTTON");

    expect(result).toBe("Stain image required");
  });

  test("analysis is blocked when fabric is missing", () => {
    const result = validateAnalysis("garment.jpg", "stain.jpg", null);

    expect(result).toBe("Fabric type required");
  });

  test("correct validation error is returned for missing input", () => {
    const garmentError = validateAnalysis(null, "stain.jpg", "COTTON");

    const stainError = validateAnalysis("garment.jpg", null, "COTTON");

    const fabricError = validateAnalysis("garment.jpg", "stain.jpg", null);

    expect(garmentError).toBe("Garment image required");
    expect(stainError).toBe("Stain image required");
    expect(fabricError).toBe("Fabric type required");
  });

  test.todo(
    "correct inputs are passed to the analysis function - retest after ML integration",
  );
});
