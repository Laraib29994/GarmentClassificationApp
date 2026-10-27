import { Stack } from "expo-router";
import { AnalysisProvider } from "../viewmodels/AnalysisViewModel";

export default function RootLayout() {
  return (
    <AnalysisProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="analyse" />
        <Stack.Screen name="fabric" />
        <Stack.Screen name="confirmation" />
        <Stack.Screen name="correction" />
        <Stack.Screen name="result" />
      </Stack>
    </AnalysisProvider>
  );
}
