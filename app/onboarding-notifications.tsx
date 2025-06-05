import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, ArrowRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useUserStore } from "@/store/user-store";
import { useOnboardingStore } from "@/store/onboarding-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function OnboardingNotificationsScreen() {
  const router = useRouter();
  const { getColors } = useUserStore();
  const { setCurrentStep, enableNotifications, skipNotifications, hasCompletedOnboarding } = useOnboardingStore();
  const colors = getColors();
  
  const enableButtonScale = useSharedValue(1);
  const skipButtonScale = useSharedValue(1);
  
  const animatedEnableButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: enableButtonScale.value }]
    };
  });
  
  const animatedSkipButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: skipButtonScale.value }]
    };
  });
  
  // Redirect if onboarding is already completed
  React.useEffect(() => {
    if (hasCompletedOnboarding) {
      router.replace("/");
    }
  }, [hasCompletedOnboarding]);
  
  const handleEnableNotifications = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // In a real app, we would request notification permissions here
    enableNotifications();
    setCurrentStep(4);
    router.push("/onboarding-subscription");
  };
  
  const handleSkip = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    skipNotifications();
    setCurrentStep(4);
    router.push("/onboarding-subscription");
  };

  const onEnablePressIn = () => {
    enableButtonScale.value = withSpring(0.95);
  };

  const onEnablePressOut = () => {
    enableButtonScale.value = withSpring(1);
  };
  
  const onSkipPressIn = () => {
    skipButtonScale.value = withSpring(0.95);
  };

  const onSkipPressOut = () => {
    skipButtonScale.value = withSpring(1);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
          <Bell size={48} color={colors.primary} />
        </View>
        
        <Text style={[styles.title, { color: colors.text }]}>
          Stay{" "}
          <Text style={[styles.titleAccent, { color: colors.primary }]}>Updated</Text>
        </Text>
        
        <Text style={[styles.description, { color: colors.textLight }]}>
          Allow notifications to get our latest updates, feature drops, and special offers
        </Text>
        
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
            <Text style={[styles.benefitText, { color: colors.text }]}>Get notified about new features</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
            <Text style={[styles.benefitText, { color: colors.text }]}>Receive special offers and discounts</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
            <Text style={[styles.benefitText, { color: colors.text }]}>Be reminded to check your comparisons</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Animated.View style={animatedEnableButtonStyle}>
          <TouchableOpacity 
            style={[styles.enableButton, { backgroundColor: colors.primary }]}
            onPress={handleEnableNotifications}
            onPressIn={onEnablePressIn}
            onPressOut={onEnablePressOut}
          >
            <Text style={[styles.enableButtonText, { color: colors.background }]}>Enable Notifications</Text>
            <ArrowRight size={20} color={colors.background} />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={animatedSkipButtonStyle}>
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
            onPressIn={onSkipPressIn}
            onPressOut={onSkipPressOut}
          >
            <Text style={[styles.skipButtonText, { color: colors.textLight }]}>Maybe Later</Text>
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
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 36,
  },
  titleAccent: {
    // Color applied dynamically
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    maxWidth: "80%",
  },
  benefitsContainer: {
    alignSelf: "stretch",
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
  },
  footer: {
    padding: 24,
  },
  enableButton: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  enableButtonText: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  skipButtonText: {
    fontSize: 16,
  },
});