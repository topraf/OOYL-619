import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
//import { Camera, ArrowRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { colors } from "@/constants/colors";
import { useOnboardingStore } from "@/store/onboarding-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
//import {absoluteFilledPosition} from "expo-image/build/web/positioning";

const { width } = Dimensions.get("window");

export default function OnboardingFeaturesScreen() {
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
    setCurrentStep(2);
    router.push("/onboarding-more-features");
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.featureContainer}>
            <View style={styles.imagesRow}>
              <View style={styles.imageBox}>
                <Image
                    source={{ uri: "https://www.masculin.com/wp-content/uploads/sites/2/2023/12/jeune-homme-1568x1072.jpg" }} style={[styles.card, styles.rightCard]} />
                <Text style={styles.overlayText2}>You</Text>
              </View>

              <View style={styles.imageBox}>
                <Image
                    source={{ uri: "https://www.centre-medical-esthetique-nantes.com/wp-content/uploads/2023/07/hyaluronique.jpg" }} style={[styles.card, styles.leftCard]} />
                <Text style={styles.overlayText}>Someone Else</Text>
              </View>
            </View>

            <View style={styles.gaugeContainer}>
              <Text style={styles.gaugeTitle}></Text>
              <LinearGradient
                  colors={[
                    '#fda43c',
                    '#70d6ff',
                    '#ff4d95',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gauge}
              />

              <Text style={styles.triangle}>▲</Text>

              <View style={styles.gaugeLabels}>
                <Text style={styles.labelLeft}>You can do better</Text>
                <Text style={styles.labelCenter}>Your league</Text>
                <Text style={styles.labelRight}>Out of your league</Text>
              </View>
            </View>
          </View>

          <View style={styles.title}>
            <Text style={styles.title}>Take a selfie and see your results</Text>
          </View>
        </View>

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
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 36,
  },
  titleAccent: {
    color: colors.primary,
  },

  featureContainer: {
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  imagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  imageBox: {
    width: (width - 96) / 2,
    alignItems: "center",
  },

  card: {
    width: 180,
    height: 250,
    borderRadius: 20,
    position: 'absolute',
  },

  leftCard: {
    top: 20,
    left: -140,
    marginTop: 100,
    transform: [{ rotate: '-14deg' }],
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  rightCard: {
    top: 0,
    right: -140,
    transform: [{ rotate: '15deg' }, { scaleX: -1 }],
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',

  },


  faceImage: {
    width: (width - 96) / 2,
    height: (width - 96) / 2,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.border,
  },
  imageLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },

  overlayText: {
    position: 'absolute',
    bottom: -370,
    left: -110,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
    transform: [{ rotate: '-15deg' }],
    zIndex: 2,
  },

  overlayText2: {
    position: 'absolute',
    bottom: -15,
    left: 130,
    backgroundColor: 'rgba(0,0,0,0.2)',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
    transform: [{ rotate: '15deg'}],
    zIndex: 2,
  },

  gradientBar: {
    height: 8,
    width: 250,
    borderRadius: 10,
  },

  triangle: {
    marginTop: -5,
    color: '#3cb1ca',
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  labelsContainer: {
    flexDirection: 'row',
    width: 260,
    justifyContent: 'space-between',
    marginTop: 4,
  },
  labelLeft: {
    fontSize: 11,
    color: 'gray',
  },
  labelCenter: {
    fontSize: 11,
    color: 'white',
    fontWeight: 'bold',

  },
  labelRight: {
    fontSize: 11,
    color: 'gray',
  },

  gaugeContainer: {
    marginTop: 350,
  },
  gaugeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  gauge: {
    height: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  gaugeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gaugeLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  outOfLeagueLabel: {
    color: colors.gauge.red,
    fontWeight: "700",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#e9815f',
    borderRadius: 10,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    padding: 18,
  },
  buttonText: {
    color: '#fc8032',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
  },
});