import type { Tensor } from "onnxruntime-react-native";

// DEFINES THE STAIN CATEGORIES
export const STAIN_CLASSES = [
  "Coffee",
  "Grease",
  "Ink",
  "Objects",
  "Oil",
  "Paint",
] as const;

// DEFINES THE STAIN PREDICTION RESULT
export interface StainPrediction {
  stainType: string;
  confidence: number;
  classId: number;
}

// DEFINES THE MINIMUM DETECTION CONFIDENCE
const CONFIDENCE_THRESHOLD = 0.5;

// DEFINES THE CLASS TO IGNORE
const IGNORED_CLASS_ID = 3;

export function decodeStainPrediction(output: Tensor): StainPrediction | null {
  // VALIDATES THE MODEL OUTPUT SHAPE
  const dimensions = output.dims;

  if (
    dimensions.length !== 3 ||
    dimensions[0] !== 1 ||
    dimensions[1] !== 10 ||
    dimensions[2] !== 5376
  ) {
    throw new Error("Unexpected stain model output shape");
  }

  // VALIDATES THE MODEL OUTPUT TYPE
  if (!(output.data instanceof Float32Array)) {
    throw new Error("Unexpected stain model output type");
  }

  // READS THE MODEL DETECTION VALUES
  const values = output.data;
  const detectionCount = dimensions[2];

  let bestPrediction: StainPrediction | null = null;

  // STORES THE HIGHEST CONFIDENCE FOR EACH CLASS
  const highestClassScores = new Array<number>(STAIN_CLASSES.length).fill(0);

  // CHECKS EVERY DETECTION CANDIDATE
  for (let index = 0; index < detectionCount; index++) {
    for (let classId = 0; classId < STAIN_CLASSES.length; classId++) {
      // SKIPS THE UNWANTED OBJECTS CLASS
      if (classId === IGNORED_CLASS_ID) {
        continue;
      }

      // READS THE CLASS CONFIDENCE
      const confidence = values[(4 + classId) * detectionCount + index];

      // SKIPS INVALID CONFIDENCE VALUES
      if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
        continue;
      }

      // STORES THE HIGHEST SCORE FOR THE CLASS
      if (confidence > highestClassScores[classId]) {
        highestClassScores[classId] = confidence;
      }

      // SKIPS DETECTIONS BELOW THE CONFIDENCE THRESHOLD
      if (confidence < CONFIDENCE_THRESHOLD) {
        continue;
      }

      // KEEPS THE HIGHEST-CONFIDENCE PREDICTION
      if (bestPrediction === null || confidence > bestPrediction.confidence) {
        bestPrediction = {
          stainType: STAIN_CLASSES[classId],
          confidence,
          classId,
        };
      }
    }
  }

  // DISPLAYS THE HIGHEST SCORE FOR EACH STAIN CLASS
  console.log("----- STAIN CLASS CONFIDENCE SCORES -----");

  for (let classId = 0; classId < STAIN_CLASSES.length; classId++) {
    // SKIPS THE UNWANTED OBJECTS CLASS
    if (classId === IGNORED_CLASS_ID) {
      continue;
    }

    console.log(
      `${STAIN_CLASSES[classId]}: ${(highestClassScores[classId] * 100).toFixed(
        2,
      )}%`,
    );
  }

  console.log("-----------------------------------------");

  // DISPLAYS THE FINAL STAIN PREDICTION
  if (bestPrediction) {
    console.log("Selected stain:", bestPrediction.stainType);

    console.log(
      "Selected confidence:",
      (bestPrediction.confidence * 100).toFixed(2) + "%",
    );
  } else {
    console.log("Selected stain: No Stain Detected");

    console.log("Reason: No stain meets the confidence threshold");
  }

  // RETURNS THE BEST STAIN PREDICTION
  return bestPrediction;
}
