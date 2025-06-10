import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowRight, Star, Zap, Crown, Sparkles } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useUserStore } from "@/store/user-store";
import { useOnboardingStore } from "@/store/onboarding-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function OnboardingSubscriptionScreen() {
  const router = useRouter();
  const { getColors, setPremiumStatus } = useUserStore();
  const { completeOnboarding, acceptPremium, skipPremium, hasCompletedOnboarding } = useOnboardingStore();
  const colors = getColors();
  
  const subscribeButtonScale = useSharedValue(1);
  const skipButtonScale = useSharedValue(1);
  
  const animatedSubscribeButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: subscribeButtonScale.value }]
    };
  });
  
  const animatedSkipButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: skipButtonScale.value }]
    };
  });
  
  // Redirect if onboarding is already completed
  React.useEffect(() => {
    if (hasCompletedOnboarding) {
      router.replace("/");
    }
  }, [hasCompletedOnboarding]);
  
  const handleStartTrial = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // In a real app, this would handle payment processing
    setPremiumStatus(true);
    acceptPremium();
    completeOnboarding();
    router.replace("/");
  };
  
  const handleNotRightNow = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    skipPremium();
    completeOnboarding();
    router.replace("/");
  };

  const onSubscribePressIn = () => {
    subscribeButtonScale.value = withSpring(0.95);
  };

  const onSubscribePressOut = () => {
    subscribeButtonScale.value = withSpring(1);
  };
  
  const onSkipPressIn = () => {
    skipButtonScale.value = withSpring(0.95);
  };

  const onSkipPressOut = () => {
    skipButtonScale.value = withSpring(1);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.headerContainer, { backgroundColor: colors.primary + "10" }]}>
          <View style={[styles.crownContainer, { backgroundColor: colors.primary + "20" }]}>
            <Crown size={32} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Unlock{" "}
            <Text style={[styles.titleAccent, { color: colors.primary }]}>Pro Features</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            Get unlimited access to all premium features with a 3-day free trial
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + "20" }]}>
              <Zap size={20} color={colors.primary} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>Unlimited beauty comparisons</Text>
          </View>
          
          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + "20" }]}>
              <Star size={20} color={colors.primary} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>Compare with celebrities</Text>
          </View>
          
          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + "20" }]}>
              <Sparkles size={20} color={colors.primary} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>AI beauty analysis & tips</Text>
          </View>
          
          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + "20" }]}>
              <Sparkles size={20} color={colors.primary} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>AI roast feature for fun</Text>
          </View>
        </View>
        
        <View style={styles.trialContainer}>
          <LinearGradient
            colors={[colors.secondary, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.trialBanner}
          >
            <Text style={[styles.trialTitle, { color: colors.background }]}>3-Day Free Trial</Text>
            <Text style={[styles.trialDescription, { color: colors.background }]}>
              Try all premium features for free. Cancel anytime before the trial ends.
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.pricingContainer}>
          <Text style={[styles.pricingText, { color: colors.textLight }]}>
            Then $9.99/month. Cancel anytime.
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Animated.View style={animatedSubscribeButtonStyle}>
          <TouchableOpacity 
            style={[styles.subscribeButton, { backgroundColor: colors.primary }]}
            onPress={handleStartTrial}
            onPressIn={onSubscribePressIn}
            onPressOut={onSubscribePressOut}
          >
            <Text style={[styles.subscribeButtonText, { color: colors.background }]}>Start Free Trial</Text>
            <ArrowRight size={20} color={colors.background} />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={animatedSkipButtonStyle}>
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleNotRightNow}
            onPressIn={onSkipPressIn}
            onPressOut={onSkipPressOut}
          >
            <Text style={[styles.skipButtonText, { color: colors.textLight }]}>Not right now</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Text style={[styles.disclaimer, { color: colors.textLight }]}>
          Subscription will auto-renew after the trial. Cancel anytime in your App Store settings.
          By subscribing you agree to our Terms and Privacy Policy.
        </Text>
      </View>
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
    padding: 24,
  },
  headerContainer: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 32,
  },
  crownContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
    lineHeight: 36,
  },
  titleAccent: {
    // Color applied dynamically
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    fontWeight: "600",
  },
  trialContainer: {
    marginBottom: 16,
  },
  trialBanner: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  trialTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  trialDescription: {
    fontSize: 14,
    opacity: 0.9,
    textAlign: "center",
  },
  pricingContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  pricingText: {
    fontSize: 14,
  },
  footer: {
    padding: 24,
  },
  subscribeButton: {
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  skipButtonText: {
    fontSize: 16,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});