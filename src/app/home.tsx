import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  // OPENS THE GARMENT AND STAIN ANALYSIS SCREEN
  const handleGetStarted = () => {
    router.push("/analyse");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* DISPLAYS THE FULL SCREEN GARMENT PHOTOGRAPH */}
      <ImageBackground
        source={require("../../assets/images/home-background.jpg")}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* ADDS A DARK GREEN OVERLAY */}
        <View style={styles.overlay}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* DISPLAYS THE MAXWELLS BRANDING */}
            <View style={styles.logoContainer}>
              <Text style={styles.brandName}>Maxwells</Text>

              <Text style={styles.brandSubtitle}>D R Y C L E A N I N G</Text>
            </View>

            {/* DISPLAYS THE MAIN HEADING */}
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>
                The Smart{"\n"}Alternative{"\n"}Since 1987
              </Text>
            </View>

            {/* DISPLAYS THE FEATURE HIGHLIGHTS */}
            <View style={styles.featuresContainer}>
              {/* DISPLAYS THE GARMENT FEATURE */}
              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name="shirt-outline" size={19} color="#D7C28C" />
                </View>

                <Text style={styles.featureText}>
                  Identify{"\n"}your garment
                </Text>
              </View>

              {/* DISPLAYS THE STAIN FEATURE */}
              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name="water-outline" size={19} color="#D7C28C" />
                </View>

                <Text style={styles.featureText}>Detect{"\n"}stains</Text>
              </View>

              {/* DISPLAYS THE RECOMMENDATION FEATURE */}
              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name="sparkles-outline" size={19} color="#D7C28C" />
                </View>

                <Text style={styles.featureText}>
                  Get cleaning{"\n"}recommendations
                </Text>
              </View>
            </View>

            {/* MAINTAINS SPACE ABOVE THE MAIN BUTTON */}
            <View style={styles.spacer} />

            {/* OPENS THE ANALYSIS SCREEN */}
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleGetStarted}
              activeOpacity={0.85}
            >
              <Text style={styles.getStartedText}>Get Started</Text>

              <Ionicons name="arrow-forward" size={19} color="#063522" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#063522",
  },

  // BACKGROUND IMAGE
  background: {
    flex: 1,
  },

  backgroundImage: {
    opacity: 0.9,
  },

  // DARK GREEN OVERLAY
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 35, 20, 0.55)",
  },

  // MAIN CONTENT
  content: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 20,
    paddingBottom: 22,
  },

  // MAXWELLS BRANDING
  logoContainer: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 42,
  },

  brandName: {
    color: "#F2E6C9",
    fontFamily: "serif",
    fontSize: 39,
    fontWeight: "400",
    letterSpacing: 0.5,
  },

  brandSubtitle: {
    color: "#D7C28C",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 2,
  },

  // MAIN HEADING
  headingContainer: {
    marginBottom: 34,
  },

  heading: {
    color: "#F2E6C9",
    fontFamily: "serif",
    fontSize: 33,
    fontWeight: "400",
    lineHeight: 40,
  },

  // FEATURE HIGHLIGHTS
  featuresContainer: {
    gap: 20,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  featureIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "rgba(215, 194, 140, 0.23)",
    alignItems: "center",
    justifyContent: "center",
  },

  featureText: {
    color: "#F2E6C9",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "500",
  },

  // FLEXIBLE SPACING
  spacer: {
    flexGrow: 1,
    minHeight: 35,
  },

  // GET STARTED BUTTON
  getStartedButton: {
    backgroundColor: "#D7C28C",
    borderRadius: 30,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 8,
  },

  getStartedText: {
    color: "#063522",
    fontSize: 16,
    fontWeight: "600",
  },
});
