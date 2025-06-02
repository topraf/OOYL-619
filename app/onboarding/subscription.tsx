import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Check, ArrowRight, Star } from "lucide-react-native";
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
  const { completeOnboarding } = useOnboardingStore();
  const { setPremiumStatus } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans.find(p => p.id === "yearly"));
  
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
      <View style={styles.header}>
        <Text style={styles.stepText}>Step 4 of 4</Text>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Get the Full Experience</Text>
        
        <Text style={styles.subtitle}>
          Unlock all premium features and enjoy unlimited comparisons
        </Text>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
            style={styles.image}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.imageGradient}
          >
            <Text style={styles.imageText}>Premium Experience</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.plansContainer}>
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
                <View>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planInterval}>
                    {plan.interval === "one-time" ? "One-time payment" : `per ${plan.interval}`}
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
              </View>
              
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Star size={12} color={colors.background} />
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}
              
              <View style={styles.planFeatures}>
                {plan.features.slice(0, 3).map((feature, index) => (
                  <View key={index} style={styles.planFeatureItem}>
                    <Check size={14} color={colors.primary} />
                    <Text style={styles.planFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.trialContainer}>
          <LinearGradient
            colors={[colors.secondary, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.trialBanner}
          >
            <Text style={styles.trialTitle}>3-Day Free Trial</Text>
            <Text style={styles.trialDescription}>
              Try all premium features for free. Cancel anytime before the trial ends.
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Animated.View style={animatedSubscribeButtonStyle}>
          <TouchableOpacity 
            style={styles.subscribeButton}
            onPress={handleSubscribe}
            onPressIn={onSubscribePressIn}
            onPressOut={onSubscribePressOut}
          >
            <Text style={styles.subscribeButtonText}>Start Free Trial</Text>
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
            <Text style={styles.skipButtonText}>Maybe Later</Text>
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
  imageContainer: {
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    padding: 16,
  },
  imageText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.background,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  selectedPlanCard: {
    borderColor: colors.primary,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 2,
  },
  planInterval: {
    fontSize: 14,
    color: colors.textLight,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  popularBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  popularText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 4,
  },
  planFeatures: {
    marginTop: 8,
  },
  planFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  planFeatureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
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
    color: colors.background,
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
});