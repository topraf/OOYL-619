import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Check } from "lucide-react-native";
import { SubscriptionPlan } from "@/types";
import { colors } from "@/constants/colors";

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: () => void;
}

export default function SubscriptionCard({ plan, isSelected, onSelect }: SubscriptionCardProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
      onPress={onSelect}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{plan.price}</Text>
          <Text style={styles.interval}>/{plan.interval}</Text>
        </View>
      </View>
      
      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Check size={16} color={colors.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      
      <View style={[styles.selectButton, isSelected && styles.selectedButton]}>
        <Text style={[styles.selectText, isSelected && styles.selectedText]}>
          {isSelected ? "Selected" : "Select"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedContainer: {
    borderColor: colors.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  interval: {
    fontSize: 14,
    color: colors.textLight,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  selectButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  selectText: {
    color: colors.text,
    fontWeight: "600",
  },
  selectedText: {
    color: colors.background,
  },
});