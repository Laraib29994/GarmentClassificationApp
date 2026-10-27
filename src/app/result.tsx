import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatPrice, getEstimatedPrice } from "../utils/priceEstimator";
import { getRecommendation } from "../utils/recommendationUtils";
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

export default function Result() {
  // RETRIEVES THE CLASSIFICATION RESULTS
  const { classificationResult, selectedFabric, resetAnalysis } = useAnalysis();

  // RESETS THE ANALYSIS AND RETURNS TO HOME
  const goHome = () => {
    resetAnalysis();
    router.replace("/");
  };

  // RESETS THE ANALYSIS AND STARTS AGAIN
  const startAgain = () => {
    resetAnalysis();
    router.replace("/analyse");
  };

  // HANDLES MISSING CLASSIFICATION RESULTS
  if (!classificationResult || !selectedFabric) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <View style={styles.emptyContainer}>
          <Ionicons
            name="document-text-outline"
            size={42}
            color={COLORS.gold}
          />

          <Text style={styles.emptyTitle}>No Results Available</Text>

          <Text style={styles.emptyDescription}>
            Start a new analysis to view your cleaning recommendations.
          </Text>

          <TouchableOpacity style={styles.startButton} onPress={startAgain}>
            <Text style={styles.primaryButtonText}>Start Again</Text>

            <Ionicons
              name="arrow-forward"
              size={19}
              color={COLORS.background}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // CALCULATES THE ESTIMATED GARMENT PRICE
  const priceResult = getEstimatedPrice(
    classificationResult.garmentType,
    selectedFabric,
  );

  // CHECKS WHETHER THE MODEL DETECTS A STAIN
  const noStainDetected =
    classificationResult.stainType === "No Stain Detected";

  // RETRIEVES THE CLEANING RECOMMENDATION
  const recommendation = noStainDetected
    ? null
    : getRecommendation(classificationResult.stainType, selectedFabric);

  // FORMATS THE CLEANING RECOMMENDATION TEXT
  const cleaningMethod = noStainDetected
    ? "No Stain Detected"
    : (recommendation?.cleaningMethod ?? "Recommendation Unavailable").replace(
        /Professional Cleaning/gi,
        "Professional Drycleaning",
      );

  const recommendationStatus = noStainDetected
    ? "Please review the stain image"
    : (recommendation?.recommendation ?? "").replace(
        /Professional Cleaning/gi,
        "Professional Drycleaning",
      );

  // DISPLAYS THE APPROPRIATE EXPLANATION
  const explanation = noStainDetected
    ? "The stain could not be identified with sufficient confidence.\n\n" +
      "Please retake the stain photo with clear lighting and ensure the affected area is visible.\n\n" +
      "You can also return to the confirmation screen and manually correct the stain type."
    : (recommendation?.explanation ?? "");

  // SEPARATES THE EXPLANATION INTO PARAGRAPHS
  const paragraphs = explanation
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* DISPLAYS THE MAXWELLS BRANDING */}
        <View style={styles.header}>
          <Text style={styles.brandName}>Maxwells</Text>

          <Text style={styles.brandSubtitle}>D R Y C L E A N I N G</Text>
        </View>

        {/* DISPLAYS THE PAGE HEADING */}
        <View style={styles.headingContainer}>
          <Text style={styles.pageTitle}>Your Cleaning Recommendation</Text>

          <Text style={styles.pageSubtitle}>
            Personalised garment care based on your classification results.
          </Text>
        </View>

        {/* DISPLAYS THE CLEANING RECOMMENDATION */}
        <View style={styles.recommendationCard}>
          <View style={styles.recommendationIcon}>
            <Ionicons name="sparkles-outline" size={26} color={COLORS.gold} />
          </View>

          <Text style={styles.cardLabel}>RECOMMENDED CLEANING METHOD</Text>

          <Text style={styles.cleaningMethod}>{cleaningMethod}</Text>

          <Text style={styles.recommendationStatus}>
            {recommendationStatus}
          </Text>
        </View>

        {/* DISPLAYS THE CLASSIFICATION DETAILS */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeadingRow}>
            <Ionicons name="shirt-outline" size={21} color={COLORS.gold} />

            <Text style={styles.cardHeading}>Classification Details</Text>
          </View>

          {/* DISPLAYS THE GARMENT TYPE */}
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>GARMENT TYPE</Text>

            <Text style={styles.detailValue}>
              {classificationResult.garmentType}
            </Text>
          </View>

          {/* DISPLAYS THE STAIN TYPE */}
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>STAIN TYPE</Text>

            <Text style={styles.detailValue}>
              {classificationResult.stainType}
            </Text>
          </View>

          {/* DISPLAYS THE FABRIC TYPE */}
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>FABRIC TYPE</Text>

            <Text style={styles.detailValue}>{selectedFabric}</Text>
          </View>

          {/* DISPLAYS THE ESTIMATED PRICE */}
          <View style={styles.priceSection}>
            <View style={styles.priceHeadingRow}>
              <Ionicons name="pricetag-outline" size={20} color={COLORS.gold} />

              <Text style={styles.detailLabel}>ESTIMATED PRICE</Text>
            </View>

            <Text style={styles.priceValue}>
              {priceResult
                ? formatPrice(priceResult.price)
                : "Price Unavailable"}
            </Text>

            {priceResult && (
              <Text style={styles.priceNote}>
                {priceResult.isFabricSpecific
                  ? "Fabric-specific garment price shown."
                  : "Standard garment price shown."}
              </Text>
            )}

            <Text style={styles.priceDisclaimer}>
              Price estimate only. Additional surcharges may apply.
            </Text>
          </View>
        </View>

        {/* DISPLAYS THE CLEANING EXPLANATION */}
        <View style={styles.explanationSection}>
          <View style={styles.cardHeadingRow}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={COLORS.gold}
            />

            <Text style={styles.explanationTitle}>
              Why Is This Recommended?
            </Text>
          </View>

          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <Text
                key={index}
                style={[
                  styles.explanationText,
                  index === paragraphs.length - 1 && styles.lastParagraph,
                ]}
              >
                {paragraph}
              </Text>
            ))
          ) : (
            <Text style={styles.explanationText}>
              Recommendation unavailable.
            </Text>
          )}
        </View>

        {/* DISPLAYS THE HOME AND START AGAIN BUTTONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.homeButton]}
            onPress={goHome}
            activeOpacity={0.85}
          >
            <Ionicons name="home-outline" size={18} color={COLORS.cream} />

            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.againButton]}
            onPress={startAgain}
            activeOpacity={0.85}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={COLORS.background}
            />

            <Text style={styles.primaryButtonText}>Start Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // STYLES THE SCROLLABLE SCREEN
  scrollView: {
    flex: 1,
  },

  scrollContent: {
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

  brandName: {
    color: COLORS.cream,
    fontFamily: "serif",
    fontSize: 37,
    fontWeight: "400",
  },

  brandSubtitle: {
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

  pageTitle: {
    color: COLORS.cream,
    fontFamily: "serif",
    fontSize: 29,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 10,
  },

  pageSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
  },

  // STYLES THE RECOMMENDATION CARD
  recommendationCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  recommendationIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(215,194,140,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  cardLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 12,
  },

  cleaningMethod: {
    color: COLORS.cream,
    fontFamily: "serif",
    fontSize: 27,
    fontWeight: "400",
    lineHeight: 35,
    textAlign: "center",
    marginBottom: 12,
  },

  recommendationStatus: {
    color: COLORS.gold,
    fontFamily: "serif",
    fontSize: 27,
    fontWeight: "400",
    lineHeight: 35,
    textAlign: "center",
  },

  // STYLES THE CLASSIFICATION CARD
  detailsCard: {
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
    marginBottom: 20,
  },

  cardHeading: {
    color: COLORS.cream,
    fontSize: 18,
    fontWeight: "600",
  },

  detailSection: {
    marginBottom: 19,
  },

  detailLabel: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 6,
  },

  detailValue: {
    color: COLORS.cream,
    fontSize: 20,
    fontWeight: "500",
  },

  // STYLES THE ESTIMATED PRICE
  priceSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 22,
    marginTop: 4,
  },

  priceHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 6,
  },

  priceValue: {
    color: COLORS.cream,
    fontFamily: "serif",
    fontSize: 34,
    marginTop: 6,
  },

  priceNote: {
    color: COLORS.gold,
    fontSize: 12,
    marginTop: 8,
  },

  priceDisclaimer: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 10,
  },

  // STYLES THE EXPLANATION SECTION
  explanationSection: {
    marginBottom: 28,
  },

  explanationTitle: {
    color: COLORS.cream,
    fontSize: 18,
    fontWeight: "600",
  },

  explanationText: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 15,
  },

  lastParagraph: {
    marginBottom: 0,
  },

  // STYLES THE HOME AND START AGAIN BUTTONS
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },

  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  homeButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.gold,
  },

  againButton: {
    backgroundColor: COLORS.gold,
  },

  homeButtonText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: "600",
  },

  primaryButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: "600",
  },

  // STYLES THE EMPTY RESULTS SCREEN
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 16,
  },

  emptyTitle: {
    color: COLORS.cream,
    fontFamily: "serif",
    fontSize: 28,
    textAlign: "center",
  },

  emptyDescription: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 10,
  },

  startButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 30,
    paddingVertical: 17,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
