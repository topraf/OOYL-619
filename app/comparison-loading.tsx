import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useUserStore } from "@/store/user-store";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  interpolate,
  runOnJS
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const imageSize = width * 0.3;

const loadingSteps = [
  "Analyzing facial features...",
  "Calculating beauty scores...",
  "Comparing attractiveness levels...",
  "Determining league status...",
  "Finalizing results..."
];

export default function ComparisonLoadingScreen() {
  const router = useRouter();
  const { user, currentTarget, getColors } = useUserStore();
  const colors = getColors();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const progressValue = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const fadeIn = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ]
    };
  });
  
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(progressValue.value, [0, 1], [0, 100])}%`,
    };
  });
  
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: fadeIn.value,
    };
  });
  
  useEffect(() => {
    // Entrance animation
    fadeIn.value = withTiming(1, { duration: 500 });
    
    // Rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
    
    // Scale animation
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // Pulse animation for images
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
    
    // Progress animation
    progressValue.value = withTiming(1, { 
      duration: 4000,
      easing: Easing.out(Easing.quad)
    });
    
    // Step progression
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= loadingSteps.length) {
          clearInterval(stepInterval);
          return prev;
        }
        return next;
      });
    }, 800);
    
    // Progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return next;
      });
    }, 80);
    
    // Navigate to results after animation completes
    const timer = setTimeout(() => {
      router.replace("/results");
    }, 4500);
    
    return () => {
      clearTimeout(timer);
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.background, colors.card]}
        style={styles.gradient}
      >
        <Animated.View style={pulseStyle}>
          <Text style={[styles.title, { color: colors.text }]}>Analyzing Your Photos</Text>
        </Animated.View>
        
        <View style={styles.imagesContainer}>
          <Animated.View style={[styles.imageWrapper, pulseStyle]}>
            <Image
              source={{ uri: user.frontImage || "" }}
              style={styles.image}
            />
            <View style={[styles.imageBorder, { borderColor: colors.primary }]} />
          </Animated.View>
          
          <Animated.View style={[styles.spinnerContainer, animatedStyle]}>
            <View style={[styles.spinnerRing, { borderColor: colors.primary }]} />
            <ActivityIndicator size="large" color={colors.primary} />
          </Animated.View>
          
          <Animated.View style={[styles.imageWrapper, pulseStyle]}>
            <Image
              source={{ uri: currentTarget?.image || "" }}
              style={styles.image}
            />
            <View style={[styles.imageBorder, { borderColor: colors.secondary }]} />
          </Animated.View>
        </View>
        
        <Animated.View style={[styles.statusContainer, pulseStyle]}>
          <Text style={[styles.statusText, { color: colors.text }]}>
            {loadingSteps[currentStep] || loadingSteps[loadingSteps.length - 1]}
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { backgroundColor: colors.primary },
                  progressStyle
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textLight }]}>
              {Math.round(progress)}%
            </Text>
          </View>
          
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  { 
                    backgroundColor: colors.primary,
                    opacity: (currentStep % 3) === index ? 1 : 0.3
                  }
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 48,
    textAlign: "center",
  },
  imagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 48,
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageBorder: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: imageSize / 2,
    borderWidth: 2,
  },
  spinnerContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  spinnerRing: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  statusContainer: {
    width: "100%",
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "500",
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});