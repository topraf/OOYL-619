import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, Dimensions } from "react-native";
import { X, Star } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { darkColors } from "@/constants/colors";
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
  const colors = darkColors;
  
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
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Upgrade to Premium</Text>
          </View>
          
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.banner}
          >
            <Text style={[styles.bannerText, { color: colors.text }]}>
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
                    { backgroundColor: colors.card },
                    selectedPlanId === plan.id && { borderColor: colors.primary }
                  ]}
                  onPress={() => setSelectedPlanId(plan.id)}
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
                      <Star size={12} color={colors.text} />
                      <Text style={[styles.popularText, { color: colors.text }]}>POPULAR</Text>
                    </View>
                  )}
                  
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
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.subscribeButton, { backgroundColor: colors.primary }]} 
              onPress={handleSubscribe}
            >
              <Text style={[styles.subscribeText, { color: colors.text }]}>Start 3-Day Free Trial</Text>
            </TouchableOpacity>
            
            <Text style={[styles.disclaimer, { color: colors.textLight }]}>
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
  },
  banner: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  bannerText: {
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
    fontWeight: "600",
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: "700",
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
  footer: {
    paddingHorizontal: 16,
  },
  subscribeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
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