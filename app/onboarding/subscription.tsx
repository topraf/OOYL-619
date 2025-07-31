import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { colors } from "@/constants/colors";
import { useOnboardingStore } from "@/store/onboarding-store";
import { useUserStore } from "@/store/user-store";
import { subscriptionPlans } from "@/mocks/subscriptions";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function OnboardingSubscriptionScreen() {
  const router = useRouter();
  const { completeOnboarding, skipPremium } = useOnboardingStore();
  const { setPremiumStatus } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans.find(p => p.id === "lifetime"));

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

  const handleSubscribe = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // In a real app, this would handle payment processing
    setPremiumStatus(true);
    completeOnboarding();
    router.push("/");
  };

  const handleSkip = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    skipPremium();
    completeOnboarding();
    router.push("/");
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Upgrade to Premium</Text>

        <Text style={styles.subtitle}>
          Unlock all premium features and enjoy unlimited comparisons
        </Text>

        <View style={styles.plansContainer}>
          <View style={styles.plansRow}>
            {subscriptionPlans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan?.id === plan.id && styles.selectedPlanCard
                ]}
                onPress={() => setSelectedPlan(plan)}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planInterval}>
                    {plan.interval === "one-time" ? "One-time" : `per ${plan.interval}`}
                  </Text>
                </View>

                <View style={[
                  styles.radioButton,
                  selectedPlan?.id === plan.id && styles.radioButtonSelected
                ]}>
                  {selectedPlan?.id === plan.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Premium Features</Text>

          <View style={styles.featureItem}>
            <View style={[styles.checkCircle, { backgroundColor: "#BA5B80" }]}>
              <Check size={14} color="#fff" />
            </View>
            <Text style={styles.featureText}>Unlimited comparisons</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.checkCircle, { backgroundColor: "#DA7971" }]}>
              <Check size={14} color="#fff" />
            </View>
            <Text style={styles.featureText}>Celebrity comparisons</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.checkCircle, { backgroundColor: "#ED895E" }]}>
              <Check size={14} color="#fff" />
            </View>
            <Text style={styles.featureText}>AI beauty analysis and tips</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.checkCircle, { backgroundColor: "#fb8833" }]}>
              <Check size={14} color="#fff" />
            </View>
            <Text style={styles.featureText}>AI roast feature</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View style={animatedSubscribeButtonStyle}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubscribe}
            onPressIn={onSubscribePressIn}
            onPressOut={onSubscribePressOut}
          >

            <LinearGradient
                colors={['#913f8f', '#e5a0b9', '#f9943b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
            >
            <Text style={styles.subscribeButtonText}>Start 3-Day Free Trial</Text>
              </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.disclaimer}>
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
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepText: {
    fontSize: 14,
    color: colors.textLight,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
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
    backgroundColor: "rgba(255,255,255,0.05)",
    shadowColor: "#f9943b",
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    marginHorizontal: 4,
  },

  selectedPlanCard: {
    borderColor: "rgb(253,162,144)",
    shadowColor: "#ed6733",
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 70,
    transform: [{ scale: 1.05 }],
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  planHeader: {
    alignItems: "center",
    marginBottom: 12,
  },
  planName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.seventh,
    marginBottom: 2,
  },
  planInterval: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 8,
  },
  radioButtonSelected: {
    borderColor: "white",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  popularBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  popularText: {
    color: colors.background,
    fontSize: 8,
    fontWeight: "700",
    marginLeft: 2,
  },
  featuresContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  trialContainer: {
    marginBottom: 24,
  },
  trialBanner: {
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  trialTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.background,
    marginBottom: 8,
  },
  trialDescription: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.9,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribeButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  skipButtonText: {
    color: colors.textLight,
    fontSize: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 18,
  },
  button: {
    width: width - 34,
    borderRadius: 26,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.4,
    borderColor: colors.text,
  },
  buttonGradient: {
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  },
});