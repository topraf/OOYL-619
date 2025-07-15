/**
 * Bottom Navigation Component - Main navigation bar for the League Checker app
 * 
 * This component provides the primary navigation interface for users to move
 * between different sections of the app. It features:
 * 
 * - Five main navigation tabs (Scan, Celebrities, Results, Roast, Settings)
 * - Active state highlighting with color changes
 * - Smooth animations and haptic feedback
 * - Multilingual support with dynamic labels
 * - Premium feature indicators
 * - Responsive design that works across different screen sizes
 * 
 * The navigation integrates with the user store for language preferences
 * and premium status to show appropriate labels and access controls.
 * 
 * Navigation Routes:
 * - scan: Main homepage for starting comparisons
 * - celebrities: Celebrity comparison database
 * - results: Comparison results and history
 * - roast: AI roast generator
 * - settings: App settings and preferences
 * 
 * Design: Uses dark theme with orange/pink accent colors
 * Animations: Subtle scale animations on press
 * Accessibility: Proper labels and touch targets
 */

import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Platform } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Camera, Star, BarChart3, MessageCircle, Settings } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useUserStore } from "@/store/user-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

interface BottomNavigationProps {
  currentRoute: "scan" | "celebrities" | "results" | "roast" | "settings" | "history";
}

export default function BottomNavigation({ currentRoute }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { getColors, getTranslations } = useUserStore();
  const colors = getColors();
  const t = getTranslations();
  
  const buttonScale = useSharedValue(1);
  
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const handleNavigation = (route: string, routeName: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
    
    if (pathname !== route) {
      router.push(route as any);
    }
  };
  
  const tabs = [
    {
      id: "scan",
      route: "/",
      icon: Camera,
      label: t.components.bottom_nav.scan,
    },
    {
      id: "celebrities",
      route: "/celebrities",
      icon: Star,
      label: t.components.bottom_nav.celebrities,
    },
    {
      id: "results",
      route: "/results",
      icon: BarChart3,
      label: t.components.bottom_nav.results,
    },
    {
      id: "roast",
      route: "/roastmaster",
      icon: MessageCircle,
      label: t.components.bottom_nav.roast,
    },
    {
      id: "settings",
      route: "/settings",
      icon: Settings,
      label: t.components.bottom_nav.settings,
    },
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {tabs.map((tab) => {
        const isActive = currentRoute === tab.id;
        const IconComponent = tab.icon;
        
        return (
          <Animated.View key={tab.id} style={[animatedButtonStyle, { flex: 1 }]}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleNavigation(tab.route, tab.id)}
            >
              <IconComponent
                size={24}
                color={isActive ? colors.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? colors.primary : colors.textLight,
                    fontWeight: isActive ? "600" : "400",
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
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
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});