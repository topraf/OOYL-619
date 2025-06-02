import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LeagueStatus } from "@/types";
import { colors } from "@/constants/colors";

interface LeagueGaugeProps {
  leagueStatus: LeagueStatus;
}

const { width } = Dimensions.get("window");
const gaugeWidth = width - 48;

export default function LeagueGauge({ leagueStatus }: LeagueGaugeProps) {
  const getGaugePosition = () => {
    switch (leagueStatus) {
      case "way_beyond":
        return { position: "90%", color: colors.gauge.red };
      case "out_of_league":
        return { position: "75%", color: colors.gauge.orange };
      case "slightly_above":
        return { position: "60%", color: colors.gauge.yellow };
      case "in_your_league":
        return { position: "50%", color: colors.gauge.green };
      case "slightly_below":
        return { position: "35%", color: colors.gauge.blue };
      case "you_can_do_better":
        return { position: "15%", color: colors.gauge.purple };
      default:
        return { position: "50%", color: colors.gauge.green };
    }
  };

  const getLeagueText = () => {
    switch (leagueStatus) {
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

  const { position, color } = getGaugePosition();
  const leagueText = getLeagueText();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>League Status</Text>
      
      <View style={styles.gaugeContainer}>
        <LinearGradient
          colors={[
            colors.gauge.purple,
            colors.gauge.blue,
            colors.gauge.green,
            colors.gauge.yellow,
            colors.gauge.orange,
            colors.gauge.red,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gaugeBackground}
        />
        
        <View 
          style={[
            styles.indicator, 
            { left: position, backgroundColor: color }
          ]}
        />
      </View>
      
      <View style={styles.labelsContainer}>
        <Text style={styles.label}>You Can Do Better</Text>
        <Text style={styles.label}>In Your League</Text>
        <Text style={styles.label}>Way Beyond</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: gaugeWidth,
    alignSelf: "center",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  gaugeContainer: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    position: "relative",
  },
  gaugeBackground: {
    height: "100%",
    width: "100%",
  },
  indicator: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    top: -4,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: colors.background,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  label: {
    fontSize: 10,
    color: colors.textLight,
  },
});