import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  loadGarmentModel,
  runGarmentInference,
} from "../services/GarmentClassifier";
import { decodeGarmentPrediction } from "../services/GarmentPostprocessor";
import {
  preprocessGarmentImage,
  preprocessStainImage,
} from "../services/ImagePreprocessor";
import { logPerformance } from "../services/PerformanceLogger";
import { loadStainModel, runStainInference } from "../services/StainClassifier";
import { decodeStainPrediction } from "../services/StainPostprocessor";
import { createClassificationResult } from "../utils/classificationUtils";
import { mapGarmentCategory } from "../utils/garmentCategoryMapper";
import { validateAnalysis } from "../utils/validateAnalysis";
import { useAnalysis } from "../viewmodels/AnalysisViewModel";

const COLORS = {
  background: "#063522",
  gold: "#D7C28C",
  cream: "#F2E6C9",
  card: "#28523B",
  muted: "#C5CEBF",
  border: "rgba(215,194,140,0.3)",
};

export default function Analyse() {
  // RETRIEVES THE SHARED ANALYSIS STATE
  const {
    garmentImage,
    stainImage,
    selectedFabric,
    setGarmentImage,
    setStainImage,
    setClassificationResult,
  } = useAnalysis();

  // TRACKS THE ANALYSIS STATUS
  const [isAnalysing, setIsAnalysing] = useState(false);

  // RETURNS TO HOME WHEN THE ANDROID BACK BUTTON IS PRESSED
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (isAnalysing) {
            return true;
          }

          router.replace("/home");
          return true;
        },
      );

      return () => subscription.remove();
    }, [isAnalysing]),
  );

  // LOADS BOTH MODELS WHEN THE SCREEN OPENS
  useEffect(() => {
    const initialiseModels = async () => {
      try {
        const garmentSession = await loadGarmentModel();

        console.log("Garment model loaded successfully!");
        console.log("Garment inputs:", garmentSession.inputNames);
        console.log("Garment outputs:", garmentSession.outputNames);
      } catch (error) {
        console.error("Failed to load garment model:", error);
      }

      try {
        const stainSession = await loadStainModel();

        console.log("Stain model loaded successfully!");
        console.log("Stain inputs:", stainSession.inputNames);
        console.log("Stain outputs:", stainSession.outputNames);
      } catch (error) {
        console.error("Failed to load stain model:", error);
      }
    };

    initialiseModels();
  }, []);

  // OPENS THE PHOTO LIBRARY
  const uploadImage = async (imageType: "garment" | "stain") => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photos to upload an image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      if (imageType === "garment") {
        setGarmentImage(imageUri);
      } else {
        setStainImage(imageUri);
      }
    }
  };

  // OPENS THE PHONE CAMERA
  const openCamera = async (imageType: "garment" | "stain") => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Camera Permission Required",
        "Please allow camera access to take a photo.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      if (imageType === "garment") {
        setGarmentImage(imageUri);
      } else {
        setStainImage(imageUri);
      }
    }
  };

  // ANALYSES BOTH IMAGES
  const analyseImages = async () => {
    if (isAnalysing) {
      return;
    }

    // VALIDATES THE REQUIRED INPUTS
    const validationError = validateAnalysis(
      garmentImage,
      stainImage,
      selectedFabric,
    );

    if (validationError) {
      Alert.alert("Missing Information", validationError);
      return;
    }

    // STARTS THE PERFORMANCE MEASUREMENT
    const totalStart = performance.now();

    let preprocessingMs = 0;
    let modelLoadMs = 0;
    let inferenceMs = 0;
    let status: "SUCCESS" | "FAILED" = "FAILED";

    setIsAnalysing(true);

    try {
      // PREPROCESSES THE GARMENT IMAGE
      const garmentPreprocessingStart = performance.now();

      const garmentTensor = await preprocessGarmentImage(garmentImage!);

      preprocessingMs += performance.now() - garmentPreprocessingStart;

      // RUNS THE GARMENT MODEL
      const garmentInferenceResult = await runGarmentInference(garmentTensor);

      modelLoadMs += garmentInferenceResult.modelLoadMs;
      inferenceMs += garmentInferenceResult.inferenceMs;

      // READS THE GARMENT MODEL OUTPUT
      const garmentOutput = garmentInferenceResult.outputs["output0"];

      if (!garmentOutput) {
        throw new Error("Garment model output is missing");
      }

      // DECODES THE GARMENT PREDICTION
      const garmentPrediction = decodeGarmentPrediction(garmentOutput);

      // ALLOWS ANALYSIS TO CONTINUE WHEN NO GARMENT IS DETECTED
      const garmentType = garmentPrediction
        ? mapGarmentCategory(garmentPrediction.garmentType)
        : "No Garment Detected";

      const garmentConfidence = garmentPrediction
        ? Math.round(garmentPrediction.confidence * 100)
        : 0;

      console.log("Detected garment:", garmentType);
      console.log("Garment confidence:", garmentConfidence);

      // PREPROCESSES THE STAIN IMAGE
      const stainPreprocessingStart = performance.now();

      const stainTensor = await preprocessStainImage(stainImage!);

      preprocessingMs += performance.now() - stainPreprocessingStart;

      // RUNS THE STAIN MODEL
      const stainInferenceResult = await runStainInference(stainTensor);

      modelLoadMs += stainInferenceResult.modelLoadMs;
      inferenceMs += stainInferenceResult.inferenceMs;

      // READS THE STAIN MODEL OUTPUT
      const stainOutput = stainInferenceResult.outputs["output0"];

      if (!stainOutput) {
        throw new Error("Stain model output is missing");
      }

      // DECODES THE STAIN PREDICTION
      const stainPrediction = decodeStainPrediction(stainOutput);

      // HANDLES CASES WHERE NO STAIN IS DETECTED
      const stainType = stainPrediction?.stainType ?? "No Stain Detected";

      const stainConfidence = stainPrediction
        ? Math.round(stainPrediction.confidence * 100)
        : 0;

      console.log("Detected stain:", stainType);
      console.log("Stain confidence:", stainConfidence);

      // CREATES THE CLASSIFICATION RESULT
      const result = createClassificationResult(
        garmentType,
        garmentConfidence,
        stainType,
        stainConfidence,
      );

      // STORES THE CLASSIFICATION RESULT
      setClassificationResult(result);

      status = "SUCCESS";

      // OPENS THE CONFIRMATION SCREEN
      router.push("/confirmation");
    } catch (error) {
      console.error("Image analysis failed:", error);

      Alert.alert(
        "Analysis Error",
        "Unable to analyse the images. Please try again.",
      );
    } finally {
      // RECORDS THE TOTAL ANALYSIS TIME
      const totalMs = performance.now() - totalStart;

      console.log("Total analysis time:", totalMs.toFixed(2), "ms");

      // SAVES THE PERFORMANCE RESULTS
      try {
        await logPerformance({
          timestamp: new Date().toISOString(),
          preprocessingMs,
          modelLoadMs,
          inferenceMs,
          totalMs,
          status,
        });
      } catch (error) {
        console.error("Failed to save performance results:", error);
      }

      // RESETS THE ANALYSIS STATUS
      setIsAnalysing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* DISPLAYS THE MAXWELLS BRANDING */}
        <View style={styles.header}>
          <Text style={styles.brand}>Maxwells</Text>

          <Text style={styles.brandSmall}>D R Y C L E A N I N G</Text>

          <Text style={styles.appTitle}>Garment & Stain Analysis</Text>
        </View>

        {/* DISPLAYS THE GARMENT SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identify Your Garment</Text>

          <Text style={styles.subText}>
            Upload or take a photo showing the entire garment.
          </Text>

          <View style={styles.imagePlaceholder}>
            {garmentImage ? (
              <Image
                source={{ uri: garmentImage }}
                style={styles.selectedImage}
              />
            ) : (
              <View style={styles.emptyImage}>
                <Ionicons name="shirt-outline" size={36} color={COLORS.gold} />

                <Text style={styles.imageText}>Garment Image</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => uploadImage("garment")}
              disabled={isAnalysing}
            >
              <Ionicons name="images-outline" size={17} color={COLORS.cream} />

              <Text style={styles.smallButtonText}>Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => openCamera("garment")}
              disabled={isAnalysing}
            >
              <Ionicons name="camera-outline" size={17} color={COLORS.cream} />

              <Text style={styles.smallButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DISPLAYS THE STAIN SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detect Your Stain</Text>

          <Text style={styles.subText}>
            Upload or take a close-up photo of the stain.
          </Text>

          <View style={styles.imagePlaceholder}>
            {stainImage ? (
              <Image
                source={{ uri: stainImage }}
                style={styles.selectedImage}
              />
            ) : (
              <View style={styles.emptyImage}>
                <Ionicons name="water-outline" size={36} color={COLORS.gold} />

                <Text style={styles.imageText}>Stain Image</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => uploadImage("stain")}
              disabled={isAnalysing}
            >
              <Ionicons name="images-outline" size={17} color={COLORS.cream} />

              <Text style={styles.smallButtonText}>Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => openCamera("stain")}
              disabled={isAnalysing}
            >
              <Ionicons name="camera-outline" size={17} color={COLORS.cream} />

              <Text style={styles.smallButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DISPLAYS THE FABRIC SELECTION */}
        <TouchableOpacity
          style={styles.fabricButton}
          onPress={() => router.push("/fabric")}
          disabled={isAnalysing}
        >
          <Ionicons name="layers-outline" size={18} color={COLORS.cream} />

          <Text style={styles.secondaryButtonText}>Select Fabric Type</Text>
        </TouchableOpacity>

        {selectedFabric ? (
          <Text style={styles.selectedFabric}>
            Selected Fabric: {selectedFabric}
          </Text>
        ) : null}

        {/* STARTS THE ANALYSIS */}
        <TouchableOpacity
          style={[styles.analyseButton, isAnalysing && styles.disabledButton]}
          onPress={analyseImages}
          disabled={isAnalysing}
        >
          {isAnalysing ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Ionicons name="scan-outline" size={20} color={COLORS.background} />
          )}

          <Text style={styles.analyseText}>
            {isAnalysing ? "Analysing..." : "Analyse"}
          </Text>

          {!isAnalysing && (
            <Ionicons
              name="arrow-forward"
              size={19}
              color={COLORS.background}
            />
          )}
        </TouchableOpacity>

        {/* DISPLAYS THE ANALYSIS STATUS */}
        {isAnalysing && (
          <Text style={styles.loadingText}>
            Identifying your garment and stain...
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // STYLES THE SCREEN CONTENT
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 36,
  },

  // STYLES THE BRANDING
  header: {
    alignItems: "center",
    marginBottom: 28,
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

  appTitle: {
    color: COLORS.cream,
    fontFamily: "serif",
    fontSize: 24,
    marginTop: 24,
  },

  // STYLES THE IMAGE SECTIONS
  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: COLORS.cream,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
  },

  subText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 12,
  },

  imagePlaceholder: {
    height: 170,
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyImage: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  imageText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: "500",
  },

  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // STYLES THE UPLOAD AND CAMERA BUTTONS
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  smallButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 30,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  smallButtonText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: "600",
  },

  // STYLES THE FABRIC SELECTION BUTTON
  fabricButton: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
  },

  secondaryButtonText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: "600",
  },

  selectedFabric: {
    color: COLORS.gold,
    textAlign: "center",
    fontSize: 13,
    marginTop: 12,
    fontWeight: "600",
  },

  // STYLES THE MAIN ANALYSE BUTTON
  analyseButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 25,
  },

  analyseText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
  },

  disabledButton: {
    opacity: 0.7,
  },

  loadingText: {
    color: COLORS.cream,
    textAlign: "center",
    fontSize: 12,
    marginTop: 12,
  },
});
