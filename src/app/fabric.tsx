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

import {
  FABRIC_OPTIONS,
  selectFabric as getSelectedFabric,
} from "../utils/fabricOptions";
import { useAnalysis } from "../viewmodels/AnalysisViewModel";

const COLORS = {
  background: "#063522",
  gold: "#D7C28C",
  cream: "#F2E6C9",
  card: "#28523B",
  muted: "#C5CEBF",
  border: "rgba(215,194,140,0.3)",
};

export default function FabricSelection() {
  // RETRIEVES THE SELECTED FABRIC
  const { selectedFabric, setSelectedFabric } = useAnalysis();

  // SAVES THE FABRIC AND RETURNS TO ANALYSE
  const handleFabricSelection = (fabric: string) => {
    const newFabric = getSelectedFabric(selectedFabric, fabric);

    setSelectedFabric(newFabric);
    router.back();
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
          <Text style={styles.title}>Select Your Fabric</Text>

          <Text style={styles.description}>
            Choose the fabric type that best matches your garment.
          </Text>
        </View>

        {/* DISPLAYS THE AVAILABLE FABRIC OPTIONS */}
        <View style={styles.fabricContainer}>
          {FABRIC_OPTIONS.map((fabric) => {
            const isSelected = selectedFabric === fabric;

            return (
              <TouchableOpacity
                key={fabric}
                style={[
                  styles.fabricButton,
                  isSelected && styles.selectedButton,
                ]}
                onPress={() => handleFabricSelection(fabric)}
                activeOpacity={0.85}
              >
                <View style={styles.fabricContent}>
                  <Ionicons
                    name="layers-outline"
                    size={21}
                    color={isSelected ? COLORS.background : COLORS.gold}
                  />

                  <Text
                    style={[
                      styles.fabricText,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {fabric}
                  </Text>
                </View>

                <Ionicons
                  name={isSelected ? "checkmark-circle" : "chevron-forward"}
                  size={21}
                  color={isSelected ? COLORS.background : COLORS.gold}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RETURNS TO THE ANALYSE SCREEN */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={19} color={COLORS.cream} />

          <Text style={styles.backButtonText}>Back to Analyse</Text>
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
    marginBottom: 10,
  },

  description: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
  },

  // STYLES THE FABRIC OPTIONS
  fabricContainer: {
    width: "100%",
    gap: 12,
  },

  fabricButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedButton: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },

  fabricContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  fabricText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: "500",
  },

  selectedText: {
    color: COLORS.background,
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
    marginTop: 30,
  },

  backButtonText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: "600",
  },
});
