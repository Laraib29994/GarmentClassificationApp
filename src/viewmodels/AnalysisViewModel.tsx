import { createContext, ReactNode, useContext, useState } from "react";

type AnalysisContextType = {
  garmentImage: string | null;
  stainImage: string | null;
  selectedFabric: string | null;

  setGarmentImage: (image: string | null) => void;
  setStainImage: (image: string | null) => void;
  setSelectedFabric: (fabric: string | null) => void;
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined,
);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [stainImage, setStainImage] = useState<string | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null);

  return (
    <AnalysisContext.Provider
      value={{
        garmentImage,
        stainImage,
        selectedFabric,
        setGarmentImage,
        setStainImage,
        setSelectedFabric,
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
