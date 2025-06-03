import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Settings, Camera, Image as ImageIcon, Star, MessageCircle, Moon, Sun } from "lucide-react-native";
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
  const { resetUserImages, freeComparisonUsed, isPremium, getColors, theme, setTheme } = useUserStore();
  const { hasCompletedOnboarding } = useOnboardingStore();
  const colors = getColors();
  
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

  const handleThemeToggle = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Animated.View style={[styles.heroContainer, animatedHeroStyle]}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={["transparent", colors.overlay]}
            style={styles.heroGradient}
          />
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.overlay }]}
              onPress={handleThemeToggle}
            >
              {theme === "light" ? (
                <Moon size={20} color={colors.background} />
              ) : (
                <Sun size={20} color={colors.background} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.overlay }]}
              onPress={() => router.push("/settings")}
            >
              <Settings size={20} color={colors.background} />
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        <Animated.View style={[styles.actionsContainer, animatedSlideStyle]}>
          <Animated.View style={animatedPulseStyle}>
            <TouchableOpacity 
              style={styles.mainButton}
              onPress={handleStartComparison}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <LinearGradient
                colors={[colors.secondary, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Camera size={20} color={colors.background} />
                <Text style={[styles.buttonText, { color: colors.background }]}>Find out if (s)he is out of your league!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          {!freeComparisonUsed && (
            <Animated.View style={[styles.freeTagContainer, { backgroundColor: colors.success }]}>
              <Text style={[styles.freeTag, { color: colors.background }]}>First comparison is FREE!</Text>
            </Animated.View>
          )}
        </Animated.View>

        <Animated.View style={[styles.quickActionsContainer, animatedSlideStyle]}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.card }]}
            onPress={handleCelebrities}
          >
            <View style={styles.quickActionContent}>
              <Star size={20} color={colors.primary} />
              <Text style={[styles.quickActionText, { color: colors.text }]}>Celebrities</Text>
            </View>
            {(!isPremium && freeComparisonUsed) && (
              <View style={[styles.premiumBadge, { backgroundColor: colors.primary }]}>
                <Star size={10} color={colors.background} />
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.card }]}
            onPress={handleAIRoast}
          >
            <View style={styles.quickActionContent}>
              <MessageCircle size={20} color={colors.primary} />
              <Text style={[styles.quickActionText, { color: colors.text }]}>AI Roast</Text>
            </View>
            {(!isPremium && freeComparisonUsed) && (
              <View style={[styles.premiumBadge, { backgroundColor: colors.primary }]}>
                <Star size={10} color={colors.background} />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={[styles.featuresContainer, animatedSlideStyle]}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>
            How It{" "}
            <Text style={[styles.featuresTitleAccent, { color: colors.primary }]}>Works</Text>
          </Text>
          
          <Animated.View style={[styles.featureItem, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + "20" }]}>
              <Camera size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>📸 Take Your Selfie</Text>
              <Text style={[styles.featureDescription, { color: colors.textLight }]}>
                Capture a clear selfie for accurate beauty analysis
              </Text>
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.featureItem, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + "20" }]}>
              <ImageIcon size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>🎯 Compare With Someone</Text>
              <Text style={[styles.featureDescription, { color: colors.textLight }]}>
                Upload their photo or choose from our celebrity database
              </Text>
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.featureItem, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + "20" }]}>
              <Text style={[styles.gaugeIcon, { color: colors.primary }]}>%</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>✨ Get Honest Results</Text>
              <Text style={[styles.featureDescription, { color: colors.textLight }]}>
                Find out if they're in your league with our advanced algorithm
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
        
        {!isPremium && (
          <Animated.View style={[styles.premiumContainer, animatedSlideStyle]}>
            <LinearGradient
              colors={[colors.secondary, colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumBanner}
            >
              <Text style={[styles.premiumTitle, { color: colors.background }]}>
                Upgrade to{" "}
                <Text style={styles.premiumTitleAccent}>Premium</Text>
              </Text>
              <Text style={[styles.premiumDescription, { color: colors.background }]}>
                Unlimited comparisons, celebrity matches, and AI beauty analysis
              </Text>
              <TouchableOpacity 
                style={[styles.premiumButton, { backgroundColor: colors.background }]}
                onPress={() => router.push("/subscription")}
              >
                <Text style={[styles.premiumButtonText, { color: colors.primary }]}>Get Premium</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}
        
        <View style={styles.disclaimerContainer}>
          <Text style={[styles.disclaimer, { color: colors.textLight }]}>
            This app is for entertainment purposes only. Beauty is subjective and our algorithm
            provides an approximation based on photographic evidence. Not everyone is photogenic,
            so don't take the results too seriously!
          </Text>
        </View>
      </ScrollView>
      
      <BottomNavigation currentRoute="scan" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  heroContainer: {
    height: 240,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  headerButtons: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    position: "relative",
  },
  mainButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 8,
  },
  freeTagContainer: {
    position: "absolute",
    top: -10,
    right: 24,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeTag: {
    fontSize: 12,
    fontWeight: "700",
  },
  quickActionsContainer: {
    flexDirection: "row",
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    position: "relative",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  premiumBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  featuresContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 16,
  },
  featuresTitleAccent: {
    // Color applied dynamically
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
  gaugeIcon: {
    fontSize: 20,
    fontWeight: "800",
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
  premiumContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  premiumBanner: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  premiumTitleAccent: {
    textShadowColor: "rgba(255,255,255,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  premiumDescription: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
  },
  premiumButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  premiumButtonText: {
    fontWeight: "700",
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