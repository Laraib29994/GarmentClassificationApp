export type FabricRule = {
  cleaningMethod: string;
  explanation: string;
};

export type StainRule = {
  treatment: string;
  explanation: string;
};

export const FABRIC_RULES: Record<string, FabricRule> = {
  WOOL: {
    cleaningMethod: "Professional Cleaning",
    explanation:
      "Professional care is recommended based on the selected wool fabric.",
  },

  SILK: {
    cleaningMethod: "Professional Cleaning",
    explanation:
      "Professional care is recommended based on the selected silk fabric.",
  },

  COTTON: {
    cleaningMethod: "Professional Cleaning",
    explanation:
      "Professional care is recommended based on the selected cotton fabric.",
  },

  POLYESTER: {
    cleaningMethod: "Professional Cleaning",
    explanation:
      "Professional care is recommended based on the selected polyester fabric.",
  },

  LINEN: {
    cleaningMethod: "Professional Cleaning",
    explanation:
      "Professional care is recommended based on the selected linen fabric.",
  },
};

export const STAIN_RULES: Record<string, StainRule> = {
  Coffee: {
    treatment: "Stain Treatment",
    explanation:
      "Professional stain treatment is recommended for the identified coffee stain.",
  },

  Oil: {
    treatment: "Stain Treatment",
    explanation:
      "Professional stain treatment is recommended for the identified oil stain.",
  },

  Food: {
    treatment: "Stain Treatment",
    explanation:
      "Professional stain treatment is recommended for the identified food stain.",
  },

  Ink: {
    treatment: "Stain Treatment",
    explanation:
      "Professional stain treatment is recommended for the identified ink stain.",
  },
};
