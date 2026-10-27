import { File } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as jpeg from "jpeg-js";
import * as ort from "onnxruntime-react-native";

const GARMENT_IMAGE_SIZE = 416;
const STAIN_IMAGE_SIZE = 512;

async function preprocessImage(
  imageUri: string,
  imageSize: number,
): Promise<ort.Tensor> {
  // RESIZES THE IMAGE
  const context = ImageManipulator.manipulate(imageUri);

  context.resize({
    width: imageSize,
    height: imageSize,
  });

  const image = await context.renderAsync();

  const result = await image.saveAsync({
    format: SaveFormat.JPEG,
    compress: 1,
  });

  // READS AND DECODES THE RESIZED IMAGE
  const file = new File(result.uri);
  const imageBytes = await file.bytes();

  const decoded = jpeg.decode(imageBytes, {
    useTArray: true,
    formatAsRGBA: true,
  });

  if (decoded.width !== imageSize || decoded.height !== imageSize) {
    throw new Error("Unexpected image dimensions");
  }

  // CONVERTS RGBA PIXELS TO RGB CHANNEL-FIRST FORMAT
  const pixels = decoded.data;
  const channelSize = imageSize * imageSize;
  const tensorData = new Float32Array(3 * channelSize);

  for (let i = 0; i < channelSize; i++) {
    const pixelIndex = i * 4;

    tensorData[i] = pixels[pixelIndex] / 255;
    tensorData[channelSize + i] = pixels[pixelIndex + 1] / 255;
    tensorData[2 * channelSize + i] = pixels[pixelIndex + 2] / 255;
  }

  // CREATES THE ONNX INPUT TENSOR
  return new ort.Tensor("float32", tensorData, [1, 3, imageSize, imageSize]);
}

export async function preprocessGarmentImage(
  imageUri: string,
): Promise<ort.Tensor> {
  // PREPROCESSES THE GARMENT IMAGE
  const tensor = await preprocessImage(imageUri, GARMENT_IMAGE_SIZE);

  console.log("Garment tensor created:", tensor.dims);

  return tensor;
}

export async function preprocessStainImage(
  imageUri: string,
): Promise<ort.Tensor> {
  // PREPROCESSES THE STAIN IMAGE
  const tensor = await preprocessImage(imageUri, STAIN_IMAGE_SIZE);

  console.log("Stain tensor created:", tensor.dims);

  return tensor;
}
