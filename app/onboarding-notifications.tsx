import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, ArrowRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { colors } from "@/constants/colors";
import { useOnboardingStore } from "@/store/onboarding-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function OnboardingNotificationsScreen() {
  const router = useRouter();
  const { setCurrentStep, skipNotifications } = useOnboardingStore();
  
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
  
  const handleEnableNotifications = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // In a real app, we would request notification permissions here
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>Step 3 of 4</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Bell size={48} color={colors.primary} />
        </View>
        
        <Text style={styles.title}>
          Stay{" "}
          <Text style={styles.titleAccent}>Updated</Text>
        </Text>
        
        <Text style={styles.description}>
          Allow notifications to get our latest updates, feature drops, and special offers
        </Text>
        
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.benefitText}>Get notified about new features</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.benefitText}>Receive special offers and discounts</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.benefitText}>Be reminded to check your comparisons</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Animated.View style={animatedEnableButtonStyle}>
          <TouchableOpacity 
            style={styles.enableButton}
            onPress={handleEnableNotifications}
            onPressIn={onEnablePressIn}
            onPressOut={onEnablePressOut}
          >
            <Text style={styles.enableButtonText}>Enable Notifications</Text>
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
            <Text style={styles.skipButtonText}>Maybe Later</Text>
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
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepText: {
    fontSize: 14,
    color: colors.textLight,
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
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 36,
  },
  titleAccent: {
    color: colors.primary,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
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
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    color: colors.text,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  enableButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  enableButtonText: {
    color: colors.background,
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
    color: colors.textLight,
    fontSize: 16,
  },
});