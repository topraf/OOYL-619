import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowRight, Star } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { darkColors } from "@/constants/colors";
import { useOnboardingStore } from "@/store/onboarding-store";
import { useUserStore } from "@/store/user-store";
import { subscriptionPlans } from "@/mocks/subscriptions";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function OnboardingSubscriptionScreen() {
  const router = useRouter();
  const { completeOnboarding, skipPremium, hasCompletedOnboarding } = useOnboardingStore();
  const { setPremiumStatus } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans.find(p => p.id === "monthly"));
  const colors = darkColors;
  
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
  
  const handleSubscribe = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // In a real app, this would handle payment processing
    setPremiumStatus(true);
    completeOnboarding();
    router.replace("/");
  };
  
  const handleSkip = () => {
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
        <Text style={[styles.title, { color: colors.text }]}>
          Get the{" "}
          <Text style={[styles.titleAccent, { color: colors.primary }]}>Full Experience</Text>
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Unlock all premium features and enjoy unlimited comparisons
        </Text>
        
        <View style={styles.plansContainer}>
          <View style={styles.plansRow}>
            {subscriptionPlans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  { backgroundColor: colors.card },
                  selectedPlan?.id === plan.id && { borderColor: colors.primary }
                ]}
                onPress={() => setSelectedPlan(plan)}
              >
                <View style={styles.planHeader}>
                  <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
                  <Text style={[styles.planPrice, { color: colors.primary }]}>{plan.price}</Text>
                  <Text style={[styles.planInterval, { color: colors.textLight }]}>
                    {plan.interval === "one-time" ? "One-time" : `per ${plan.interval}`}
                  </Text>
                </View>
                
                {plan.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                    <Star size={12} color={colors.background} />
                    <Text style={[styles.popularText, { color: colors.background }]}>POPULAR</Text>
                  </View>
                )}
                
                <View style={[
                  styles.radioButton,
                  { borderColor: selectedPlan?.id === plan.id ? colors.primary : colors.border }
                ]}>
                  {selectedPlan?.id === plan.id && (
                    <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={[styles.featuresContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>Premium Features</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🚀</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>Unlimited comparisons</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>⭐</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>Celebrity comparisons</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🤖</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>AI beauty analysis and tips</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🔥</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>AI roast feature</Text>
          </View>
        </View>
        
        <View style={styles.trialContainer}>
          <LinearGradient
            colors={[colors.secondary, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.trialBanner}
          >
            <Text style={[styles.trialTitle, { color: colors.text }]}>3-Day Free Trial</Text>
            <Text style={[styles.trialDescription, { color: colors.text }]}>
              Try all premium features for free. Cancel anytime before the trial ends.
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Animated.View style={animatedSubscribeButtonStyle}>
          <TouchableOpacity 
            style={[styles.subscribeButton, { backgroundColor: colors.primary }]}
            onPress={handleSubscribe}
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
            onPress={handleSkip}
            onPressIn={onSkipPressIn}
            onPressOut={onSkipPressOut}
          >
            <Text style={[styles.skipButtonText, { color: colors.textLight }]}>Maybe Later</Text>
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
    marginBottom: 24,
    lineHeight: 24,
  },
  plansContainer: {
    marginBottom: 24,
  },
  plansRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  planCard: {
    width: (width - 72) / 3,
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  planHeader: {
    alignItems: "center",
    marginBottom: 12,
  },
  planName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  planInterval: {
    fontSize: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 8,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  popularBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  popularText: {
    fontSize: 8,
    fontWeight: "700",
    marginLeft: 2,
  },
  featuresContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
  },
  trialContainer: {
    marginBottom: 24,
  },
  trialBanner: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  trialTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  trialDescription: {
    fontSize: 14,
    opacity: 0.9,
  },
  footer: {
    padding: 24,
  },
  subscribeButton: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribeButtonText: {
    fontSize: 16,
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