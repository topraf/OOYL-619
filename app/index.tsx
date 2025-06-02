import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Settings, History, Camera, Image as ImageIcon } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import { useOnboardingStore } from "@/store/onboarding-store";
import BottomNavigation from "@/components/BottomNavigation";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { resetUserImages, freeComparisonUsed, isPremium } = useUserStore();
  const { hasCompletedOnboarding, completeOnboarding } = useOnboardingStore();
  
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  // Check if onboarding is completed
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [hasCompletedOnboarding]);
  
  const handleStartComparison = () => {
    resetUserImages();
    router.push("/gender-selection");
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };
  
  // For demo purposes, uncomment this to skip onboarding
  // useEffect(() => {
  //   completeOnboarding();
  // }, []);
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/history")}
        >
          <History size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>League Checker</Text>
          <Text style={styles.subtitle}>Are they in your league?</Text>
        </View>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/settings")}
        >
          <Settings size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.heroGradient}
          >
            <Text style={styles.heroTitle}>Find Out If They're In Your League</Text>
            <Text style={styles.heroSubtitle}>
              Compare your beauty score with others and get honest results
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.actionsContainer}>
          <Animated.View style={animatedButtonStyle}>
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
                <Text style={styles.buttonText}>Start New Comparison</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          {!freeComparisonUsed && (
            <View style={styles.freeTagContainer}>
              <Text style={styles.freeTag}>First comparison is FREE!</Text>
            </View>
          )}
        </View>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>How It Works</Text>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Camera size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Take Your Selfie</Text>
              <Text style={styles.featureDescription}>
                Capture a clear selfie for accurate beauty analysis
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <ImageIcon size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Compare With Someone</Text>
              <Text style={styles.featureDescription}>
                Upload their photo or choose from our celebrity database
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + "20" }]}>
              <Text style={styles.gaugeIcon}>%</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Get Honest Results</Text>
              <Text style={styles.featureDescription}>
                Find out if they're in your league with our advanced algorithm
              </Text>
            </View>
          </View>
        </View>
        
        {!isPremium && (
          <View style={styles.premiumContainer}>
            <LinearGradient
              colors={[colors.secondary, colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumBanner}
            >
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumDescription}>
                Unlimited comparisons, celebrity matches, and AI beauty analysis
              </Text>
              <TouchableOpacity 
                style={styles.premiumButton}
                onPress={() => router.push("/subscription")}
              >
                <Text style={styles.premiumButtonText}>Get Premium</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
        
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimer}>
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80, // Space for bottom navigation
  },
  heroContainer: {
    height: 240,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    shadowColor: colors.shadow,
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
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.background,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.9,
  },
  actionsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    position: "relative",
  },
  mainButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: colors.shadow,
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
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  freeTagContainer: {
    position: "absolute",
    top: -10,
    right: 24,
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeTag: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "600",
  },
  featuresContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  gaugeIcon: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  premiumContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  premiumBanner: {
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.background,
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.9,
    marginBottom: 16,
  },
  premiumButton: {
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  premiumButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
  disclaimerContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 18,
  },
});