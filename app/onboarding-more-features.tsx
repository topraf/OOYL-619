import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Star, MessageCircle, ArrowRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useUserStore } from "@/store/user-store";
import { useOnboardingStore } from "@/store/onboarding-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function OnboardingMoreFeaturesScreen() {
  const router = useRouter();
  const { getColors } = useUserStore();
  const { setCurrentStep } = useOnboardingStore();
  const colors = getColors();
  
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
      >
        <Animated.View style={animatedTitleStyle}>
          <Text style={[styles.title, { color: colors.text }]}>
            Try our{" "}
            <Text style={[styles.titleAccent, { color: colors.primary }]}>special features</Text>
          </Text>
        </Animated.View>
        
        <View style={styles.featuresContainer}>
          <View style={[styles.featureCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + "20" }]}>
              <Star size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Celebrity Comparison</Text>
              <Text style={[styles.featureDescription, { color: colors.textLight }]}>
                Compare your beauty score with famous celebrities and see if you're in their league
              </Text>
              <View style={styles.celebrityImages}>
                <View style={styles.celebrityImageContainer}>
                  <Image
                    source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
                    style={[styles.celebrityImage, { backgroundColor: colors.border }]}
                  />
                  <Text style={[styles.celebrityName, { color: colors.text }]}>Ryan Gosling</Text>
                </View>
                <View style={styles.celebrityImageContainer}>
                  <Image
                    source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
                    style={[styles.celebrityImage, { backgroundColor: colors.border }]}
                  />
                  <Text style={[styles.celebrityName, { color: colors.text }]}>Emma Stone</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={[styles.featureCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: colors.primary + "20" }]}>
              <MessageCircle size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>AI Roastmaster</Text>
              <Text style={[styles.featureDescription, { color: colors.textLight }]}>
                Get roasted by our AI based on your photos for some laughs and fun
              </Text>
              <View style={[styles.roastBubble, { backgroundColor: colors.primary + "20" }]}>
                <Text style={[styles.roastText, { color: colors.text }]}>
                  "Your selfie game is so weak, even your phone's front camera is trying to auto-delete."
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={[styles.infoContainer, { backgroundColor: colors.primary + "10" }]}>
          <Text style={[styles.infoText, { color: colors.text }]}>
            With our AI-powered analysis, you'll get personalized results and insights about your appearance
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.shadow }]}
            onPress={handleContinue}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>Continue</Text>
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 36,
  },
  titleAccent: {
    // Color applied dynamically
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
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
    marginBottom: 4,
  },
  celebrityName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  roastBubble: {
    borderRadius: 12,
    padding: 12,
    borderTopLeftRadius: 0,
  },
  roastText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  infoContainer: {
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  footer: {
    padding: 24,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
});