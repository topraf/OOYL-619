/**
 * Onboarding Features Screen - Second screen showing how the app works
 * 
 * This screen demonstrates the core functionality with example images
 * and a visual gauge showing the league comparison system.
 */

import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { colors } from "@/constants/colors";
import { useOnboardingStore } from "@/store/onboarding-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <SafeAreaView style={styles.content}>
        <View style={styles.spacer} />
        
        <View style={styles.imagesContainer}>
          <View style={styles.imageCard}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" }}
              style={styles.faceImage}
            />
            <View style={styles.imageLabel}>
              <Text style={styles.imageLabelText}>You</Text>
            </View>
          </View>
          
          <View style={[styles.imageCard, styles.overlappingCard]}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" }}
              style={styles.faceImage}
            />
            <View style={styles.imageLabel}>
              <Text style={styles.imageLabelText}>Someone else</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.gaugeContainer}>
          <LinearGradient
            colors={["#FF6B35", "#4CC9F0", "#9C27B0", "#FF1744"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gauge}
          />
          <View style={styles.gaugeLabels}>
            <Text style={styles.gaugeLabel}>You can do better</Text>
            <Text style={styles.gaugeLabel}>Your league</Text>
            <Text style={styles.gaugeLabel}>Out of your league</Text>
          </View>
        </View>
        
        <Text style={styles.title}>
          Take a selfie and see{"\n"}your results
        </Text>
        
        <View style={styles.bottomContainer}>
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleContinue}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.indicator} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  spacer: {
    flex: 0.3,
  },
  imagesContainer: {
    alignItems: "center",
    marginBottom: 40,
    height: 280,
    justifyContent: "center",
  },
  imageCard: {
    width: 200,
    height: 240,
    borderRadius: 20,
    overflow: "hidden",
    position: "absolute",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  overlappingCard: {
    transform: [{ rotate: "15deg" }, { translateX: 60 }, { translateY: -20 }],
    zIndex: 1,
  },
  faceImage: {
    width: "100%",
    height: "100%",
  },
  imageLabel: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  imageLabelText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  gaugeContainer: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  gauge: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  gaugeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gaugeLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 60,
    lineHeight: 38,
  },
  bottomContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  button: {
    backgroundColor: "#FF6B35",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 60,
    marginBottom: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  indicator: {
    width: 134,
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2.5,
  },
});