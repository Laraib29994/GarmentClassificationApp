import { Stack } from "expo-router";
import { AnalysisProvider } from "../viewmodels/AnalysisViewModel";

export default function RootLayout() {
  return (
    <AnalysisProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AnalysisProvider>
  );
}
