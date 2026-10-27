import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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

import { correctGarment, correctStain } from "../utils/classificationUtils";
import { useAnalysis } from "../viewmodels/AnalysisViewModel";

// DEFINES THE AVAILABLE GARMENT CATEGORIES
const garmentTypes = ["Shirt", "Jacket", "Dress", "Trousers"];

// DEFINES THE AVAILABLE STAIN CATEGORIES
const stainTypes = [
  "Coffee",
  "Grease",
  "Ink",
  "Oil",
  "Paint",
  "No Stain Detected",
];

// DEFINES THE MAXWELLS COLOUR THEME
const COLORS = {
  background: "#063522",
  gold: "#D7C28C",
  cream: "#F2E6C9",
  card: "#28523B",
  muted: "#C5CEBF",
  border: "rgba(215,194,140,0.3)",
};

export default function Correction() {
  // RETRIEVES THE CLASSIFICATION RESULT
  const { classificationResult, setClassificationResult } = useAnalysis();

  // STORES THE SELECTED GARMENT AND STAIN
  const [selectedGarment, setSelectedGarment] = useState(
    classificationResult?.garmentType ?? "",
  );

  const [selectedStain, setSelectedStain] = useState(
    classificationResult?.stainType ?? "",
  );

  // SAVES THE CORRECTED CLASSIFICATION
  const confirmCorrections = () => {
    if (!classificationResult) {
      return;
    }

    // REQUIRES A VALID GARMENT SELECTION
    if (!garmentTypes.includes(selectedGarment)) {
      Alert.alert(
        "Select a Garment",
        "Please select the correct garment type before continuing.",
      );
      return;
    }

    // REQUIRES A VALID STAIN SELECTION
    if (!stainTypes.includes(selectedStain)) {
      Alert.alert(
        "Select a Stain",
        "Please select a stain type or choose No Stain Detected.",
      );
      return;
    }

    // UPDATES THE GARMENT ONLY WHEN THE SELECTION CHANGES
    const garmentResult =
      selectedGarment !== classificationResult.garmentType
        ? correctGarment(classificationResult, selectedGarment)
        : classificationResult;

    // UPDATES THE STAIN ONLY WHEN THE SELECTION CHANGES
    const correctedResult =
      selectedStain !== garmentResult.stainType
        ? correctStain(garmentResult, selectedStain)
        : garmentResult;

    // STORES THE CONFIRMED CORRECTIONS
    setClassificationResult(correctedResult);

    // RETURNS TO THE CONFIRMATION SCREEN
    router.back();
  };

  // HANDLES MISSING CLASSIFICATION RESULTS
  if (!classificationResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.title}>No Results Available</Text>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => router.back()}
          >
            <Text style={styles.confirmButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.title}>Correct Your Results</Text>

          <Text style={styles.instruction}>
            Review the classifications and select the correct garment or stain
            type.
          </Text>
        </View>

        {/* DISPLAYS THE GARMENT SELECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Ionicons name="shirt-outline" size={21} color={COLORS.gold} />

            <Text style={styles.heading}>Select Garment Type</Text>
          </View>

          {/* DISPLAYS THE GARMENT WARNING */}
          {classificationResult.garmentType === "No Garment Detected" && (
            <Text style={styles.warningText}>
              Your garment could not be confidently identified. Please select
              the correct garment type.
            </Text>
          )}

          <View style={styles.options}>
            {garmentTypes.map((garment) => {
              const isSelected = selectedGarment === garment;

              return (
                <TouchableOpacity
                  key={garment}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedGarment(garment)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {garment}
                  </Text>

                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={COLORS.background}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* DISPLAYS THE STAIN SELECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Ionicons name="water-outline" size={21} color={COLORS.gold} />

            <Text style={styles.heading}>Select Stain Type</Text>
          </View>

          <View style={styles.options}>
            {stainTypes.map((stain) => {
              const isSelected = selectedStain === stain;

              return (
                <TouchableOpacity
                  key={stain}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedStain(stain)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {stain}
                  </Text>

                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={COLORS.background}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SAVES THE CORRECTED RESULTS */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={confirmCorrections}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmButtonText}>Confirm Corrections</Text>

          <Ionicons name="checkmark" size={20} color={COLORS.background} />
        </TouchableOpacity>

        {/* RETURNS WITHOUT SAVING CHANGES */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={19} color={COLORS.cream} />

          <Text style={styles.backButtonText}>Back to Confirmation</Text>
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
    paddingBottom: 36,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
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
    marginBottom: 30,
  },

  title: {
    color: COLORS.cream,
    fontFamily: "serif",
    fontSize: 29,
    fontWeight: "400",
    marginBottom: 10,
    textAlign: "center",
  },

  instruction: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
  },

  // STYLES THE SELECTION SECTIONS
  section: {
    marginBottom: 30,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },

  heading: {
    color: COLORS.cream,
    fontSize: 17,
    fontWeight: "600",
  },

  warningText: {
    color: COLORS.gold,
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 15,
  },

  // STYLES THE CLASSIFICATION OPTIONS
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  optionButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  selectedButton: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },

  optionText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: "500",
  },

  selectedText: {
    color: COLORS.background,
    fontWeight: "600",
  },

  // STYLES THE CONFIRM BUTTON
  confirmButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },

  confirmButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
  },

  // STYLES THE BACK BUTTON
  backButton: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 14,
  },

  backButtonText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: "600",
  },
});
