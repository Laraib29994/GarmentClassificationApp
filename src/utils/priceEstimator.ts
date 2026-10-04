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

export function getEstimatedPrice(
  garmentType: string,
  fabric: string,
): PriceResult | null {
  const garmentPrices = prices.garments[garmentType];

  if (!garmentPrices) {
    return null;
  }

  const fabricPrice = garmentPrices[fabric];

  if (fabricPrice !== undefined) {
    return {
      price: fabricPrice,
      isFabricSpecific: true,
    };
  }

  const standardPrice = garmentPrices.STANDARD;

  if (standardPrice === undefined) {
    return null;
  }

  return {
    price: standardPrice,
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
