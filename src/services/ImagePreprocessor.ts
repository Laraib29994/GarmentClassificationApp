import { File } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as jpeg from "jpeg-js";
import * as ort from "onnxruntime-react-native";

const IMAGE_SIZE = 416;

export async function preprocessGarmentImage(
  imageUri: string,
): Promise<ort.Tensor> {
  // RESIZES THE GARMENT IMAGE
  const context = ImageManipulator.manipulate(imageUri);

  context.resize({
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
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

  if (decoded.width !== IMAGE_SIZE || decoded.height !== IMAGE_SIZE) {
    throw new Error("Unexpected garment image dimensions");
  }

  // CONVERTS RGBA PIXELS TO RGB CHANNEL-FIRST FORMAT
  const pixels = decoded.data;
  const channelSize = IMAGE_SIZE * IMAGE_SIZE;
  const tensorData = new Float32Array(3 * channelSize);

  for (let i = 0; i < channelSize; i++) {
    const pixelIndex = i * 4;

    tensorData[i] = pixels[pixelIndex] / 255;
    tensorData[channelSize + i] = pixels[pixelIndex + 1] / 255;
    tensorData[2 * channelSize + i] = pixels[pixelIndex + 2] / 255;
  }

  // CREATES THE ONNX INPUT TENSOR
  const tensor = new ort.Tensor("float32", tensorData, [
    1,
    3,
    IMAGE_SIZE,
    IMAGE_SIZE,
  ]);

  console.log("Garment tensor created:", tensor.dims);

  return tensor;
}
