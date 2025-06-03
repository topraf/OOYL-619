import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Camera, ArrowRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { colors } from "@/constants/colors";
import { useOnboardingStore } from "@/store/onboarding-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function OnboardingFeaturesScreen() {
  const router = useRouter();
  const { setCurrentStep } = useOnboardingStore();
  
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const handleContinue = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setCurrentStep(2);
    router.push("/onboarding-more-features");
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Take a selfie and see your{" "}
          <Text style={styles.titleAccent}>results</Text>
        </Text>
        
        <View style={styles.featureContainer}>
          <View style={styles.imagesRow}>
            <View style={styles.imageBox}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
                style={styles.faceImage}
              />
              <Text style={styles.imageLabel}>You</Text>
            </View>
            
            <View style={styles.imageBox}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
                style={styles.faceImage}
              />
              <Text style={styles.imageLabel}>Someone Else</Text>
            </View>
          </View>
          
          <View style={styles.gaugeContainer}>
            <Text style={styles.gaugeTitle}>League Status Gauge</Text>
            <LinearGradient
              colors={[
                colors.gauge.purple,
                colors.gauge.blue,
                colors.gauge.green,
                colors.gauge.yellow,
                colors.gauge.orange,
                colors.gauge.red,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gauge}
            />
            <View style={styles.gaugeLabels}>
              <Text style={styles.gaugeLabel}>You can do better</Text>
              <Text style={styles.gaugeLabel}>In your league</Text>
              <Text style={[styles.gaugeLabel, styles.outOfLeagueLabel]}>Out of your league</Text>
            </View>
          </View>
        </View>
        
        <LinearGradient
          colors={[colors.primary + "10", colors.secondary + "10"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.infoContainer}
        >
          <View style={styles.infoIconContainer}>
            <Camera size={24} color={colors.primary} />
          </View>
          <Text style={styles.infoText}>
            With our AI-powered face analysis, we'll calculate your beauty score and compare it with others
          </Text>
        </LinearGradient>
      </View>
      
      <View style={styles.footer}>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleContinue}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <ArrowRight size={20} color={colors.background} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 36,
  },
  titleAccent: {
    color: colors.primary,
  },
  featureContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  imageBox: {
    width: (width - 96) / 2,
    alignItems: "center",
  },
  faceImage: {
    width: (width - 96) / 2,
    height: (width - 96) / 2,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.border,
  },
  imageLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },
  gaugeContainer: {
    marginTop: 8,
  },
  gaugeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  gauge: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  gaugeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gaugeLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  outOfLeagueLabel: {
    color: colors.gauge.red,
    fontWeight: "700",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
});