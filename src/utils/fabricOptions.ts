export const FABRIC_OPTIONS = ["WOOL", "SILK", "COTTON", "POLYESTER", "LINEN"];

export function isValidFabric(fabric: string): boolean {
  return FABRIC_OPTIONS.includes(fabric);
}

export function selectFabric(
  currentFabric: string | null,
  newFabric: string,
): string {
  if (!isValidFabric(newFabric)) {
    return currentFabric ?? "";
  }

  return newFabric;
}
