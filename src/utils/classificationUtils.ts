import type { ClassificationResult } from "../models/ClassificationResult";

// CREATES A CLASSIFICATION RESULT
export function createClassificationResult(
  garmentType: string,
  garmentConfidence: number,
  stainType: string,
  stainConfidence: number,
): ClassificationResult {
  return {
    garmentType,
    garmentConfidence,
    stainType,
    stainConfidence,
  };
}

// FORMATS THE CLASSIFICATION CONFIDENCE
export function formatConfidence(confidence: number): string {
  if (confidence === -1) {
    return "Manually Corrected";
  }

  return `${confidence}%`;
}

// VALIDATES THE CLASSIFICATION RESULT
export function isValidClassificationResult(
  result: ClassificationResult | null,
): boolean {
  if (!result) {
    return false;
  }

  return (
    result.garmentType.trim() !== "" &&
    result.stainType.trim() !== "" &&
    result.garmentConfidence >= -1 &&
    result.garmentConfidence <= 100 &&
    result.stainConfidence >= -1 &&
    result.stainConfidence <= 100
  );
}

// CONFIRMS THE EXISTING CLASSIFICATION RESULT
export function confirmClassification(
  result: ClassificationResult,
): ClassificationResult {
  return { ...result };
}

// CORRECTS THE GARMENT CLASSIFICATION
export function correctGarment(
  result: ClassificationResult,
  newGarmentType: string,
): ClassificationResult {
  return {
    ...result,
    garmentType: newGarmentType,
    garmentConfidence:
      newGarmentType === result.garmentType ? result.garmentConfidence : -1,
  };
}

// CORRECTS THE STAIN CLASSIFICATION
export function correctStain(
  result: ClassificationResult,
  newStainType: string,
): ClassificationResult {
  return {
    ...result,
    stainType: newStainType,
    stainConfidence:
      newStainType === result.stainType ? result.stainConfidence : -1,
  };
}
