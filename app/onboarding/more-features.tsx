import React from "react";
import { StyleSheet, View, Text, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Star, MessageCircle} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { colors } from "@/constants/colors";
import { useOnboardingStore } from "@/store/onboarding-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";

//const { width } = Dimensions.get("window");

export default function OnboardingMoreFeaturesScreen() {
  const router = useRouter();
  const { setCurrentStep } = useOnboardingStore();

  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });

  const handleContinue = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setCurrentStep(3);
    router.push("/onboarding/notifications");
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const handleSubscription = () => {
    router.push("/onboarding/subscription");
  };

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.stepText}>Step 3 of 4</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Try our special features</Text>
          <View style={styles.featuresContainer}>

            <View style={styles.featureCard}>
              <View style={styles.cardGlowWrapper}>
                <LinearGradient
                    colors={['transparent', '#6e162c']}
                    start={{ x: 0.5, y: 0.5 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.cardGlow}
                />
              </View>


              <View style={styles.featureIconContainer}>
                <Star size={24} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Celebrity Comparison</Text>
                <Text style={styles.featureDescription}>
                  Compare your beauty score with famous celebrities and see if you're in their league
                </Text>
                <TouchableOpacity onPress={handleSubscription}>
                  <Text style={styles.buttonPro}>Unlock PRO ▷ </Text>
                </TouchableOpacity>
              </View>
            </View>


            <View style={styles.featureCard}>
              <View style={styles.cardGlowWrapper}>
                <LinearGradient
                    colors={['transparent', '#6e162c']}
                    start={{ x: 0.5, y: 0.5 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.cardGlow}
                />
              </View>

              <View style={styles.featureIconContainer}>
                <MessageCircle size={24} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>AI Roastmaster</Text>
                <Text style={styles.featureDescription}>
                  Get roasted by our AI based on your photos for some laughs and fun
                </Text>
                <TouchableOpacity onPress={handleSubscription}>
                  <Text style={styles.buttonPro}>Unlock PRO ▷ </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>


          <View>
            <Text style={styles.infoText}>
              With our AI-powered analysis, you'll get personalized results and insights about your appearance
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Animated.View style={animatedButtonStyle}>
            <View style={styles.footer}>
              <Animated.View style={animatedButtonStyle}>
                <TouchableOpacity style={styles.buttonWrapper} onPress={handleContinue} onPressIn={onPressIn} onPressOut={onPressOut}>
                  <LinearGradient
                      colors={['#FF914D', '#2C1B17']}
                      start={{ x: 1, y: 2 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.button}
                  >
                    <Text style={styles.buttonText}>Continue</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
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
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 32,
    textAlign: "center",
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
    position: 'relative',
    overflow: 'hidden',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    zIndex: 2,
  },
  featureContent: {
    flex: 1,
    zIndex: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
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
  infoText: {
    fontSize: 14,
    color: '#706A6AFF',
    lineHeight: 20,
    textAlign: "center",
  },
  footer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#e9815f',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    padding: 18,
  },
  buttonText: {
    color: '#fc8032',
    fontSize: 14,
    alignSelf: "center",
    fontWeight: '500',
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  cardGlowWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 0,
    pointerEvents: 'none',
  },
  cardRoundGlowWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    marginTop: -50,
    marginLeft: -50,
    zIndex: 0,
    pointerEvents: 'none',
  },

  cardCenterGlow: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    opacity: 0.15,
  },

  cardRoundGlow: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    opacity: 0.12,
  },

  cardDiffuseGlowWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 150,
    height: 100,
    marginTop: -50,
    marginLeft: -75,
    zIndex: 0,
    pointerEvents: 'none',
  },

  cardDiffuseGlow: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    opacity: 0.1,
  },

  buttonPro: {
    color: '#FF8570',

  },
  animatedButtonStyle: {

  },
  cardGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    opacity: 0.2,
  },
  featureCard2: {
    position: 'relative',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
    zIndex: 1,
  },

});