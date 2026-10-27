import { Asset } from "expo-asset";
import * as ort from "onnxruntime-react-native";

let stainSession: ort.InferenceSession | null = null;

export async function loadStainModel(): Promise<ort.InferenceSession> {
  // REUSES THE LOADED STAIN MODEL SESSION
  if (stainSession) {
    return stainSession;
  }

  try {
    // LOADS THE STAIN MODEL
    console.log("Loading stain model...");

    const asset = Asset.fromModule(
      require("../../assets/models/stain_model.onnx"),
    );

    await asset.downloadAsync();

    if (!asset.localUri) {
      throw new Error("Stain model file could not be loaded");
    }

    const session = await ort.InferenceSession.create(asset.localUri);

    stainSession = session;

    // DISPLAYS THE MODEL INFORMATION
    console.log("Stain ONNX model loaded successfully!");
    console.log("Inputs:", session.inputNames);
    console.log("Outputs:", session.outputNames);

    return session;
  } catch (error) {
    console.error("Error loading stain model:", error);
    throw error;
  }
}

export async function runStainInference(imageTensor: ort.Tensor) {
  // MEASURES THE MODEL LOADING TIME
  const loadStart = performance.now();

  const session = await loadStainModel();

  const modelLoadMs = performance.now() - loadStart;

  // MEASURES THE MODEL INFERENCE TIME
  const inferenceStart = performance.now();

  const outputs = await session.run({
    [session.inputNames[0]]: imageTensor,
  });

  const inferenceMs = performance.now() - inferenceStart;

  // DISPLAYS THE PERFORMANCE RESULTS
  console.log("Stain model load time:", modelLoadMs.toFixed(2), "ms");

  console.log("Stain inference time:", inferenceMs.toFixed(2), "ms");

  // DISPLAYS THE MODEL OUTPUT SHAPES
  for (const name of session.outputNames) {
    console.log("Output:", name);
    console.log("Shape:", outputs[name].dims);
  }

  // RETURNS THE MODEL OUTPUTS AND PERFORMANCE MEASUREMENTS
  return {
    outputs,
    modelLoadMs,
    inferenceMs,
  };
}
