import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";
import { LeagueStatus } from "@/types";

interface LeagueGaugeProps {
  leagueStatus: LeagueStatus;
}

export default function LeagueGauge({ leagueStatus }: LeagueGaugeProps) {
  const getIndicatorPosition = () => {
    switch (leagueStatus) {
      case "you_can_do_better":
        return "8%";
      case "slightly_below":
        return "25%";
      case "in_your_league":
        return "50%";
      case "slightly_above":
        return "75%";
      case "out_of_league":
        return "88%";
      case "way_beyond":
        return "95%";
      default:
        return "50%";
    }
  };

  const getLabelStyle = (status: LeagueStatus) => {
    if (status === leagueStatus) {
      return [styles.gaugeLabel, styles.activeLabelText];
    }
    return styles.gaugeLabel;
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.gaugeContainer}>
        <LinearGradient
            colors={[
              '#fda43c',
              '#70d6ff',
              '#ff4d95',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gauge}
        />

        <Text style={styles.triangle}>▲</Text>
        

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
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 16,
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
  indicator: {
    position: "absolute",
    top: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 3,
    borderColor: colors.text,
    marginLeft: -12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  gaugeLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    flex: 1,
  },
  activeLabelText: {
    color: colors.success,
    fontWeight: "800",
  },
  triangle: {
    marginTop: -5,
    color: '#3cb1ca',
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});