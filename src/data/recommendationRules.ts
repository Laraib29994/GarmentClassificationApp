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
    treatment: "Professional Stain Treatment",
    explanation:
      "Coffee contains tannins and pigments that can cause stubborn discolouration in fabric fibres.\n\n" +
      "Professional cleaning is recommended because specialist treatments can help remove these residues while protecting the fabric.\n\n" +
      "Do not attempt to rub, wash or apply household products to the stain, as incorrect treatment may spread the mark, set it further or make professional removal more difficult.",
  },

  Grease: {
    treatment: "Professional Stain Treatment",
    explanation:
      "Grease is oil-based and does not dissolve easily in water, making it difficult to remove through ordinary washing.\n\n" +
      "Professional cleaning is recommended because specialist degreasing treatments can help break down greasy residues safely.\n\n" +
      "Do not attempt to rub, wash or apply household products to the stain, as this may spread the grease deeper into the fibres and make removal more difficult.",
  },

  Ink: {
    treatment: "Professional Stain Treatment",
    explanation:
      "Ink contains dyes and pigments that can penetrate fabric fibres and cause permanent discolouration.\n\n" +
      "Professional cleaning is recommended because specialist treatments can target ink residues while reducing the risk of colour bleeding.\n\n" +
      "Do not attempt to rub, wash or apply household products to the stain, as this may cause the ink to spread, bleed or become harder to remove.",
  },

  Oil: {
    treatment: "Professional Stain Treatment",
    explanation:
      "Oil can penetrate deeply into fabric fibres and leave persistent marks that ordinary washing may not remove.\n\n" +
      "Professional cleaning is recommended because appropriate solvents can help dissolve oil residues while protecting the garment.\n\n" +
      "Do not attempt to rub, wash or apply household products to the stain, as this may spread the oil, push it further into the fibres or make removal more difficult.",
  },

  Paint: {
    treatment: "Professional Stain Treatment",
    explanation:
      "Paint contains pigments and binding agents that can adhere strongly to fabric fibres, particularly once dried.\n\n" +
      "Professional cleaning is recommended because treatment must be selected according to the paint type and fabric to minimise damage.\n\n" +
      "Do not attempt to scrape, rub, wash or apply household products to the stain, as this may spread the paint, damage the fibres or make removal more difficult.",
  },
};
