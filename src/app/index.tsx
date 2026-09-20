import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAnalysis } from "../viewmodels/AnalysisViewModel";

export default function Index() {
  // Get selected fabric from fabric screen
  // Store garment and stain images
  const {
    garmentImage,
    stainImage,
    selectedFabric,
    setGarmentImage,
    setStainImage,
  } = useAnalysis();

  // Upload image from phone gallery
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

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      if (imageType === "garment") {
        setGarmentImage(imageUri);
      } else {
        setStainImage(imageUri);
      }
    }
  };

  // Take image using phone camera
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

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      if (imageType === "garment") {
        setGarmentImage(imageUri);
      } else {
        setStainImage(imageUri);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
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
          >
            <Text style={styles.smallButtonText}>UPLOAD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => openCamera("garment")}
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
          >
            <Text style={styles.smallButtonText}>UPLOAD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => openCamera("stain")}
          >
            <Text style={styles.smallButtonText}>OPEN CAMERA</Text>
          </TouchableOpacity>
        </View>

        {/* FABRIC SELECTION */}
        <TouchableOpacity
          style={styles.fabricButton}
          onPress={() => router.push("/fabric")}
        >
          <Text style={styles.buttonText}>SELECT FABRIC TYPE</Text>
        </TouchableOpacity>

        {/* SELECTED FABRIC */}
        {selectedFabric && (
          <Text style={styles.selectedFabric}>{selectedFabric}</Text>
        )}

        {/* ANALYSE BUTTON */}
        <TouchableOpacity style={styles.analyseButton}>
          <Text style={styles.analyseText}>ANALYSE</Text>
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
    paddingHorizontal: 22,
    paddingTop: 20,
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

  // UPLOAD / CAMERA
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

  analyseText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
