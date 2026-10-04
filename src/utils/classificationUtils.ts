import type { ClassificationResult } from "../models/ClassificationResult";

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

export function formatConfidence(confidence: number): string {
  return `${confidence}%`;
}

export function isValidClassificationResult(
  result: ClassificationResult | null,
): boolean {
  if (!result) {
    return false;
  }

  return (
    result.garmentType.trim() !== "" &&
    result.stainType.trim() !== "" &&
    result.garmentConfidence >= 0 &&
    result.garmentConfidence <= 100 &&
    result.stainConfidence >= 0 &&
    result.stainConfidence <= 100
  );
}

export function confirmClassification(
  result: ClassificationResult,
): ClassificationResult {
  return { ...result };
}

export function correctGarment(
  result: ClassificationResult,
  newGarmentType: string,
): ClassificationResult {
  return {
    ...result,
    garmentType: newGarmentType,
    garmentConfidence: 100,
  };
}

export function correctStain(
  result: ClassificationResult,
  newStainType: string,
): ClassificationResult {
  return {
    ...result,
    stainType: newStainType,
    stainConfidence: 100,
  };
}
