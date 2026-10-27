import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatConfidence } from "../utils/classificationUtils";
import { useAnalysis } from "../viewmodels/AnalysisViewModel";

// DEFINES THE MAXWELLS COLOUR THEME
const COLORS = {
  background: "#063522",
  gold: "#D7C28C",
  cream: "#F2E6C9",
  card: "#28523B",
  muted: "#C5CEBF",
  border: "rgba(215,194,140,0.3)",
};

export default function Confirmation() {
  // RETRIEVES THE CLASSIFICATION RESULTS
  const { classificationResult, selectedFabric } = useAnalysis();

  // HANDLES MISSING CLASSIFICATION RESULTS
  if (!classificationResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <View style={styles.emptyContainer}>
          <Ionicons
            name="document-text-outline"
            size={42}
            color={COLORS.gold}
          />

          <Text style={styles.title}>No Results Available</Text>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.replace("/analyse")}
          >
            <Text style={styles.continueButtonText}>Back to Analyse</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // CHECKS WHETHER THE GARMENT MODEL IDENTIFIES A GARMENT
  const noGarmentDetected =
    classificationResult.garmentType === "No Garment Detected";

  // CHECKS WHETHER THE STAIN MODEL IDENTIFIES A STAIN
  const noStainDetected =
    classificationResult.stainType === "No Stain Detected";

  // FORMATS THE GARMENT CONFIDENCE
  const garmentConfidenceText = noGarmentDetected
    ? "No confident garment prediction"
    : formatConfidence(classificationResult.garmentConfidence);

  // FORMATS THE STAIN CONFIDENCE
  const stainConfidenceText = noStainDetected
    ? "No confident stain prediction"
    : formatConfidence(classificationResult.stainConfidence);

  // CHECKS THE GARMENT BEFORE CONTINUING
  const handleContinue = () => {
    if (noGarmentDetected) {
      Alert.alert(
        "Garment Confirmation Required",
        "We couldn't confidently identify your garment. Please select the correct garment type before continuing.",
        [
          {
            text: "Select Garment",
            onPress: () => router.push("/correction"),
          },
        ],
      );
      return;
    }

    // OPENS THE RESULTS SCREEN
    router.push("/result");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* DISPLAYS THE MAXWELLS BRANDING */}
        <View style={styles.header}>
          <Text style={styles.brand}>Maxwells</Text>

          <Text style={styles.brandSmall}>D R Y C L E A N I N G</Text>
        </View>

        {/* DISPLAYS THE PAGE HEADING */}
        <View style={styles.headingContainer}>
          <Text style={styles.title}>Confirm Your Results</Text>

          <Text style={styles.instruction}>
            Please review your garment and stain classifications before viewing
            your cleaning recommendation.
          </Text>
        </View>

        {/* DISPLAYS THE CLASSIFICATION DETAILS */}
        <View style={styles.resultsCard}>
          <View style={styles.cardHeadingRow}>
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color={COLORS.gold}
            />

            <Text style={styles.cardHeading}>Classification Details</Text>
          </View>

          {/* DISPLAYS THE GARMENT CLASSIFICATION */}
          <View style={styles.detailSection}>
            <View style={styles.detailHeadingRow}>
              <Ionicons name="shirt-outline" size={19} color={COLORS.gold} />

              <Text style={styles.detailLabel}>GARMENT TYPE</Text>
            </View>

            <Text style={styles.detailValue}>
              {classificationResult.garmentType}
            </Text>

            <Text style={styles.confidenceText}>
              Confidence: {garmentConfidenceText}
            </Text>

            {/* DISPLAYS THE GARMENT WARNING */}
            {noGarmentDetected && (
              <View style={styles.warningContainer}>
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color={COLORS.gold}
                />

                <Text style={styles.warningText}>
                  We couldn't confidently identify your garment. Please select
                  the correct garment type before continuing.
                </Text>
              </View>
            )}
          </View>

          {/* DISPLAYS THE STAIN CLASSIFICATION */}
          <View style={styles.detailSection}>
            <View style={styles.detailHeadingRow}>
              <Ionicons name="water-outline" size={19} color={COLORS.gold} />

              <Text style={styles.detailLabel}>STAIN TYPE</Text>
            </View>

            <Text style={styles.detailValue}>
              {classificationResult.stainType}
            </Text>

            <Text style={styles.confidenceText}>
              Confidence: {stainConfidenceText}
            </Text>

            {/* DISPLAYS THE STAIN WARNING */}
            {noStainDetected && (
              <View style={styles.warningContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={COLORS.gold}
                />

                <Text style={styles.warningText}>
                  The stain couldn't be confidently identified. You can manually
                  select a stain type if you recognise it.
                </Text>
              </View>
            )}
          </View>

          {/* DISPLAYS THE FABRIC CLASSIFICATION */}
          <View style={styles.fabricSection}>
            <View style={styles.detailHeadingRow}>
              <Ionicons name="layers-outline" size={19} color={COLORS.gold} />

              <Text style={styles.detailLabel}>FABRIC TYPE</Text>
            </View>

            <Text style={styles.detailValue}>
              {selectedFabric || "Not Selected"}
            </Text>
          </View>
        </View>

        {/* OPENS THE RESULTS SCREEN */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Yes, Continue</Text>

          <Ionicons name="arrow-forward" size={19} color={COLORS.background} />
        </TouchableOpacity>

        {/* OPENS THE CORRECTION SCREEN */}
        <TouchableOpacity
          style={styles.correctButton}
          onPress={() => router.push("/correction")}
          activeOpacity={0.85}
        >
          <Ionicons name="create-outline" size={19} color={COLORS.cream} />

          <Text style={styles.correctButtonText}>No, Correct Results</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // STYLES THE MAIN SCREEN
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // STYLES THE MAXWELLS BRANDING
  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  brand: {
    color: COLORS.cream,
    fontFamily: "serif",
    fontSize: 37,
    fontWeight: "400",
  },

  brandSmall: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 2,
  },

  // STYLES THE PAGE HEADING
  headingContainer: {
    marginBottom: 28,
  },

  title: {
    color: COLORS.cream,
    fontFamily: "serif",
    fontSize: 29,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 10,
  },

  instruction: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
  },

  // STYLES THE CLASSIFICATION CARD
  resultsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 22,
    paddingVertical: 25,
    marginBottom: 28,
  },

  cardHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },

  cardHeading: {
    color: COLORS.cream,
    fontSize: 18,
    fontWeight: "600",
  },

  // STYLES THE CLASSIFICATION DETAILS
  detailSection: {
    marginBottom: 24,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  detailHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 9,
  },

  detailLabel: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },

  detailValue: {
    color: COLORS.cream,
    fontSize: 21,
    fontWeight: "500",
    marginBottom: 7,
  },

  confidenceText: {
    color: COLORS.muted,
    fontSize: 12,
  },

  // STYLES THE CLASSIFICATION WARNINGS
  warningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(215,194,140,0.1)",
  },

  warningText: {
    color: COLORS.cream,
    fontSize: 12,
    lineHeight: 19,
    flex: 1,
  },

  // STYLES THE FABRIC DETAILS
  fabricSection: {
    marginBottom: 0,
  },

  // STYLES THE CONTINUE BUTTON
  continueButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  continueButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
  },

  // STYLES THE CORRECTION BUTTON
  correctButton: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 14,
  },

  correctButtonText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: "600",
  },

  // STYLES THE EMPTY RESULTS SCREEN
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 18,
  },
});
