jest.mock("expo-image-manipulator", () => ({
  ImageManipulator: {
    manipulate: jest.fn(),
  },
  SaveFormat: {
    JPEG: "jpeg",
  },
}));

jest.mock("expo-file-system", () => ({
  File: jest.fn(),
}));

jest.mock("jpeg-js", () => ({
  decode: jest.fn(),
}));

jest.mock("onnxruntime-react-native", () => ({
  Tensor: jest.fn(),
}));

describe("ImagePreprocessor", () => {
  const mockResize = jest.fn();
  const mockRender = jest.fn();
  const mockSave = jest.fn();
  const mockBytes = jest.fn();

  let preprocessGarmentImage: typeof import("../ImagePreprocessor").preprocessGarmentImage;

  beforeEach(() => {
    // RESETS THE IMAGE PROCESSING MOCKS
    jest.clearAllMocks();

    const { ImageManipulator } = require("expo-image-manipulator");
    const { File } = require("expo-file-system");
    const jpeg = require("jpeg-js");
    const ort = require("onnxruntime-react-native");

    ImageManipulator.manipulate.mockReturnValue({
      resize: mockResize,
      renderAsync: mockRender,
    });

    mockRender.mockResolvedValue({
      saveAsync: mockSave,
    });

    mockSave.mockResolvedValue({
      uri: "file:///resized.jpg",
    });

    File.mockImplementation(() => ({
      bytes: mockBytes,
    }));

    mockBytes.mockResolvedValue(new Uint8Array([1, 2, 3]));

    // CREATES A CONTROLLED RGBA IMAGE
    const pixels = new Uint8Array(416 * 416 * 4);

    for (let i = 0; i < 416 * 416; i++) {
      const index = i * 4;

      pixels[index] = 255;
      pixels[index + 1] = 128;
      pixels[index + 2] = 0;
      pixels[index + 3] = 255;
    }

    jpeg.decode.mockReturnValue({
      width: 416,
      height: 416,
      data: pixels,
    });

    // MOCKS THE ONNX TENSOR
    ort.Tensor.mockImplementation(
      (type: string, data: Float32Array, dims: number[]) => ({
        type,
        data,
        dims,
      }),
    );

    preprocessGarmentImage =
      require("../ImagePreprocessor").preprocessGarmentImage;
  });

  it("resizes the garment image", async () => {
    // CHECKS THAT THE IMAGE USES THE REQUIRED DIMENSIONS
    await preprocessGarmentImage("file:///garment.jpg");

    expect(mockResize).toHaveBeenCalledWith({
      width: 416,
      height: 416,
    });
  });

  it("creates the correct ONNX tensor", async () => {
    // CHECKS THE TENSOR TYPE AND DIMENSIONS
    const tensor = await preprocessGarmentImage("file:///garment.jpg");

    expect(tensor.dims).toEqual([1, 3, 416, 416]);
  });

  it("normalises RGB pixel values", async () => {
    // CHECKS THAT RGB VALUES ARE NORMALISED
    const tensor = await preprocessGarmentImage("file:///garment.jpg");

    const data = tensor.data as Float32Array;
    const channelSize = 416 * 416;

    expect(data[0]).toBeCloseTo(1);
    expect(data[channelSize]).toBeCloseTo(128 / 255);
    expect(data[channelSize * 2]).toBeCloseTo(0);
  });

  it("rejects incorrect image dimensions", async () => {
    // CHECKS THAT INVALID DIMENSIONS ARE REJECTED
    const jpeg = require("jpeg-js");

    jpeg.decode.mockReturnValue({
      width: 224,
      height: 224,
      data: new Uint8Array(224 * 224 * 4),
    });

    await expect(preprocessGarmentImage("file:///garment.jpg")).rejects.toThrow(
      "Unexpected garment image dimensions",
    );
  });

  it("handles image decoding errors", async () => {
    // CHECKS THAT DECODING ERRORS ARE PROPAGATED
    const jpeg = require("jpeg-js");

    jpeg.decode.mockImplementation(() => {
      throw new Error("Image decoding failed");
    });

    await expect(preprocessGarmentImage("file:///garment.jpg")).rejects.toThrow(
      "Image decoding failed",
    );
  });
});
