import { createContext, ReactNode, useContext, useState } from "react";

import { ClassificationResult } from "../models/ClassificationResult.ts";

type AnalysisContextType = {
  garmentImage: string | null;
  stainImage: string | null;
  selectedFabric: string | null;
  classificationResult: ClassificationResult | null;

  setGarmentImage: (image: string | null) => void;
  setStainImage: (image: string | null) => void;
  setSelectedFabric: (fabric: string | null) => void;
  setClassificationResult: (result: ClassificationResult | null) => void;
  resetAnalysis: () => void;
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined,
);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [garmentImage, setGarmentImage] = useState<string | null>(null);

  const [stainImage, setStainImage] = useState<string | null>(null);

  const [selectedFabric, setSelectedFabric] = useState<string | null>(null);

  const [classificationResult, setClassificationResult] =
    useState<ClassificationResult | null>(null);

  const resetAnalysis = () => {
    setGarmentImage(null);
    setStainImage(null);
    setSelectedFabric(null);
    setClassificationResult(null);
  };

  return (
    <AnalysisContext.Provider
      value={{
        garmentImage,
        stainImage,
        selectedFabric,
        classificationResult,
        setGarmentImage,
        setStainImage,
        setSelectedFabric,
        setClassificationResult,
        resetAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);

  if (!context) {
    throw new Error("useAnalysis must be used inside an AnalysisProvider");
  }

  return context;
}
