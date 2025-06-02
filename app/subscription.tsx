import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Check, Star } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { subscriptionPlans } from "@/mocks/subscriptions";
import { useUserStore } from "@/store/user-store";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState("yearly");
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
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>
            Unlock all features and enjoy unlimited comparisons
          </Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
            style={styles.image}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.imageGradient}
          >
            <Text style={styles.imageText}>Get the full experience</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Premium Features</Text>
          
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
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.primary} />
            <Text style={styles.featureText}>Save comparison history</Text>
          </View>
        </View>
        
        <View style={styles.plansContainer}>
          <Text style={styles.plansTitle}>Choose a Plan</Text>
          
          {subscriptionPlans.map(plan => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlanId === plan.id && styles.selectedPlanCard
              ]}
              onPress={() => setSelectedPlanId(plan.id)}
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
                  selectedPlanId === plan.id && styles.radioButtonSelected
                ]}>
                  {selectedPlanId === plan.id && (
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
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.planFeatureItem}>
                    <View style={styles.planFeatureBullet} />
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
  header: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 22,
  },
  imageContainer: {
    height: 180,
    marginHorizontal: 16,
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
  featuresContainer: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 16,
    borderRadius: 16,
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
  plansContainer: {
    padding: 16,
  },
  plansTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
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
  planFeatureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  planFeatureText: {
    fontSize: 14,
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
    color: colors.background,
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