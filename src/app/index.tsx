import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  loadGarmentModel,
  runGarmentInference,
} from "../services/GarmentClassifier";

import { preprocessGarmentImage } from "../services/ImagePreprocessor";
import { logPerformance } from "../services/PerformanceLogger";
import { createClassificationResult } from "../utils/classificationUtils";
import { validateAnalysis } from "../utils/validateAnalysis";
import { useAnalysis } from "../viewmodels/AnalysisViewModel";

export default function Index() {
  // STORES THE SELECTED IMAGES AND FABRIC
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

  useEffect(() => {
    // LOADS THE GARMENT MODEL WHEN THE SCREEN OPENS
    const initialiseModel = async () => {
      try {
        const session = await loadGarmentModel();

        console.log("Garment model loaded successfully!");
        console.log("Model inputs:", session.inputNames);
        console.log("Model outputs:", session.outputNames);
      } catch (error) {
        console.error("Failed to load garment model:", error);
      }
    };

    initialiseModel();
  }, []);

  const uploadImage = async (imageType: "garment" | "stain") => {
    // REQUESTS PHOTO LIBRARY PERMISSION
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photos to upload an image.",
      );
      return;
    }

    // OPENS THE PHONE GALLERY
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    // STORES THE SELECTED IMAGE
    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      if (imageType === "garment") {
        setGarmentImage(imageUri);
      } else {
        setStainImage(imageUri);
      }
    }
  };

  const openCamera = async (imageType: "garment" | "stain") => {
    // REQUESTS CAMERA PERMISSION
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Camera Permission Required",
        "Please allow camera access to take a photo.",
      );
      return;
    }

    // OPENS THE PHONE CAMERA
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    // STORES THE CAPTURED IMAGE
    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      if (imageType === "garment") {
        setGarmentImage(imageUri);
      } else {
        setStainImage(imageUri);
      }
    }
  };

  const analyseImages = async () => {
    // PREVENTS MULTIPLE SIMULTANEOUS ANALYSES
    if (isAnalysing) {
      return;
    }

    // VALIDATES THE REQUIRED ANALYSIS INPUTS
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
      // MEASURES THE GARMENT PREPROCESSING TIME
      console.log("Starting garment preprocessing...");

      const preprocessingStart = performance.now();

      const imageTensor = await preprocessGarmentImage(garmentImage!);

      preprocessingMs = performance.now() - preprocessingStart;

      console.log(
        "Garment preprocessing time:",
        preprocessingMs.toFixed(2),
        "ms",
      );

      // RUNS THE GARMENT MODEL
      const inferenceResult = await runGarmentInference(imageTensor);

      // STORES THE MODEL PERFORMANCE MEASUREMENTS
      modelLoadMs = inferenceResult.modelLoadMs;
      inferenceMs = inferenceResult.inferenceMs;

      console.log(
        "Garment model outputs:",
        Object.keys(inferenceResult.outputs),
      );

      // GENERATES TEMPORARY CLASSIFICATION RESULTS
      const result = createClassificationResult("Shirt", 92, "Coffee", 87);

      setClassificationResult(result);

      status = "SUCCESS";

      // NAVIGATES TO THE CONFIRMATION SCREEN
      router.push("/confirmation");
    } catch (error) {
      console.error("Garment analysis failed:", error);

      Alert.alert(
        "Analysis Error",
        "Unable to analyse the garment image. Please try again.",
      );
    } finally {
      // MEASURES THE TOTAL PROCESSING TIME
      const totalMs = performance.now() - totalStart;

      console.log("Total analysis time:", totalMs.toFixed(2), "ms");

      // SAVES THE PERFORMANCE RESULTS
      await logPerformance({
        timestamp: new Date().toISOString(),
        preprocessingMs,
        modelLoadMs,
        inferenceMs,
        totalMs,
        status,
      });

      // RESETS THE ANALYSIS STATUS
      setIsAnalysing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.brand}>Maxwells</Text>
          <Text style={styles.brandSmall}>Drycleaning</Text>
          <Text style={styles.appTitle}>Stain Detector</Text>
        </View>

        {/* GARMENT SECTION */}
        <Text style={styles.instruction}>
          Upload or take a photo of your garment!
        </Text>

        <Text style={styles.subText}>
          Please ensure the whole item can be seen
        </Text>

        {/* GARMENT IMAGE */}
        <View style={styles.imagePlaceholder}>
          {garmentImage ? (
            <Image
              source={{ uri: garmentImage }}
              style={styles.selectedImage}
            />
          ) : (
            <>
              <Text style={styles.imageText}>Garment</Text>
              <Text style={styles.imageText}>Image</Text>
            </>
          )}
        </View>

        {/* GARMENT BUTTONS */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => uploadImage("garment")}
            disabled={isAnalysing}
          >
            <Text style={styles.smallButtonText}>UPLOAD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => openCamera("garment")}
            disabled={isAnalysing}
          >
            <Text style={styles.smallButtonText}>OPEN CAMERA</Text>
          </TouchableOpacity>
        </View>

        {/* STAIN SECTION */}
        <Text style={styles.instruction}>
          Upload or take a photo of the stain
        </Text>

        <Text style={styles.subText}>
          Please take a close-up picture of the stain
        </Text>

        {/* STAIN IMAGE */}
        <View style={styles.imagePlaceholder}>
          {stainImage ? (
            <Image source={{ uri: stainImage }} style={styles.selectedImage} />
          ) : (
            <>
              <Text style={styles.imageText}>Stain</Text>
              <Text style={styles.imageText}>Image</Text>
            </>
          )}
        </View>

        {/* STAIN BUTTONS */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => uploadImage("stain")}
            disabled={isAnalysing}
          >
            <Text style={styles.smallButtonText}>UPLOAD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => openCamera("stain")}
            disabled={isAnalysing}
          >
            <Text style={styles.smallButtonText}>OPEN CAMERA</Text>
          </TouchableOpacity>
        </View>

        {/* FABRIC SELECTION */}
        <TouchableOpacity
          style={styles.fabricButton}
          onPress={() => router.push("/fabric")}
          disabled={isAnalysing}
        >
          <Text style={styles.buttonText}>SELECT FABRIC TYPE</Text>
        </TouchableOpacity>

        {/* SELECTED FABRIC */}
        {selectedFabric && (
          <Text style={styles.selectedFabric}>{selectedFabric}</Text>
        )}

        {/* ANALYSE BUTTON */}
        <TouchableOpacity
          style={[styles.analyseButton, isAnalysing && styles.disabledButton]}
          onPress={analyseImages}
          disabled={isAnalysing}
        >
          <Text style={styles.analyseText}>
            {isAnalysing ? "ANALYSING..." : "ANALYSE"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D3B24",
  },

  // SCREEN
  container: {
    flexGrow: 1,
    backgroundColor: "#0D3B24",
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 24,
  },

  // HEADER
  header: {
    alignItems: "center",
    marginBottom: 16,
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

  // TEXT
  instruction: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 13,
    marginTop: 7,
  },

  subText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 8,
    marginTop: 2,
    marginBottom: 6,
    opacity: 0.8,
  },

  // IMAGE
  imagePlaceholder: {
    width: "100%",
    height: 145,
    backgroundColor: "#52755D",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  imageText: {
    color: "#D7C28C",
    fontSize: 31,
    fontWeight: "bold",
    lineHeight: 34,
  },

  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // UPLOAD AND CAMERA
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 10,
  },

  smallButton: {
    backgroundColor: "#71884C",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 14,
    minWidth: 105,
  },

  smallButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 9,
    fontWeight: "600",
  },

  // FABRIC
  fabricButton: {
    alignSelf: "center",
    backgroundColor: "#71884C",
    paddingVertical: 7,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginTop: 3,
    minWidth: 190,
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "600",
  },

  selectedFabric: {
    color: "#D7C28C",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
  },

  // ANALYSE
  analyseButton: {
    alignSelf: "center",
    backgroundColor: "#C4AA72",
    paddingVertical: 9,
    paddingHorizontal: 42,
    borderRadius: 18,
    marginTop: 10,
    minWidth: 170,
  },

  disabledButton: {
    opacity: 0.6,
  },

  analyseText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
