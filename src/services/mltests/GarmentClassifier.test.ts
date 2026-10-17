// MOCKS THE ONNX MODEL FILE
jest.mock("../../../assets/models/best.onnx", () => 1);

jest.mock("expo-asset", () => ({
  Asset: {
    fromModule: jest.fn(),
  },
}));

jest.mock("onnxruntime-react-native", () => ({
  InferenceSession: {
    create: jest.fn(),
  },
  Tensor: jest.fn(),
}));

describe("GarmentClassifier", () => {
  const mockDownload = jest.fn();
  const mockRun = jest.fn();

  let loadGarmentModel: typeof import("../GarmentClassifier").loadGarmentModel;
  let runGarmentInference: typeof import("../GarmentClassifier").runGarmentInference;

  let mockAsset: jest.Mock;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    // RESETS THE MOCKS AND CACHED MODEL SESSION
    jest.resetModules();
    jest.clearAllMocks();

    const { Asset } = require("expo-asset");
    const ort = require("onnxruntime-react-native");

    mockAsset = Asset.fromModule;
    mockCreate = ort.InferenceSession.create;

    mockAsset.mockReturnValue({
      downloadAsync: mockDownload,
      localUri: "file:///best.onnx",
    });

    mockDownload.mockResolvedValue(undefined);

    mockRun.mockResolvedValue({
      output0: {
        dims: [1, 300, 38],
        data: new Float32Array(300 * 38),
      },
      output1: {
        dims: [1, 32, 104, 104],
        data: new Float32Array(32 * 104 * 104),
      },
    });

    mockCreate.mockResolvedValue({
      inputNames: ["images"],
      outputNames: ["output0", "output1"],
      run: mockRun,
    });

    const classifier = require("../GarmentClassifier");

    loadGarmentModel = classifier.loadGarmentModel;
    runGarmentInference = classifier.runGarmentInference;
  });

  it("loads the ONNX garment model", async () => {
    // CHECKS THAT THE MODEL LOADS SUCCESSFULLY
    const session = await loadGarmentModel();

    expect(session).toBeDefined();
    expect(mockAsset).toHaveBeenCalledTimes(1);
    expect(mockDownload).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith("file:///best.onnx");
  });

  it("reuses the loaded model session", async () => {
    // CHECKS THAT THE MODEL LOADS ONLY ONCE
    const firstSession = await loadGarmentModel();
    const secondSession = await loadGarmentModel();

    expect(firstSession).toBe(secondSession);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it("runs garment inference successfully", async () => {
    // CHECKS THAT THE MODEL RECEIVES THE IMAGE TENSOR
    const mockTensor = {
      dims: [1, 3, 416, 416],
    };

    const result = await runGarmentInference(mockTensor as any);

    expect(mockRun).toHaveBeenCalledWith({
      images: mockTensor,
    });

    expect(result.outputs.output0.dims).toEqual([1, 300, 38]);
    expect(result.outputs.output1.dims).toEqual([1, 32, 104, 104]);
  });

  it("returns model loading time", async () => {
    // CHECKS THAT MODEL LOADING TIME IS RECORDED
    const mockTensor = {
      dims: [1, 3, 416, 416],
    };

    const result = await runGarmentInference(mockTensor as any);

    expect(typeof result.modelLoadMs).toBe("number");
    expect(result.modelLoadMs).toBeGreaterThanOrEqual(0);
  });

  it("returns inference time", async () => {
    // CHECKS THAT INFERENCE TIME IS RECORDED
    const mockTensor = {
      dims: [1, 3, 416, 416],
    };

    const result = await runGarmentInference(mockTensor as any);

    expect(typeof result.inferenceMs).toBe("number");
    expect(result.inferenceMs).toBeGreaterThanOrEqual(0);
  });

  it("handles model loading errors", async () => {
    // CHECKS THAT MODEL LOADING FAILURES ARE REPORTED
    mockCreate.mockRejectedValue(new Error("Model loading failed"));

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    try {
      await expect(loadGarmentModel()).rejects.toThrow("Model loading failed");
    } finally {
      errorSpy.mockRestore();
    }
  });

  it("handles inference errors", async () => {
    // CHECKS THAT INFERENCE FAILURES ARE REPORTED
    mockRun.mockRejectedValue(new Error("Inference failed"));

    const mockTensor = {
      dims: [1, 3, 416, 416],
    };

    await expect(runGarmentInference(mockTensor as any)).rejects.toThrow(
      "Inference failed",
    );
  });
});
