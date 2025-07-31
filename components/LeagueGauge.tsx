import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";
import { LeagueStatus } from "@/types";

interface LeagueGaugeProps {
  leagueStatus: LeagueStatus;
}

// Fonction qui renvoie la position du triangle
export const getIndicatorPosition = (status: LeagueStatus) => {
  switch (status) {
    case "you_can_do_better":
      return "8%";
    case "slightly_below":
      return "25%";
    case "in_your_league":
      return "50%";
    case "slightly_above":
      return "75%";
    case "out_of_league":
      return "92%";
    case "way_beyond":
      return "95%";
    default:
      return "50%";
  }
};

// Fonction qui renvoie la couleur en fonction du status
const getBaseColor = (status: LeagueStatus) => {
  switch (status) {
    case "you_can_do_better":
      return "#fda43c"; // Orange
    case "in_your_league":
      return "#70d6ff"; // Bleu
    case "out_of_league":
      return "#ff4d95"; // Rose
    default:
      return colors.textLight; // Couleur neutre pour les autres
  }
};

export default function LeagueGauge({ leagueStatus }: LeagueGaugeProps) {
  const indicatorLeft = getIndicatorPosition(leagueStatus);

  const getLabelStyle = (status: LeagueStatus) => {
    return [
      styles.gaugeLabel,
      { color: getBaseColor(status) },
      status === leagueStatus && styles.activeLabelText,
    ];
  };

  return (
      <View style={styles.container}>
        <View style={styles.gaugeContainer}>
          {/* Barre colorée */}
          <LinearGradient
              colors={["#fda43c", "#70d6ff", "#ff4d95"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gauge}
          />

          {/* Triangle indicateur */}
          <Text
              style={[
                styles.triangle,
                { left: indicatorLeft, color: getBaseColor(leagueStatus) },
              ]}
          >
            ▲
          </Text>
        </View>

        <View style={styles.labelsContainer}>
          <Text style={getLabelStyle("you_can_do_better")}>You can do better</Text>
          <Text style={getLabelStyle("in_your_league")}>In your league</Text>
          <Text style={getLabelStyle("out_of_league")}>Out of your league</Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  gaugeContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 12,
  },
  gauge: {
    height: 16,
    borderRadius: 8,
  },
  triangle: {
    position: "absolute",
    top: 8,
    fontSize: 16,
    textAlign: "center",
    alignSelf: "center",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  gaugeLabel: {
    fontSize: 12,
    textAlign: "center",
    flex: 1,
  },
  activeLabelText: {
    fontWeight: "800",
  },
});