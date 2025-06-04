import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { Camera, Star, MessageCircle, BarChart3 } from "lucide-react-native";
import { darkColors } from "@/constants/colors";

interface BottomNavigationProps {
  currentRoute: string;
}

export default function BottomNavigation({ currentRoute }: BottomNavigationProps) {
  const router = useRouter();
  const colors = darkColors;

  const handleNavigation = (route: string, path: string) => {
    if (route === currentRoute) return; // Don't navigate if already on this route
    router.push(path);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <TouchableOpacity 
        style={[styles.navItem, currentRoute === "scan" && [styles.activeNavItem, { backgroundColor: colors.primary + "15" }]]}
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
          { color: colors.textLight },
          currentRoute === "scan" && [styles.activeNavText, { color: colors.primary }]
        ]}>
          Scan
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentRoute === "celebrities" && [styles.activeNavItem, { backgroundColor: colors.primary + "15" }]]}
        onPress={() => handleNavigation("celebrities", "/celebrities")}
        disabled={currentRoute === "celebrities"}
      >
        <Star 
          size={24} 
          color={currentRoute === "celebrities" ? colors.primary : colors.textLight} 
          strokeWidth={currentRoute === "celebrities" ? 3 : 2}
        />
        <Text style={[
          styles.navText, 
          { color: colors.textLight },
          currentRoute === "celebrities" && [styles.activeNavText, { color: colors.primary }]
        ]}>
          Celebrities
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentRoute === "roast" && [styles.activeNavItem, { backgroundColor: colors.primary + "15" }]]}
        onPress={() => handleNavigation("roast", "/roastmaster")}
        disabled={currentRoute === "roast"}
      >
        <MessageCircle 
          size={24} 
          color={currentRoute === "roast" ? colors.primary : colors.textLight} 
          strokeWidth={currentRoute === "roast" ? 3 : 2}
        />
        <Text style={[
          styles.navText, 
          { color: colors.textLight },
          currentRoute === "roast" && [styles.activeNavText, { color: colors.primary }]
        ]}>
          Roasted!
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, (currentRoute === "results" || currentRoute === "history") && [styles.activeNavItem, { backgroundColor: colors.primary + "15" }]]}
        onPress={() => handleNavigation("results", "/results")}
        disabled={currentRoute === "results" || currentRoute === "history"}
      >
        <BarChart3 
          size={24} 
          color={(currentRoute === "results" || currentRoute === "history") ? colors.primary : colors.textLight} 
          strokeWidth={(currentRoute === "results" || currentRoute === "history") ? 3 : 2}
        />
        <Text style={[
          styles.navText, 
          { color: colors.textLight },
          (currentRoute === "results" || currentRoute === "history") && [styles.activeNavText, { color: colors.primary }]
        ]}>
          Results
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    shadowColor: "rgba(0, 0, 0, 0.3)",
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
    // Background color applied dynamically
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  activeNavText: {
    fontWeight: "900",
  },
});