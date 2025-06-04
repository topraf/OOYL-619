import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Check, Star } from "lucide-react-native";
import { darkColors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const subscriptionPlans = [
  {
    id: "weekly",
    name: "Weekly",
    price: "€3.99",
    interval: "week",
    popular: false,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "€9.00",
    interval: "month",
    popular: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "€29.00",
    interval: "one-time",
    popular: false,
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState("monthly");
  const setPremiumStatus = useUserStore(state => state.setPremiumStatus);
  const colors = darkColors;
  
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const handleSubscribe = () => {
    // In a real app, this would handle payment processing
    setPremiumStatus(true);
    router.back();
  };
  
  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Upgrade to{" "}
            <Text style={[styles.titleAccent, { color: colors.primary }]}>Premium</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            Unlock all features and enjoy unlimited comparisons
          </Text>
        </View>
        
        <View style={styles.plansContainer}>
          <View style={styles.plansRow}>
            {subscriptionPlans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  { backgroundColor: colors.card },
                  selectedPlanId === plan.id && { borderColor: colors.primary }
                ]}
                onPress={() => setSelectedPlanId(plan.id)}
              >
                {plan.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                    <Star size={10} color={colors.text} />
                    <Text style={[styles.popularText, { color: colors.text }]}>POPULAR</Text>
                  </View>
                )}
                
                <View style={styles.planHeader}>
                  <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
                  <Text style={[styles.planPrice, { color: colors.primary }]}>{plan.price}</Text>
                  <Text style={[styles.planInterval, { color: colors.textLight }]}>
                    {plan.interval === "one-time" ? "" : `per ${plan.interval}`}
                  </Text>
                </View>
                
                <View style={[
                  styles.radioButton,
                  { borderColor: selectedPlanId === plan.id ? colors.primary : colors.border }
                ]}>
                  {selectedPlanId === plan.id && (
                    <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={[styles.featuresContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>
            Premium{" "}
            <Text style={[styles.featuresTitleAccent, { color: colors.primary }]}>Features</Text>
          </Text>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.primary} />
            <Text style={[styles.featureText, { color: colors.text }]}>Unlimited comparisons</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.primary} />
            <Text style={[styles.featureText, { color: colors.text }]}>Celebrity comparisons</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.primary} />
            <Text style={[styles.featureText, { color: colors.text }]}>AI beauty analysis and tips</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.primary} />
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
      
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity 
            style={[styles.subscribeButton, { backgroundColor: colors.primary }]} 
            onPress={handleSubscribe}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Text style={[styles.subscribeText, { color: colors.text }]}>Start 3-Day Free Trial</Text>
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
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  titleAccent: {
    // Color applied dynamically
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  plansContainer: {
    padding: 16,
    marginBottom: 24,
  },
  plansRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  planCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
    minHeight: 100,
  },
  planHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  planName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  planInterval: {
    fontSize: 10,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 4,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  popularBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  popularText: {
    fontSize: 8,
    fontWeight: "700",
    marginLeft: 2,
  },
  featuresContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },
  featuresTitleAccent: {
    // Color applied dynamically
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
  },
  trialContainer: {
    marginHorizontal: 16,
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
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  trialDescription: {
    fontSize: 14,
    opacity: 0.9,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  subscribeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});