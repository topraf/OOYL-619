import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";
import { subscriptionPlans } from "@/mocks/subscriptions";
import SubscriptionCard from "./SubscriptionCard";
import { useUserStore } from "@/store/user-store";

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaywallModal({ visible, onClose, onSuccess }: PaywallModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState("weekly");
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
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.banner}
          >
            <Text style={styles.bannerText}>
              Unlock unlimited comparisons and premium features
            </Text>
          </LinearGradient>
          
          <ScrollView style={styles.plansContainer}>
            {subscriptionPlans.map(plan => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlanId === plan.id}
                onSelect={() => setSelectedPlanId(plan.id)}
              />
            ))}
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
              <Text style={styles.subscribeText}>Subscribe Now</Text>
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
    maxHeight: 400,
  },
  footer: {
    paddingHorizontal: 16,
    marginTop: 16,
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