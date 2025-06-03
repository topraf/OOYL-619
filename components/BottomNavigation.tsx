import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Camera, Star, MessageCircle, BarChart } from "lucide-react-native";
import { colors } from "@/constants/colors";

interface BottomNavigationProps {
  currentRoute: "scan" | "celebrities" | "roast" | "results";
}

const { width } = Dimensions.get("window");

export default function BottomNavigation({ currentRoute }: BottomNavigationProps) {
  const router = useRouter();

  const getIconColor = (route: string) => {
    return currentRoute === route ? colors.primary : colors.textLight;
  };

  const getTextStyle = (route: string) => {
    return [
      styles.tabText,
      currentRoute === route && styles.activeTabText
    ];
  };

  const handleNavigation = (route: string, path: string) => {
    if (currentRoute !== route) {
      router.push(path);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => handleNavigation("scan", "/")}
        disabled={currentRoute === "scan"}
      >
        <Camera size={24} color={getIconColor("scan")} />
        <Text style={getTextStyle("scan")}>Scan</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => handleNavigation("celebrities", "/celebrities")}
        disabled={currentRoute === "celebrities"}
      >
        <Star size={24} color={getIconColor("celebrities")} />
        <Text style={getTextStyle("celebrities")}>Celebrities</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => handleNavigation("roast", "/roastmaster")}
        disabled={currentRoute === "roast"}
      >
        <MessageCircle size={24} color={getIconColor("roast")} />
        <Text style={getTextStyle("roast")}>Roast</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => handleNavigation("results", "/results")}
        disabled={currentRoute === "results"}
      >
        <BarChart size={24} color={getIconColor("results")} />
        <Text style={getTextStyle("results")}>Results</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: colors.background,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8,
  },
  tabText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: "600",
  },
});