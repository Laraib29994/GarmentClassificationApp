import { FABRIC_RULES, STAIN_RULES } from "../data/recommendationRules";

import type { Recommendation } from "../models/Recommendation";

export function getRecommendation(
  stainType: string,
  fabric: string,
): Recommendation | null {
  const fabricRule = FABRIC_RULES[fabric];
  const stainRule = STAIN_RULES[stainType];

  if (!fabricRule || !stainRule) {
    return null;
  }

  return {
    cleaningMethod: fabricRule.cleaningMethod,
    treatment: stainRule.treatment,
    recommendation: "Recommended",
    explanation: `${fabricRule.explanation} ${stainRule.explanation}`,
  };
}
