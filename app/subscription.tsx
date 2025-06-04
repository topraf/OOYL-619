import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Check, Star } from "lucide-react-native";
import { colors } from "@/constants/colors";
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
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Upgrade to{" "}
            <Text style={styles.titleAccent}>Premium</Text>
          </Text>
          <Text style={styles.subtitle}>
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
                  selectedPlanId === plan.id && styles.selectedPlanCard
                ]}
                onPress={() => setSelectedPlanId(plan.id)}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Star size={10} color={colors.text} />
                    <Text style={styles.popularText}>POPULAR</Text>
                  </View>
                )}
                
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planInterval}>
                    {plan.interval === "one-time" ? "" : `per ${plan.interval}`}
                  </Text>
                </View>
                
                <View style={[
                  styles.radioButton,
                  selectedPlanId === plan.id && styles.radioButtonSelected
                ]}>
                  {selectedPlanId === plan.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>
            Premium{" "}
            <Text style={styles.featuresTitleAccent}>Features</Text>
          </Text>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.primary} />
            <Text style={styles.featureText}>Unlimited comparisons</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.primary} />
            <Text style={styles.featureText}>Celebrity comparisons</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.primary} />
            <Text style={styles.featureText}>AI beauty analysis and tips</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.primary} />
            <Text style={styles.featureText}>AI roast feature</Text>
          </View>
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
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity 
            style={styles.subscribeButton} 
            onPress={handleSubscribe}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Text style={styles.subscribeText}>Start 3-Day Free Trial</Text>
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
    color: colors.text,
    marginBottom: 8,
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
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
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
    minHeight: 100,
  },
  selectedPlanCard: {
    borderColor: colors.primary,
  },
  planHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  planName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 2,
  },
  planInterval: {
    fontSize: 10,
    color: colors.textLight,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 4,
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  popularBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  popularText: {
    color: colors.text,
    fontSize: 8,
    fontWeight: "700",
    marginLeft: 2,
  },
  featuresContainer: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
  },
  featuresTitleAccent: {
    color: colors.primary,
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
    marginHorizontal: 16,
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
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },
  trialDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.9,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribeText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 18,
  },
});