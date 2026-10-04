export function validateAnalysis(
  garmentImage: string | null,
  stainImage: string | null,
  selectedFabric: string | null,
): string | null {
  if (!garmentImage) {
    return "Garment image required";
  }

  if (!stainImage) {
    return "Stain image required";
  }

  if (!selectedFabric) {
    return "Fabric type required";
  }

  return null;
}
