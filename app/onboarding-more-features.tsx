import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Star, MessageCircle, ArrowRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { colors } from "@/constants/colors";
import { useOnboardingStore } from "@/store/onboarding-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function OnboardingMoreFeaturesScreen() {
  const router = useRouter();
  const { setCurrentStep } = useOnboardingStore();
  
  const buttonScale = useSharedValue(1);
  const titleScale = useSharedValue(1);
  
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const animatedTitleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: titleScale.value }]
    };
  });
  
  React.useEffect(() => {
    titleScale.value = withRepeat(
      withTiming(1.05, { duration: 2000 }),
      -1,
      true
    );
  }, []);
  
  const handleContinue = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setCurrentStep(3);
    router.push("/onboarding-notifications");
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Animated.View style={animatedTitleStyle}>
          <Text style={styles.title}>
            Try our{" "}
            <Text style={styles.titleAccent}>special features</Text>
          </Text>
        </Animated.View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Star size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Celebrity Comparison</Text>
              <Text style={styles.featureDescription}>
                Compare your beauty score with famous celebrities and see if you're in their league
              </Text>
              <View style={styles.celebrityImages}>
                <View style={styles.celebrityImageContainer}>
                  <Image
                    source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
                    style={styles.celebrityImage}
                  />
                  <Text style={styles.celebrityName}>Ryan Gosling</Text>
                </View>
                <View style={styles.celebrityImageContainer}>
                  <Image
                    source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
                    style={styles.celebrityImage}
                  />
                  <Text style={styles.celebrityName}>Emma Stone</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <MessageCircle size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>AI Roastmaster</Text>
              <Text style={styles.featureDescription}>
                Get roasted by our AI based on your photos for some laughs and fun
              </Text>
              <View style={styles.roastBubble}>
                <Text style={styles.roastText}>
                  "Your selfie game is so weak, even your phone's front camera is trying to auto-delete."
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            With our AI-powered analysis, you'll get personalized results and insights about your appearance
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleContinue}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <ArrowRight size={20} color={colors.background} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 36,
  },
  titleAccent: {
    color: colors.primary,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  celebrityImages: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  celebrityImageContainer: {
    alignItems: "center",
    width: "48%",
  },
  celebrityImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.border,
    marginBottom: 4,
  },
  celebrityName: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "600",
    textAlign: "center",
  },
  roastBubble: {
    backgroundColor: colors.primary + "20",
    borderRadius: 12,
    padding: 12,
    borderTopLeftRadius: 0,
  },
  roastText: {
    fontSize: 14,
    color: colors.text,
    fontStyle: "italic",
  },
  infoContainer: {
    backgroundColor: colors.primary + "10",
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    textAlign: "center",
  },
  footer: {
    padding: 24,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
});