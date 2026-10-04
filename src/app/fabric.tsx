import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FABRIC_OPTIONS,
  selectFabric as getSelectedFabric,
} from "../utils/fabricOptions";
import { useAnalysis } from "../viewmodels/AnalysisViewModel";

export default function FabricSelection() {
  const { selectedFabric, setSelectedFabric } = useAnalysis();

  const handleFabricSelection = (fabric: string) => {
    const newFabric = getSelectedFabric(selectedFabric, fabric);

    setSelectedFabric(newFabric);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.brand}>Maxwells</Text>
          <Text style={styles.brandSmall}>Drycleaning</Text>
          <Text style={styles.appTitle}>Stain Detector</Text>
        </View>

        <View style={styles.fabricContainer}>
          {FABRIC_OPTIONS.map((fabric) => (
            <TouchableOpacity
              key={fabric}
              style={styles.fabricButton}
              onPress={() => handleFabricSelection(fabric)}
            >
              <Text style={styles.fabricText}>{fabric}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingTop: 30,
  },

  header: {
    alignItems: "center",
    marginBottom: 45,
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

  fabricContainer: {
    width: "100%",
  },

  fabricButton: {
    backgroundColor: "#F4F4F4",
    paddingVertical: 18,
    borderRadius: 15,
    marginBottom: 7,
    alignItems: "center",
    elevation: 4,
  },

  fabricText: {
    color: "#A78F61",
    fontSize: 13,
    fontWeight: "500",
  },
});
