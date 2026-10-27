import {
    AppGarmentCategory,
    mapGarmentCategory,
} from "../../utils/garmentCategoryMapper";
import { GARMENT_CLASSES } from "../GarmentPostprocessor";

// DEFINES THE EXPECTED GARMENT CATEGORY MAPPINGS
const expectedMappings: Array<{
  modelCategory: string;
  appCategory: AppGarmentCategory;
}> = [
  { modelCategory: "Short-sleeve top", appCategory: "Shirt" },
  { modelCategory: "Long-sleeve top", appCategory: "Shirt" },
  { modelCategory: "Short-sleeve outerwear", appCategory: "Jacket" },
  { modelCategory: "Long-sleeve outerwear", appCategory: "Jacket" },
  { modelCategory: "Vest", appCategory: "Jacket" },
  { modelCategory: "Sling", appCategory: "Shirt" },
  { modelCategory: "Shorts", appCategory: "Trousers" },
  { modelCategory: "Trousers", appCategory: "Trousers" },
  { modelCategory: "Skirt", appCategory: "Dress" },
  { modelCategory: "Short-sleeve dress", appCategory: "Dress" },
  { modelCategory: "Long-sleeve dress", appCategory: "Dress" },
  { modelCategory: "Vest dress", appCategory: "Dress" },
  { modelCategory: "Sling dress", appCategory: "Dress" },
];

describe("Garment Category Mapper", () => {
  // TESTS EACH GARMENT CATEGORY MAPPING
  test.each(expectedMappings)(
    "maps $modelCategory to $appCategory",
    ({ modelCategory, appCategory }) => {
      expect(mapGarmentCategory(modelCategory)).toBe(appCategory);
    },
  );

  // CHECKS THAT ALL MODEL CATEGORIES ARE COVERED
  test("includes mappings for all model garment categories", () => {
    expect(expectedMappings).toHaveLength(GARMENT_CLASSES.length);

    for (const category of GARMENT_CLASSES) {
      expect(() => mapGarmentCategory(category)).not.toThrow();
    }
  });

  // REJECTS UNKNOWN GARMENT CATEGORIES
  test("rejects an unsupported garment category", () => {
    expect(() => mapGarmentCategory("Coat")).toThrow(
      "Unsupported garment category: Coat",
    );
  });

  // REJECTS EMPTY GARMENT CATEGORIES
  test("rejects an empty garment category", () => {
    expect(() => mapGarmentCategory("")).toThrow(
      "Unsupported garment category:",
    );
  });

  // CHECKS THAT THE MAPPING IS CASE SENSITIVE
  test("rejects garment categories with incorrect capitalisation", () => {
    expect(() => mapGarmentCategory("long-sleeve dress")).toThrow(
      "Unsupported garment category: long-sleeve dress",
    );
  });
});
