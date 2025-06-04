import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Camera, Sparkles, MessageCircle, Star, Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useUserStore } from "@/store/user-store";
import BottomNavigation from "@/components/BottomNavigation";
import PaywallModal from "@/components/PaywallModal";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { user, isPremium, freeComparisonUsed, getColors } = useUserStore();
  const colors = getColors();
  const [showPaywall, setShowPaywall] = useState(false);
  
  const buttonScale = useSharedValue(1);
  const cardScale = useSharedValue(1);
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(50);
  
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }],
      opacity: fadeIn.value,
    };
  });
  
  const animatedSlideStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: slideUp.value }],
      opacity: fadeIn.value,
    };
  });

  useEffect(() => {
    // Entrance animation
    fadeIn.value = withTiming(1, { duration: 800 });
    slideUp.value = withTiming(0, { duration: 800 });
  }, []);

  const handleStartComparison = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Animate button press
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // Check if user has used free comparison and is not premium
    if (freeComparisonUsed && !isPremium) {
      setShowPaywall(true);
      return;
    }
    
    router.push("/user-photo");
  };

  const handleCelebrityComparison = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    
    router.push("/celebrities");
  };

  const handleAIRoast = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    
    router.push("/roastmaster");
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <Animated.View style={[styles.content, animatedSlideStyle]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            League{" "}
            <Text style={[styles.titleAccent, { color: colors.primary }]}>Checker</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            Find out if someone is in your league
          </Text>
        </View>

        <Animated.View style={[styles.mainCard, animatedCardStyle]}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: "#FFFFFF" }]}>Start Your Analysis</Text>
                <Text style={[styles.cardSubtitle, { color: "#FFFFFF" }]}>
                  Upload your photo and compare with anyone
                </Text>
              </View>
              
              <Animated.View style={animatedButtonStyle}>
                <TouchableOpacity 
                  style={[styles.startButton, { backgroundColor: colors.background }]} 
                  onPress={handleStartComparison}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                >
                  <Camera size={24} color={colors.primary} />
                  <Text style={[styles.startButtonText, { color: colors.primary }]}>
                    {freeComparisonUsed && !isPremium ? "Upgrade to Continue" : "Start Comparison"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.featuresGrid}>
          <Animated.View style={[styles.featureCard, animatedCardStyle]}>
            <TouchableOpacity 
              style={[styles.featureButton, { backgroundColor: colors.card }]}
              onPress={handleCelebrityComparison}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder}
              >
                <View style={[styles.featureContent, { backgroundColor: colors.card }]}>
                  <View style={styles.featureImageContainer}>
                    <Image
                      source={{ uri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face" }}
                      style={styles.featureImage}
                    />
                    <View style={[styles.plusIcon, { backgroundColor: colors.primary }]}>
                      <Plus size={16} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>Celebrity Match</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textLight }]}>
                    Compare with famous people
                  </Text>
                  {!isPremium && <Text style={[styles.premiumBadge, { color: colors.primary }]}>Premium</Text>}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.featureCard, animatedCardStyle]}>
            <TouchableOpacity 
              style={[styles.featureButton, { backgroundColor: colors.card }]}
              onPress={handleAIRoast}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder}
              >
                <View style={[styles.featureContent, { backgroundColor: colors.card }]}>
                  <View style={styles.featureImageContainer}>
                    <Image
                      source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" }}
                      style={styles.featureImage}
                    />
                    <View style={[styles.plusIcon, { backgroundColor: colors.primary }]}>
                      <Plus size={16} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>AI Roast</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textLight }]}>
                    Get roasted by our AI
                  </Text>
                  {!isPremium && <Text style={[styles.premiumBadge, { color: colors.primary }]}>Premium</Text>}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>How it works</Text>
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumberText, { color: "#FFFFFF" }]}>1</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textLight }]}>Upload your photo</Text>
            </View>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumberText, { color: "#FFFFFF" }]}>2</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textLight }]}>Choose who to compare with</Text>
            </View>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumberText, { color: "#FFFFFF" }]}>3</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textLight }]}>Get your league status</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <BottomNavigation currentRoute="home" />
      
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 8,
  },
  titleAccent: {
    // Color applied dynamically
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  mainCard: {
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientCard: {
    borderRadius: 20,
    padding: 24,
  },
  cardContent: {
    alignItems: "center",
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.9,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  featuresGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 12,
  },
  featureCard: {
    flex: 1,
  },
  featureButton: {
    borderRadius: 16,
  },
  gradientBorder: {
    borderRadius: 16,
    padding: 2,
  },
  featureContent: {
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    position: "relative",
  },
  featureImageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  featureImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  plusIcon: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  featureSubtitle: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  premiumBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    fontSize: 10,
    fontWeight: "700",
  },
  infoSection: {
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },
  stepsList: {
    gap: 12,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "700",
  },
  stepText: {
    fontSize: 16,
    flex: 1,
  },
});