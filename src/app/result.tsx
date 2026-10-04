import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatPrice, getEstimatedPrice } from "../utils/priceEstimator";
import { getRecommendation } from "../utils/recommendationUtils";
import { useAnalysis } from "../viewmodels/AnalysisViewModel";

export default function Result() {
  const { classificationResult, selectedFabric, resetAnalysis } = useAnalysis();

  const startAgain = () => {
    resetAnalysis();
    router.replace("/");
  };

  if (!classificationResult || !selectedFabric) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>No Results Available</Text>

          <TouchableOpacity style={styles.startButton} onPress={startAgain}>
            <Text style={styles.buttonText}>START AGAIN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const priceResult = getEstimatedPrice(
    classificationResult.garmentType,
    selectedFabric,
  );

  const recommendation = getRecommendation(
    classificationResult.stainType,
    selectedFabric,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.brand}>Maxwells</Text>
          <Text style={styles.brandSmall}>Drycleaning</Text>
          <Text style={styles.appTitle}>Stain Detector</Text>
        </View>

        <Text style={styles.title}>Cleaning Recommendation</Text>

        {/* TEMPORARY RECOMMENDATION */}
        <View style={styles.recommendationBox}>
          <Text style={styles.recommendationTitle}>
            {recommendation?.cleaningMethod ?? "Recommendation unavailable"}
          </Text>

          <Text style={styles.recommended}>
            {recommendation?.recommendation ?? ""}
          </Text>
        </View>

        {/* CLASSIFICATION DETAILS */}
        <View style={styles.detailsBox}>
          <Text style={styles.label}>GARMENT TYPE</Text>
          <Text style={styles.value}>{classificationResult.garmentType}</Text>

          <Text style={styles.label}>STAIN TYPE</Text>
          <Text style={styles.value}>{classificationResult.stainType}</Text>

          <Text style={styles.label}>FABRIC TYPE</Text>
          <Text style={styles.value}>{selectedFabric}</Text>

          <Text style={styles.label}>ESTIMATED PRICE</Text>
          <Text style={styles.price}>
            {priceResult ? formatPrice(priceResult.price) : "Price unavailable"}
          </Text>
          <Text style={styles.priceNote}>
            {priceResult?.isFabricSpecific
              ? "Price based on selected fabric."
              : "Standard garment price shown."}
          </Text>

          <Text style={styles.disclaimer}>
            Price estimate only. Additional surcharges may apply.
          </Text>
        </View>

        {/* TEMPORARY EXPLANATION */}
        <Text style={styles.explanationTitle}>Why is this recommended?</Text>

        <Text style={styles.explanation}>
          {recommendation?.explanation ??
            "A cleaning recommendation could not be generated."}
        </Text>

        {/* START AGAIN */}
        <TouchableOpacity style={styles.startButton} onPress={startAgain}>
          <Text style={styles.buttonText}>START AGAIN</Text>
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
    paddingTop: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  brand: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  brandSmall: {
    color: "#FFFFFF",
    fontSize: 11,
  },

  appTitle: {
    color: "#D7C28C",
    fontSize: 14,
    marginTop: 3,
  },

  title: {
    color: "#D7C28C",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  recommendationBox: {
    backgroundColor: "#52755D",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
  },

  recommendationTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
  },

  recommended: {
    color: "#D7C28C",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 5,
  },

  detailsBox: {
    backgroundColor: "#52755D",
    borderRadius: 15,
    padding: 20,
  },

  label: {
    color: "#D7C28C",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 8,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },

  price: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
  },

  priceNote: {
    color: "#D7C28C",
    fontSize: 12,
    marginTop: 5,
  },

  disclaimer: {
    color: "#FFFFFF",
    fontSize: 11,
    marginTop: 5,
    opacity: 0.7,
  },

  explanationTitle: {
    color: "#D7C28C",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 6,
  },

  explanation: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 18,
  },

  startButton: {
    alignSelf: "center",
    backgroundColor: "#71884C",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 18,
    marginTop: 25,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
