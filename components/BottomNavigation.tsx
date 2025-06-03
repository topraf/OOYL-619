import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { Camera, BarChart3, Settings, History } from "lucide-react-native";
import { colors } from "@/constants/colors";

interface BottomNavigationProps {
  currentRoute: string;
}

export default function BottomNavigation({ currentRoute }: BottomNavigationProps) {
  const router = useRouter();

  const handleNavigation = (route: string, path: string) => {
    if (route === currentRoute) return; // Don't navigate if already on this route
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.navItem, currentRoute === "scan" && styles.activeNavItem]}
        onPress={() => handleNavigation("scan", "/")}
        disabled={currentRoute === "scan"}
      >
        <Camera 
          size={24} 
          color={currentRoute === "scan" ? colors.primary : colors.textLight} 
          strokeWidth={currentRoute === "scan" ? 3 : 2}
        />
        <Text style={[
          styles.navText, 
          currentRoute === "scan" && styles.activeNavText
        ]}>
          Scan
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentRoute === "results" && styles.activeNavItem]}
        onPress={() => handleNavigation("results", "/results")}
        disabled={currentRoute === "results"}
      >
        <BarChart3 
          size={24} 
          color={currentRoute === "results" ? colors.primary : colors.textLight} 
          strokeWidth={currentRoute === "results" ? 3 : 2}
        />
        <Text style={[
          styles.navText, 
          currentRoute === "results" && styles.activeNavText
        ]}>
          Results
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentRoute === "history" && styles.activeNavItem]}
        onPress={() => handleNavigation("history", "/history")}
        disabled={currentRoute === "history"}
      >
        <History 
          size={24} 
          color={currentRoute === "history" ? colors.primary : colors.textLight} 
          strokeWidth={currentRoute === "history" ? 3 : 2}
        />
        <Text style={[
          styles.navText, 
          currentRoute === "history" && styles.activeNavText
        ]}>
          History
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentRoute === "settings" && styles.activeNavItem]}
        onPress={() => handleNavigation("settings", "/settings")}
        disabled={currentRoute === "settings"}
      >
        <Settings 
          size={24} 
          color={currentRoute === "settings" ? colors.primary : colors.textLight} 
          strokeWidth={currentRoute === "settings" ? 3 : 2}
        />
        <Text style={[
          styles.navText, 
          currentRoute === "settings" && styles.activeNavText
        ]}>
          Settings
        </Text>
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
    flexDirection: "row",
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeNavItem: {
    backgroundColor: colors.primary + "10",
  },
  navText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    fontWeight: "500",
  },
  activeNavText: {
    color: colors.primary,
    fontWeight: "800",
  },
});