import { GARMENT_CLASSES } from "../services/GarmentPostprocessor";

// DEFINES THE GARMENT CATEGORIES USED BY THE APP
export type AppGarmentCategory = "Shirt" | "Jacket" | "Dress" | "Trousers";

// MAPS THE MODEL GARMENT CLASSES TO APP CATEGORIES
const GARMENT_CATEGORY_MAP: Record<
  (typeof GARMENT_CLASSES)[number],
  AppGarmentCategory
> = {
  "Short-sleeve top": "Shirt",
  "Long-sleeve top": "Shirt",
  "Short-sleeve outerwear": "Jacket",
  "Long-sleeve outerwear": "Jacket",
  Vest: "Jacket",
  Sling: "Shirt",
  Shorts: "Trousers",
  Trousers: "Trousers",
  Skirt: "Dress",
  "Short-sleeve dress": "Dress",
  "Long-sleeve dress": "Dress",
  "Vest dress": "Dress",
  "Sling dress": "Dress",
};

export function mapGarmentCategory(modelCategory: string): AppGarmentCategory {
  // CHECKS WHETHER THE MODEL CATEGORY IS SUPPORTED
  if (
    !Object.prototype.hasOwnProperty.call(GARMENT_CATEGORY_MAP, modelCategory)
  ) {
    throw new Error(`Unsupported garment category: ${modelCategory}`);
  }

  // RETURNS THE CORRESPONDING APP CATEGORY
  return GARMENT_CATEGORY_MAP[
    modelCategory as keyof typeof GARMENT_CATEGORY_MAP
  ];
}
