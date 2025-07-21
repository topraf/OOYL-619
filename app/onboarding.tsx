import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { colors } from "@/constants/colors";
import { useOnboardingStore } from "@/store/onboarding-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const { setCurrentStep } = useOnboardingStore();

  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });

  const handleGetStarted = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setCurrentStep(1);
    router.push("/onboarding-features");
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
          <View style={styles.imageContainer}>
            <Image
                source={{ uri: "https://vivre-et-aimer.org/wp-content/uploads/2023/12/couple-sur-la-plage-768x870.jpg" }}
                style={styles.image}
            />
            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.5)"]}
                style={styles.imageGradient}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Want to see who's out of your league?
              <Text style={styles.titleAccent}></Text>
            </Text>
            <Text style={styles.subtitle}>
              Find out if that crush is in your league with our AI-powered beauty analysis
            </Text>
          </View>

          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity
                style={styles.button}
                onPress={handleGetStarted}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
              <LinearGradient
                  colors={['#913f8f', '#e5a0b9', '#f9943b']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    padding: 15,
                    borderRadius: 50,
                    alignItems: 'center',
                  }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Get started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.disclaimer}>
            For entertainment purposes only. Beauty is subjective and our algorithm
            provides an approximation based on photographic evidence.
          </Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  imageContainer: {
    width: width - 30,
    height: width - 10,
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  textContainer: {
    marginVertical: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 35,
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    width: width - 34,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: "700",
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 16,
  },
});