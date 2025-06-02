import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Image } from "expo-image";
import { ComparisonResult } from "@/types";
import { colors } from "@/constants/colors";

interface ComparisonCardProps {
  result: ComparisonResult;
  compact?: boolean;
}

const { width } = Dimensions.get("window");
const cardWidth = width - 40;

export default function ComparisonCard({ result, compact = false }: ComparisonCardProps) {
  const formattedDate = new Date(result.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const getLeagueText = () => {
    switch (result.leagueStatus) {
      case "way_beyond":
        return "Way Beyond Your League";
      case "out_of_league":
        return "Out of Your League";
      case "slightly_above":
        return "Slightly Above Your League";
      case "in_your_league":
        return "In Your League";
      case "slightly_below":
        return "Slightly Below Your League";
      case "you_can_do_better":
        return "You Can Do Better";
      default:
        return "In Your League";
    }
  };

  const getStatusColor = () => {
    switch (result.leagueStatus) {
      case "way_beyond":
        return colors.gauge.red;
      case "out_of_league":
        return colors.gauge.orange;
      case "slightly_above":
        return colors.gauge.yellow;
      case "in_your_league":
        return colors.gauge.green;
      case "slightly_below":
        return colors.gauge.blue;
      case "you_can_do_better":
        return colors.gauge.purple;
      default:
        return colors.gauge.green;
    }
  };

  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <View style={styles.imagesContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: result.user.frontImage || "" }}
            style={styles.image}
            contentFit="cover"
          />
          <Text style={styles.imageLabel}>You</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getLeagueText()}
          </Text>
        </View>
        
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: result.target.image }}
            style={styles.image}
            contentFit="cover"
          />
          <Text style={styles.imageLabel}>
            {result.target.name || "Comparison"}
          </Text>
        </View>
      </View>
      
      {!compact && (
        <View style={styles.footer}>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  compactCard: {
    padding: 12,
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageWrapper: {
    alignItems: "center",
  },
  image: {
    width: cardWidth * 0.25,
    height: cardWidth * 0.25,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  imageLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  footer: {
    marginTop: 12,
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
  },
});