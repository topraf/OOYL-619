import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { Camera, Star, MessageCircle, BarChart3 } from "lucide-react-native";
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
        style={[styles.navItem, currentRoute === "celebrities" && styles.activeNavItem]}
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
          currentRoute === "celebrities" && styles.activeNavText
        ]}>
          Celebrities
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentRoute === "roast" && styles.activeNavItem]}
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
          currentRoute === "roast" && styles.activeNavText
        ]}>
          Roasted!
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, (currentRoute === "results" || currentRoute === "history") && styles.activeNavItem]}
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
          (currentRoute === "results" || currentRoute === "history") && styles.activeNavText
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
    backgroundColor: colors.primary + "15",
  },
  navText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    fontWeight: "500",
  },
  activeNavText: {
    color: colors.primary,
    fontWeight: "900",
  },
});