//Temporary screen

import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatConfidence } from "../utils/classificationUtils";
import { useAnalysis } from "../viewmodels/AnalysisViewModel";

export default function Confirmation() {
  const { classificationResult, selectedFabric } = useAnalysis();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Classification Confirmation</Text>
        {classificationResult && (
          <View>
            <Text style={styles.text}>
              Garment: {classificationResult.garmentType}
            </Text>

            <Text style={styles.text}>
              Garment Confidence:{" "}
              {formatConfidence(classificationResult.garmentConfidence)}
            </Text>

            <Text style={styles.text}>
              Stain: {classificationResult.stainType}
            </Text>

            <Text style={styles.text}>
              Stain Confidence:{" "}
              {formatConfidence(classificationResult.stainConfidence)}
            </Text>

            <Text style={styles.text}>Fabric: {selectedFabric}</Text>
          </View>
        )}
        {/*GOES DIRECT TO RESULTS PAGE */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/result")}
        >
          <Text style={styles.buttonText}>YES, CONTINUE</Text>
        </TouchableOpacity>

        {/*GOES TO CORRECTION PAGE*/}
        <TouchableOpacity
          style={styles.correctButton}
          onPress={() => router.push("/correction")}
        >
          <Text style={styles.buttonText}>NO, CORRECT RESULTS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D3B24",
  },

  container: {
    flex: 1,
    backgroundColor: "#0D3B24",
    paddingHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#D7C28C",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#71884C",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 18,
  },

  correctButton: {
    backgroundColor: "#C4AA72",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 18,
    marginTop: 12,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
