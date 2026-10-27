import { Tensor } from "onnxruntime-react-native";
import {
    decodeGarmentPrediction,
    GARMENT_CLASSES,
} from "../GarmentPostprocessor";

// MOCKS THE MODEL OUTPUT FOR UNIT TESTING
jest.mock("onnxruntime-react-native", () => ({
  Tensor: jest.fn(),
}));

// CREATES A MODEL OUTPUT WITH THE EXPECTED SHAPE
const createMockOutput = (
  detections: Array<{
    confidence: number;
    classId: number;
  }>,
): Tensor => {
  const values = new Float32Array(300 * 38);

  // INITIALISES DETECTIONS BELOW THE CONFIDENCE THRESHOLD
  for (let index = 0; index < 300; index++) {
    values[index * 38 + 4] = 0;
  }

  // ADDS THE PROVIDED DETECTIONS
  detections.forEach((detection, index) => {
    const offset = index * 38;

    values[offset + 4] = detection.confidence;
    values[offset + 5] = detection.classId;
  });

  return {
    dims: [1, 300, 38],
    data: values,
  } as unknown as Tensor;
};

describe("GarmentPostprocessor", () => {
  // TESTS THE GARMENT CLASS LABELS
  test("contains all thirteen garment categories", () => {
    expect(GARMENT_CLASSES).toHaveLength(13);
    expect(GARMENT_CLASSES[10]).toBe("Long-sleeve dress");
  });

  // TESTS THE ACTUAL GARMENT CATEGORY DECODING
  test("decodes a long-sleeve dress prediction", () => {
    const output = createMockOutput([{ confidence: 0.85, classId: 10 }]);

    const result = decodeGarmentPrediction(output);

    expect(result?.garmentType).toBe("Long-sleeve dress");
    expect(result?.classId).toBe(10);
    expect(result?.confidence).toBeCloseTo(0.85, 5);
  });

  // TESTS THE HIGHEST-CONFIDENCE DETECTION
  test("selects the detection with the highest confidence", () => {
    const output = createMockOutput([
      { confidence: 0.65, classId: 0 },
      { confidence: 0.92, classId: 7 },
      { confidence: 0.75, classId: 10 },
    ]);

    const result = decodeGarmentPrediction(output);

    expect(result?.garmentType).toBe("Trousers");
    expect(result?.classId).toBe(7);
    expect(result?.confidence).toBeCloseTo(0.92, 5);
  });

  // TESTS THE MINIMUM CONFIDENCE THRESHOLD
  test("rejects detections below fifty percent confidence", () => {
    const output = createMockOutput([{ confidence: 0.4, classId: 10 }]);

    expect(decodeGarmentPrediction(output)).toBeNull();
  });

  // TESTS THE CONFIDENCE THRESHOLD BOUNDARY
  test("accepts detections at fifty percent confidence", () => {
    const output = createMockOutput([{ confidence: 0.5, classId: 10 }]);

    expect(decodeGarmentPrediction(output)?.classId).toBe(10);
  });

  // TESTS INVALID GARMENT CLASS IDENTIFIERS
  test("rejects an invalid garment class identifier", () => {
    const output = createMockOutput([{ confidence: 0.9, classId: 20 }]);

    expect(decodeGarmentPrediction(output)).toBeNull();
  });

  // TESTS NON-INTEGER CLASS IDENTIFIERS
  test("rejects a non-integer garment class identifier", () => {
    const output = createMockOutput([{ confidence: 0.9, classId: 2.5 }]);

    expect(decodeGarmentPrediction(output)).toBeNull();
  });

  // TESTS INVALID CONFIDENCE VALUES
  test("rejects invalid confidence values", () => {
    const output = createMockOutput([{ confidence: Number.NaN, classId: 10 }]);

    expect(decodeGarmentPrediction(output)).toBeNull();
  });

  // TESTS CONFIDENCE VALUES ABOVE THE VALID RANGE
  test("rejects confidence values greater than one", () => {
    const output = createMockOutput([{ confidence: 1.2, classId: 10 }]);

    expect(decodeGarmentPrediction(output)).toBeNull();
  });

  // TESTS AN EMPTY DETECTION RESULT
  test("returns null when no garment is detected", () => {
    const output = createMockOutput([]);

    expect(decodeGarmentPrediction(output)).toBeNull();
  });

  // TESTS AN INCORRECT MODEL OUTPUT SHAPE
  test("rejects an unexpected model output shape", () => {
    const output = {
      dims: [1, 100, 20],
      data: new Float32Array(2000),
    } as unknown as Tensor;

    expect(() => decodeGarmentPrediction(output)).toThrow(
      "Unexpected garment model output shape",
    );
  });

  // TESTS AN INCORRECT MODEL OUTPUT DATA TYPE
  test("rejects an unexpected model output type", () => {
    const output = {
      dims: [1, 300, 38],
      data: new Int32Array(300 * 38),
    } as unknown as Tensor;

    expect(() => decodeGarmentPrediction(output)).toThrow(
      "Unexpected garment model output type",
    );
  });
});
