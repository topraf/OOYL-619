/**
 * Homepage Screen - Main landing page of the League Checker app
 * 
 * This is the primary entry point for users after onboarding. It provides:
 * - Hero section with app introduction
 * - Main CTA to start photo comparison
 * - Quick access to premium features (celebrities, AI roast)
 * - Premium upgrade banner for free users
 * - Feature explanation section
 * - App disclaimer
 * - Multilingual support with dynamic text based on user language preference
 * 
 * The screen uses a dark theme with orange/pink gradients and includes
 * smooth animations for user interactions. It integrates with the user
 * store for premium status, comparison management, and language settings.
 * 
 * Navigation: Includes bottom navigation and routes to various app sections
 * Premium: Shows upgrade prompts for non-premium users
 * Animations: React Native Reanimated for smooth interactions
 * Languages: Supports multiple languages through the translations system
 */

import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Settings, Camera, Star, MessageCircle, Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useUserStore } from "@/store/user-store";
import { useOnboardingStore } from "@/store/onboarding-store";
import BottomNavigation from "@/components/BottomNavigation";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withTiming,
  withRepeat,
  interpolate
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { resetUserImages, freeComparisonUsed, isPremium, getColors, getTranslations } = useUserStore();
  const { hasCompletedOnboarding, setHasCompletedOnboarding } = useOnboardingStore();
  const colors = getColors();
  const t = getTranslations();
  
  const buttonScale = useSharedValue(1);
  const heroScale = useSharedValue(0.95);
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(30);
  const pulseScale = useSharedValue(1);
  
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const animatedHeroStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heroScale.value }],
      opacity: fadeIn.value,
    };
  });
  
  const animatedSlideStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: slideUp.value }],
      opacity: fadeIn.value,
    };
  });
  
  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }]
    };
  });
  
  // Check if onboarding is completed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        router.push("/onboarding");
        // Force set onboarding as completed to prevent loops
        setHasCompletedOnboarding(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, router]);
  
  // Entrance animations
  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 800 });
    slideUp.value = withTiming(0, { duration: 800 });
    heroScale.value = withSpring(1, { damping: 15 });
    
    // Subtle pulse animation for the main button
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);
  
  const handleStartComparison = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    resetUserImages();
    router.push("/gender-selection");
  };

  const handleCelebrities = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isPremium || !freeComparisonUsed) {
      router.push("/celebrities");
    } else {
      router.push("/subscription");
    }
  };

  const handleAIRoast = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isPremium || !freeComparisonUsed) {
      router.push("/roastmaster");
    } else {
      router.push("/subscription");
    }
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#8B5A3C", "#FF6B35"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Out of Your League</Text>
            <TouchableOpacity
              style={styles.proButton}
              onPress={() => router.push("/subscription")}
            >
              <Text style={styles.proButtonText}>Go Pro +</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        
        <Animated.View style={[styles.mainCard, animatedSlideStyle]}>
          <View style={styles.mainCardContent}>
            <View style={styles.heartIcon}>
              <Text style={styles.heartEmoji}>♡</Text>
            </View>
            <Text style={styles.mainCardTitle}>
              Find out if (s)he is{"\n"}out of your league!
            </Text>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStartComparison}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Text style={styles.startButtonText}>Start ›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mainCardImage}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }}
              style={styles.coupleImage}
            />
          </View>
        </Animated.View>

        <Animated.View style={[styles.quickActionsContainer, animatedSlideStyle]}>
          <TouchableOpacity 
            style={[styles.quickActionCard, { backgroundColor: colors.card }]}
            onPress={handleCelebrities}
          >
            <View style={styles.cardIcon}>
              <Star size={24} color="#FFFFFF" />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Celebrities</Text>
              <Text style={[styles.cardDescription, { color: colors.textLight }]}>
                Compare yourself to{"\n"}famous celebrities
              </Text>
              <Text style={styles.unlockText}>Unlock PRO ›</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionCard, { backgroundColor: colors.card }]}
            onPress={handleAIRoast}
          >
            <View style={styles.cardIcon}>
              <MessageCircle size={24} color="#FFFFFF" />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>AI Roast</Text>
              <Text style={[styles.cardDescription, { color: colors.textLight }]}>
                Find smart ways to{"\n"}improve yourself
              </Text>
              <Text style={styles.unlockText}>Unlock PRO ›</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        

        
        <Animated.View style={[styles.featuresContainer, animatedSlideStyle]}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>
            How it works
          </Text>
          
          <Animated.View style={[styles.featureItem, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: "rgba(255, 107, 53, 0.2)" }]}>
              <Camera size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Take Your Selfie</Text>
              <Text style={[styles.featureDescription, { color: colors.textLight }]}>
                Capture a clear selfie for{"\n"}accurate beauty analysis
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
        
        {!isPremium && (
          <Animated.View style={[styles.premiumContainer, animatedSlideStyle]}>
            <LinearGradient
              colors={["#FF1744", "#FF6B35"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumBanner}
            >
              <View style={styles.premiumContent}>
                <Text style={styles.premiumTitle}>
                  Unlock PRO
                </Text>
                <Text style={styles.premiumDescription}>
                  Unlimited comparisons, celebrity{"\n"}matches, and AI beauty analyse
                </Text>
                <TouchableOpacity 
                  style={styles.premiumButton}
                  onPress={() => router.push("/subscription")}
                >
                  <Text style={styles.premiumButtonText}>Go Pro +</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        )}
        
        <View style={styles.disclaimerContainer}>
          <Text style={[styles.disclaimer, { color: colors.textLight }]}>
            {t.screens.home.disclaimer}
          </Text>
        </View>
      </ScrollView>
      
      <BottomNavigation currentRoute="scan" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 20,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  proButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  proButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  mainCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#2A1810",
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "row",
    minHeight: 160,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainCardContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  heartIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  heartEmoji: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  mainCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    lineHeight: 24,
  },
  startButton: {
    alignSelf: "flex-start",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B35",
  },
  mainCardImage: {
    width: 120,
    height: "100%",
  },
  coupleImage: {
    width: "100%",
    height: "100%",
  },
  quickActionsContainer: {
    flexDirection: "row",
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardContent: {
    padding: 16,
    flex: 1,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  unlockText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B35",
  },
  premiumContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  premiumBanner: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumContent: {
    padding: 24,
    alignItems: "center",
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  premiumButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  premiumButtonText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 16,
  },
  featuresContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  disclaimerContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});