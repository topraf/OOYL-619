/**
 * Paywall Modal - Premium subscription upgrade interface
 * 
 * This modal component handles the premium subscription flow:
 * - Displays subscription plans with pricing
 * - Shows premium features and benefits
 * - Handles plan selection and subscription process
 * - Integrates with user store for premium status updates
 * 
 * Key Features:
 * - Multiple subscription plan options (monthly, yearly, lifetime)
 * - Popular plan highlighting
 * - Radio button selection interface
 * - Free trial promotion
 * - Terms and privacy policy links
 * - Mock payment processing (sets premium status)
 * 
 * Design:
 * - Bottom sheet modal presentation
 * - Orange/pink gradient branding
 * - Clear pricing display
 * - Prominent call-to-action button
 * 
 * The modal is triggered from various parts of the app when users
 * attempt to access premium features without a subscription.
 * 
 * Mock Implementation:
 * - Simulates subscription purchase
 * - Immediately grants premium status
 * - No actual payment processing
 */

import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, Dimensions } from "react-native";
import { X, Star } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";
import { subscriptionPlans } from "@/mocks/subscriptions";
import { useUserStore } from "@/store/user-store";

const { width } = Dimensions.get("window");

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaywallModal({ visible, onClose, onSuccess }: PaywallModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState("monthly");
  const setPremiumStatus = useUserStore(state => state.setPremiumStatus);
  
  const handleSubscribe = () => {
    // In a real app, this would handle payment processing
    setPremiumStatus(true);
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Upgrade to Premium</Text>
          </View>
          
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.banner}
          >
            <Text style={styles.bannerText}>
              Unlock unlimited comparisons and premium features
            </Text>
          </LinearGradient>
          
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
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planInterval}>
                      {plan.interval === "one-time" ? "One-time" : `per ${plan.interval}`}
                    </Text>
                  </View>
                  
                  {plan.popular && (
                    <View style={styles.popularBadge}>
                      <Star size={12} color={colors.background} />
                      <Text style={styles.popularText}>POPULAR</Text>
                    </View>
                  )}
                  
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
          
          <View style={styles.footer}>
            <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
              <Text style={styles.subscribeText}>Start 3-Day Free Trial</Text>
            </TouchableOpacity>
            
            <Text style={styles.disclaimer}>
              Subscription will auto-renew. Cancel anytime in your App Store settings.
              By subscribing you agree to our Terms and Privacy Policy.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    left: 16,
    top: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  banner: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  bannerText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  plansContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  plansRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  planCard: {
    width: (width - 64) / 3.2,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
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
    color: colors.primary,
    marginBottom: 2,
  },
  planInterval: {
    fontSize: 12,
    color: colors.textLight,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 8,
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
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
  footer: {
    paddingHorizontal: 16,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
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