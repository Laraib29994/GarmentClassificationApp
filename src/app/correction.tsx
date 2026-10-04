import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { correctGarment, correctStain } from "../utils/classificationUtils";
import { useAnalysis } from "../viewmodels/AnalysisViewModel";

export default function Correction() {
  const { classificationResult, setClassificationResult } = useAnalysis();

  if (!classificationResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>No Results Available</Text>

          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>BACK</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const garmentTypes = ["Shirt", "Jacket", "Dress", "Trousers"];

  const stainTypes = ["Coffee", "Oil", "Food", "Ink"];

  const changeGarment = (garment: string) => {
    const correctedResult = correctGarment(classificationResult, garment);

    setClassificationResult(correctedResult);
  };

  const changeStain = (stain: string) => {
    const correctedResult = correctStain(classificationResult, stain);

    setClassificationResult(correctedResult);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Correct Results</Text>

        <Text style={styles.heading}>Select Garment Type</Text>

        <View style={styles.options}>
          {garmentTypes.map((garment) => (
            <TouchableOpacity
              key={garment}
              style={[
                styles.optionButton,
                classificationResult.garmentType === garment &&
                  styles.selectedButton,
              ]}
              onPress={() => changeGarment(garment)}
            >
              <Text style={styles.optionText}>{garment}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.heading}>Select Stain Type</Text>

        <View style={styles.options}>
          {stainTypes.map((stain) => (
            <TouchableOpacity
              key={stain}
              style={[
                styles.optionButton,
                classificationResult.stainType === stain &&
                  styles.selectedButton,
              ]}
              onPress={() => changeStain(stain)}
            >
              <Text style={styles.optionText}>{stain}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>CONFIRM CORRECTIONS</Text>
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
    paddingTop: 50,
  },

  title: {
    color: "#D7C28C",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 20,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  optionButton: {
    backgroundColor: "#52755D",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
  },

  selectedButton: {
    backgroundColor: "#C4AA72",
  },

  optionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  confirmButton: {
    backgroundColor: "#71884C",
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 50,
  },

  button: {
    backgroundColor: "#71884C",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 18,
    alignSelf: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
