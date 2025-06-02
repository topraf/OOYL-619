import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";

interface FeatureScoreCardProps {
  name: string;
  score: number;
  status: "Low" | "Mid" | "High";
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export default function FeatureScoreCard({ name, score, status }: FeatureScoreCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "Low":
        return colors.gauge.red;
      case "Mid":
        return colors.gauge.yellow;
      case "High":
        return colors.gauge.green;
      default:
        return colors.gauge.green;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.score}>{score}</Text>
      
      <View style={styles.statusContainer}>
        <View style={styles.statusBar}>
          <LinearGradient
            colors={[colors.gauge.red, colors.gauge.yellow, colors.gauge.green]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statusGradient}
          />
        </View>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  score: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginRight: 8,
  },
  statusGradient: {
    height: "100%",
    width: "100%",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});