import type { Tensor } from "onnxruntime-react-native";

// DEFINES THE GARMENT CATEGORIES
export const GARMENT_CLASSES = [
  "Short-sleeve top",
  "Long-sleeve top",
  "Short-sleeve outerwear",
  "Long-sleeve outerwear",
  "Vest",
  "Sling",
  "Shorts",
  "Trousers",
  "Skirt",
  "Short-sleeve dress",
  "Long-sleeve dress",
  "Vest dress",
  "Sling dress",
] as const;

// DEFINES THE GARMENT PREDICTION RESULT
export interface GarmentPrediction {
  garmentType: string;
  confidence: number;
  classId: number;
}

// DEFINES THE MINIMUM DETECTION CONFIDENCE
const CONFIDENCE_THRESHOLD = 0.5;

export function decodeGarmentPrediction(
  output: Tensor,
): GarmentPrediction | null {
  // VALIDATES THE MODEL OUTPUT SHAPE
  const dimensions = output.dims;

  if (dimensions.length !== 3 || dimensions[0] !== 1 || dimensions[2] !== 38) {
    throw new Error("Unexpected garment model output shape");
  }

  // READS THE MODEL DETECTION VALUES
  if (!(output.data instanceof Float32Array)) {
    throw new Error("Unexpected garment model output type");
  }

  const values = output.data;
  const detectionCount = dimensions[1];
  const valuesPerDetection = dimensions[2];

  let bestPrediction: GarmentPrediction | null = null;

  // CHECKS EACH GARMENT DETECTION
  for (let index = 0; index < detectionCount; index++) {
    const offset = index * valuesPerDetection;

    const confidence = values[offset + 4];
    const classId = values[offset + 5];

    // SKIPS INVALID OR LOW-CONFIDENCE DETECTIONS
    if (
      !Number.isFinite(confidence) ||
      confidence < CONFIDENCE_THRESHOLD ||
      confidence > 1 ||
      !Number.isInteger(classId) ||
      classId < 0 ||
      classId >= GARMENT_CLASSES.length
    ) {
      continue;
    }

    // KEEPS THE HIGHEST-CONFIDENCE GARMENT
    if (bestPrediction === null || confidence > bestPrediction.confidence) {
      bestPrediction = {
        garmentType: GARMENT_CLASSES[classId],
        confidence,
        classId,
      };
    }
  }

  // RETURNS THE BEST GARMENT PREDICTION
  return bestPrediction;
}
