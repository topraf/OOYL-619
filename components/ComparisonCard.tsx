import React from "react";
import { StyleSheet, View, Text, Dimensions, Platform } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { ComparisonResult } from "@/types";
import { useUserStore } from "@/store/user-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

interface ComparisonCardProps {
  result: ComparisonResult;
  compact?: boolean;
  onPress?: () => void;
}

const { width } = Dimensions.get("window");
const cardWidth = width - 40;

export default function ComparisonCard({ result, compact = false, onPress }: ComparisonCardProps) {
  const { getColors } = useUserStore();
  const colors = getColors();
  
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
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

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    
    onPress?.();
  };

  return (
    <Animated.View 
      style={[
        styles.card, 
        { backgroundColor: colors.card },
        compact && styles.compactCard,
        animatedStyle
      ]}
      onTouchStart={() => {
        scale.value = withSpring(0.98);
      }}
      onTouchEnd={() => {
        scale.value = withSpring(1);
      }}
    >
      <View style={styles.imagesContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: result.user.frontImage || "" }}
            style={[styles.image, { backgroundColor: colors.border }]}
            contentFit="cover"
            cachePolicy="memory-disk"
            placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
            transition={200}
          />
          <Text style={[styles.imageLabel, { color: colors.text }]}>You</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getLeagueText()}
          </Text>
        </View>
        
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: result.target.image }}
            style={[styles.image, { backgroundColor: colors.border }]}
            contentFit="cover"
            cachePolicy="memory-disk"
            placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
            transition={200}
          />
          <Text style={[styles.imageLabel, { color: colors.text }]}>
            {result.target.name || "Comparison"}
          </Text>
        </View>
      </View>
      
      {!compact && (
        <View style={styles.footer}>
          <Text style={[styles.date, { color: colors.textLight }]}>{formattedDate}</Text>
          {result.isPremium && (
            <View style={[styles.premiumBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.premiumText, { color: colors.background }]}>Premium</Text>
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
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
  },
  imageLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    flex: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
  },
  premiumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: "600",
  },
});