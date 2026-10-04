import {
    confirmClassification,
    correctGarment,
    correctStain,
} from "../classificationUtils";

describe("Classification Confirmation and Correction", () => {
  const originalResult = {
    garmentType: "Shirt",
    garmentConfidence: 92,
    stainType: "Coffee",
    stainConfidence: 87,
  };

  test("confirming garment keeps original classification", () => {
    const result = confirmClassification(originalResult);

    expect(result.garmentType).toBe("Shirt");
    expect(result.garmentConfidence).toBe(92);
  });

  test("confirming stain keeps original classification", () => {
    const result = confirmClassification(originalResult);

    expect(result.stainType).toBe("Coffee");
    expect(result.stainConfidence).toBe(87);
  });

  test("correcting garment updates classification", () => {
    const result = correctGarment(originalResult, "Dress");

    expect(result.garmentType).toBe("Dress");
  });

  test("correcting stain updates classification", () => {
    const result = correctStain(originalResult, "Oil");

    expect(result.stainType).toBe("Oil");
  });

  test("corrected garment result is stored correctly", () => {
    const result = correctGarment(originalResult, "Jacket");

    expect(result).toEqual({
      garmentType: "Jacket",
      garmentConfidence: 100,
      stainType: "Coffee",
      stainConfidence: 87,
    });
  });

  test("corrected stain result is stored correctly", () => {
    const result = correctStain(originalResult, "Ink");

    expect(result).toEqual({
      garmentType: "Shirt",
      garmentConfidence: 92,
      stainType: "Ink",
      stainConfidence: 100,
    });
  });

  test("correcting garment does not change stain result", () => {
    const result = correctGarment(originalResult, "Dress");

    expect(result.stainType).toBe("Coffee");
    expect(result.stainConfidence).toBe(87);
  });

  test("correcting stain does not change garment result", () => {
    const result = correctStain(originalResult, "Oil");

    expect(result.garmentType).toBe("Shirt");
    expect(result.garmentConfidence).toBe(92);
  });

  test.todo(
    "confirmed or corrected results are passed to recommendation - retest after recommendation integration",
  );
});
