import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import { useUserStore } from "@/store/user-store";
import BottomNavigation from "@/components/BottomNavigation";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");

/**
 * Celebrity Options Screen
 * 
 * This screen presents three main celebrity comparison options:
 * 1. Compare yourself with celebrities
 * 2. Compare between celebrities
 * 3. Find your celebrity lookalike
 * 
 * Each option is presented as a card with a background image and descriptive text.
 * When an option is selected, the user is navigated to the corresponding screen.
 */
export default function CelebritiesScreen() {
  const router = useRouter();
  const { getColors } = useUserStore();
  const colors = getColors();
  
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });

  const handleOptionPress = (route: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(route);
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.97);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.card }]} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            Celebrity{" "}
            <Text style={[styles.titleAccent, { color: colors.primary }]}>Comparisons</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            Choose how you want to compare with celebrities
          </Text>
        </View>
      </View>
      
      <View style={styles.optionsContainer}>
        <Animated.View style={[animatedButtonStyle, styles.optionWrapper]}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleOptionPress("/celebrity-compare-self")}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <ImageBackground
              source={{ uri: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?q=80&w=1769&auto=format&fit=crop" }}
              style={styles.optionBackground}
              imageStyle={styles.optionBackgroundImage}
            >
              <View style={[styles.optionOverlay, { backgroundColor: `${colors.shadow}99` }]}>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: colors.background }]}>
                    Compare Yourself
                  </Text>
                  <Text style={[styles.optionSubtitle, { color: colors.background }]}>
                    Find out if a celebrity is in your league
                  </Text>
                </View>
                <ChevronRight size={24} color={colors.background} />
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[animatedButtonStyle, styles.optionWrapper]}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleOptionPress("/celebrity-compare-between")}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <ImageBackground
              source={{ uri: "https://images.unsplash.com/photo-1522869635100-187f6605241d?q=80&w=1770&auto=format&fit=crop" }}
              style={styles.optionBackground}
              imageStyle={styles.optionBackgroundImage}
            >
              <View style={[styles.optionOverlay, { backgroundColor: `${colors.shadow}99` }]}>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: colors.background }]}>
                    Compare Between Celebrities
                  </Text>
                  <Text style={[styles.optionSubtitle, { color: colors.background }]}>
                    See how celebrities match up against each other
                  </Text>
                </View>
                <ChevronRight size={24} color={colors.background} />
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[animatedButtonStyle, styles.optionWrapper]}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleOptionPress("/celebrity-lookalike")}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <ImageBackground
              source={{ uri: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1770&auto=format&fit=crop" }}
              style={styles.optionBackground}
              imageStyle={styles.optionBackgroundImage}
            >
              <View style={[styles.optionOverlay, { backgroundColor: `${colors.shadow}99` }]}>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: colors.background }]}>
                    Find Your Celebrity Lookalike
                  </Text>
                  <Text style={[styles.optionSubtitle, { color: colors.background }]}>
                    Discover which celebrities you resemble the most
                  </Text>
                </View>
                <ChevronRight size={24} color={colors.background} />
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      <BottomNavigation currentRoute="celebrities" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  titleAccent: {
    // Color applied dynamically
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  optionsContainer: {
    flex: 1,
    padding: 16,
  },
  optionWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: (width - 32) * 0.4,
  },
  optionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  optionBackgroundImage: {
    borderRadius: 16,
  },
  optionOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    opacity: 0.9,
  },
});