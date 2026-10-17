import { Asset } from "expo-asset";
import * as ort from "onnxruntime-react-native";

let garmentSession: ort.InferenceSession | null = null;

export async function loadGarmentModel(): Promise<ort.InferenceSession> {
  // REUSES THE LOADED MODEL SESSION
  if (garmentSession) {
    return garmentSession;
  }

  try {
    // LOADS THE GARMENT MODEL
    console.log("Loading garment model...");

    const asset = Asset.fromModule(require("../../assets/models/best.onnx"));

    await asset.downloadAsync();

    if (!asset.localUri) {
      throw new Error("Model file could not be loaded");
    }

    const session = await ort.InferenceSession.create(asset.localUri);

    garmentSession = session;

    // DISPLAYS THE MODEL INFORMATION
    console.log("ONNX model loaded successfully!");
    console.log("Inputs:", session.inputNames);
    console.log("Outputs:", session.outputNames);

    return session;
  } catch (error) {
    console.error("Error loading garment model:", error);
    throw error;
  }
}

export async function runGarmentInference(imageTensor: ort.Tensor) {
  // MEASURES THE MODEL LOADING TIME
  const loadStart = performance.now();

  const session = await loadGarmentModel();

  const modelLoadMs = performance.now() - loadStart;

  // MEASURES THE MODEL INFERENCE TIME
  const inferenceStart = performance.now();

  const outputs = await session.run({
    images: imageTensor,
  });

  const inferenceMs = performance.now() - inferenceStart;

  // DISPLAYS THE PERFORMANCE RESULTS
  console.log("Garment model load time:", modelLoadMs.toFixed(2), "ms");

  console.log("Garment inference time:", inferenceMs.toFixed(2), "ms");

  // DISPLAYS THE MODEL OUTPUT SHAPES
  for (const name of session.outputNames) {
    console.log("Output:", name);
    console.log("Shape:", outputs[name].dims);
  }

  // DISPLAYS THE GARMENT DETECTION VALUES
  const detectionOutput = outputs["output0"];

  if (detectionOutput) {
    // CONVERTS THE MODEL OUTPUT TO FLOAT VALUES
    const values = detectionOutput.data as Float32Array;

    // DISPLAYS THE FIRST DETECTION
    console.log("First garment detection:", Array.from(values.slice(0, 38)));

    // DISPLAYS THE SECOND DETECTION
    console.log("Second garment detection:", Array.from(values.slice(38, 76)));
  }

  // RETURNS THE MODEL OUTPUTS AND PERFORMANCE MEASUREMENTS
  return {
    outputs,
    modelLoadMs,
    inferenceMs,
  };
}
