import priceData from "../data/prices.json";

export type PriceResult = {
  price: number;
  isFabricSpecific: boolean;
};

type GarmentPrices = Record<string, number>;

type PriceData = {
  lastUpdated: string;
  currency: string;
  garments: Record<string, GarmentPrices>;
};

const prices = priceData as PriceData;

// MAPS GARMENT NAMES TO THE PRICE CATEGORIES
const GARMENT_ALIASES: Record<string, string[]> = {
  Shirt: ["Shirt", "Shirts", "Top"],
  Jacket: ["Jacket", "Jackets", "Coat"],
  Dress: ["Dress", "Dresses"],
  Trousers: ["Trousers", "Trouser", "Pants"],
};

export function getEstimatedPrice(
  garmentType: string,
  fabric: string,
): PriceResult | null {
  // FINDS THE MATCHING GARMENT PRICE CATEGORY
  const garmentName = garmentType.trim().toLowerCase();

  const aliases = Object.entries(GARMENT_ALIASES).find(([, names]) =>
    names.some((name) => name.toLowerCase() === garmentName),
  )?.[1] ?? [garmentType];

  const matchingKey = Object.keys(prices.garments).find((key) =>
    aliases.some((name) => name.toLowerCase() === key.toLowerCase()),
  );

  if (!matchingKey) {
    return null;
  }

  const garmentPrices = prices.garments[matchingKey];

  // CHECKS FOR A FABRIC-SPECIFIC PRICE
  const fabricKey = Object.keys(garmentPrices).find(
    (key) => key.toLowerCase() === fabric.trim().toLowerCase(),
  );

  if (fabricKey !== undefined) {
    return {
      price: garmentPrices[fabricKey],
      isFabricSpecific: true,
    };
  }

  // USES THE STANDARD PRICE WHEN NO FABRIC PRICE EXISTS
  const standardKey = Object.keys(garmentPrices).find(
    (key) => key.toUpperCase() === "STANDARD",
  );

  if (standardKey === undefined) {
    return null;
  }

  return {
    price: garmentPrices[standardKey],
    isFabricSpecific: false,
  };
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function getPriceLastUpdated(): string {
  return prices.lastUpdated;
}

export function getPriceCurrency(): string {
  return prices.currency;
}
