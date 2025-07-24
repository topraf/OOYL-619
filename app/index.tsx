/**
 * Homepage Screen - Main landing page of the League Checker app
 * 
 * This is the primary entry point for users after onboarding. It provides:
 * - Hero section with app introduction
 * - Main CTA to start photo comparison
 * - Quick access to premium features (celebrities, AI roast)
 * - Premium upgrade banner for free users
 * - Feature explanation section
 * - App disclaimer
 * - Multilingual support with dynamic text based on user language preference
 * 
 * The screen uses a dark theme with orange/pink gradients and includes
 * smooth animations for user interactions. It integrates with the user
 * store for premium status, comparison management, and language settings.
 * 
 * Navigation: Includes bottom navigation and routes to various app sections
 * Premium: Shows upgrade prompts for non-premium users
 * Animations: React Native Reanimated for smooth interactions
 * Languages: Supports multiple languages through the translations system
 */

import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {Star, MessageCircle, Heart} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useUserStore } from "@/store/user-store";
import { useOnboardingStore } from "@/store/onboarding-store";
import BottomNavigation from "@/components/BottomNavigation";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withTiming,
  withRepeat,
  //interpolate
} from "react-native-reanimated";
import {colors} from "@/constants/colors";
import AutoScrollFeatures from "@/components/AutoScroll";
import PreniumCard from "@/components/PreniumCard";

//const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { resetUserImages, freeComparisonUsed, isPremium, getColors, getTranslations } = useUserStore();
  const { hasCompletedOnboarding, setHasCompletedOnboarding } = useOnboardingStore();
  const colors = getColors();
  const t = getTranslations();
  
  const buttonScale = useSharedValue(1);
  const heroScale = useSharedValue(0.95);
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(30);
  const pulseScale = useSharedValue(1);
  
  const animatedSlideStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: slideUp.value }],
      opacity: fadeIn.value,
    };
  });
  
  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }]
    };
  });
  
  // Check if onboarding is completed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        router.push("/onboarding");
        // Force set onboarding as completed to prevent loops
        setHasCompletedOnboarding(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, router]);
  
  // Entrance animations
  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 800 });
    slideUp.value = withTiming(0, { duration: 800 });
    heroScale.value = withSpring(1, { damping: 15 });
    
    // Subtle pulse animation for the main button
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);
  
  const handleStartComparison = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    resetUserImages();
    router.push("/gender-selection");
  };

  const handleCelebrities = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isPremium || !freeComparisonUsed) {
      router.push("/celebrities");
    } else {
      router.push("/subscription");
    }
  };

  const handleAIRoast = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isPremium || !freeComparisonUsed) {
      router.push("/roastmaster");
    } else {
      router.push("/subscription");
    }
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
      <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerGradientWrapper}>
          <LinearGradient
              colors={[
                '#913f8f',
                '#e5a0b9',
                '#f9943b',
              ]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.headerGradient}
          />
          <View style={styles.headerOverlay} />
        </View>
        <Animated.View style={[styles.actionsContainer, animatedSlideStyle]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16 }}>
            <Text style={[styles.featuresTitle2, { color: colors.text }]}>Out of your League</Text>
            <TouchableOpacity style={styles.goProButton} onPress={handleSubscription}>
              <Text style={styles.goProText}>Go Pro</Text>
              <Text style={styles.goProPlus}>+</Text>
            </TouchableOpacity>
          </View>
          <Animated.View style={animatedPulseStyle}>
            <View style={styles.findOutWrapper}>
              <TouchableOpacity
                  style={[styles.mainButton, { backgroundColor: 'rgba(0, 0, 0, 0.40)' }]}
                  onPress={handleStartComparison}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
              >
                <Image
                    source={{ uri: "https://tse1.mm.bing.net/th/id/OIP.ngnrN3lZYvGn3sNe2Cm_awHaKX?r=0&pid=ImgDet&w=203&h=284&c=7&dpr=1,3&o=7&rm=3" }}
                    style={styles.findOutImage}
                />

                <View style={styles.buttonContent}>
                  <Heart size={24} color="#FFFFFF" />
                    <View style={styles.textContainer}>
                      <Text style={styles.buttonText}> {'\n'} Find out if (s)he is {'\n'} out of your league!</Text>
                      <Text style={styles.featureStart}>Start ›</Text>
                    </View>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>




        <Animated.View style={[styles.quickActionsContainer, animatedSlideStyle]}>
          <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: 'rgba(0, 0, 0, 0.40)' }]}
              onPress={handleCelebrities}
          >
            <View style={styles.cardGlowWrapper}>
              <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.40)']}
                  start={{ x: 0.5, y: 0.5 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.cardGlow}
              />
            </View>
            <View style={[styles.cardFlatBackground, { backgroundColor: 'rgba(0, 0, 0, 0.30)' }]} />

            <View style={styles.cardContent}>
              <View style={[styles.iconBubbleTopLeft, { backgroundColor: '#322c2c' }]}>
                <Star size={25} color={'#FFFFFF'} />
              </View>

              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {t.screens.home.celebrities_title}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textLight }]}>
                {t.screens.home.celebrities_subtitle}
              </Text>
              <TouchableOpacity onPress={handleSubscription}>
                <Text style={styles.buttonPro}> {'\n'}Unlock PRO › </Text>
              </TouchableOpacity>
            </View>

            {(!isPremium && freeComparisonUsed) && (
              <View style={[styles.premiumBadge, { backgroundColor: colors.primary }]}>
                <Star size={10} color={colors.background} />
              </View>
            )}
          </TouchableOpacity>




          <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: 'rgba(0, 0, 0, 0.30)' }]}
              onPress={handleAIRoast}
          >
            <View style={styles.cardGlowWrapper}>
              <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.40)']}
                  start={{ x: 0.5, y: 0.5 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.cardGlow}
              />
            </View>

            <View style={[styles.cardFlatBackground, { backgroundColor: 'rgba(0, 0, 0, 0.40)' }]} />

            <View style={styles.cardContent}>
              <View style={[styles.iconBubbleTopLeft, { backgroundColor: '#322c2c' }]}>
                <MessageCircle size={25} color={'#FFFFFF'} />
              </View>

              <Text style={[styles.cardTitle, { color: colors.text }]}>
                AI Roast
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textLight }]}>
                Send a picture and get roasted by our AI
              </Text>

              <TouchableOpacity onPress={handleSubscription}>
                <Text style={styles.buttonPro}> {'\n'} Unlock PRO › </Text>
              </TouchableOpacity>
            </View>

            {/* Badge etoile si pas premium */}
            {(!isPremium && freeComparisonUsed) && (
                <View style={[styles.premiumBadge, { backgroundColor: colors.primary }]}>
                  <Star size={10} color={colors.background} />
                </View>
            )}
          </TouchableOpacity>
        </Animated.View>
        
        {!isPremium && (
          <Animated.View style={[styles.premiumContainer, animatedSlideStyle]}>
            <LinearGradient
              colors={[colors.secondary, colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumBanner}
            >
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1494790108755-2616c9c0e8e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
                style={styles.premiumBackgroundImage}
              />
              <LinearGradient
                colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
                style={styles.premiumOverlay}
              />
              <View style={styles.premiumContent}>
                <Text style={[styles.premiumTitle, { color: colors.background }]}>
                  {t.screens.home.premium_title}
                </Text>
                <Text style={[styles.premiumDescription, { color: colors.background }]}>
                  {t.screens.home.premium_subtitle}
                </Text>
                <TouchableOpacity 
                  style={[styles.premiumButton, { backgroundColor: "#FFD700" }]}
                  onPress={() => router.push("/subscription")}
                >
                  <Text style={[styles.premiumButtonText, { color: "#000000" }]}>{t.screens.home.premium_cta}</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        //How it works
        
        <Animated.View style={[styles.featuresContainer, animatedSlideStyle]}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>
            {t.screens.home.how_it_works.split(' ')[0]} {t.screens.home.how_it_works.split(' ')[1]}{" "}
            <Text style={[styles.featuresTitleAccent, { color: colors.text }]}>
              {t.screens.home.how_it_works.split(' ')[2]}
            </Text>
          </Text>

          <AutoScrollFeatures/>

        </Animated.View>

        <PreniumCard onPress={handleSubscription} />


        //partie disclaimer
        <View style={styles.disclaimerContainer}>
          <Text style={[styles.disclaimer, { color: colors.textLight }]}>
            {t.screens.home.disclaimer}
          </Text>
        </View>
      </ScrollView>
      
      <BottomNavigation currentRoute="scan" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  heroContainer: {
    height: 280,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  headerButtons: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    position: "relative",
  },
  mainButton: {
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: -20,
    zIndex: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "900",
    marginLeft: 16,
    marginRight: 30,
    marginTop: 12,
    color: "#FFFFFF",
    justifyContent: "flex-start",
    textAlign: 'left',
    alignSelf: 'flex-start'
  },
  buttonPro: {
    color: '#FF8570',
  },
  freeTagContainer: {
    position: "absolute",
    top: -10,
    right: 24,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeTag: {
    fontSize: 12,
    fontWeight: "700",
  },
  quickActionsContainer: {
    flexDirection: "row",
    marginTop: 26,
    paddingHorizontal: 16,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardGradientBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 2,
  },
  cardFlatBackground: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 14,
  },
  cardContent: {
    padding: 18,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    textAlign: "center",
  },
  cardGlow: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    opacity: 0.2,
  },
  plusIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  premiumBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  premiumContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  premiumBanner: {
    borderRadius: 16,
    height: 120,
    overflow: "hidden",
    position: "relative",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumBackgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  premiumOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  premiumContent: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    zIndex: 1,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
  },
  premiumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  premiumButtonText: {
    fontWeight: "700",
    fontSize: 16,
  },
  featuresContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 20,
    overflow: 'visible',
  },
  featuresTitle2: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 20,
    overflow: 'visible',
    marginTop: 12,
  },
  featuresTitleAccent: {
    // Color applied dynamically
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.1)",
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
    zIndex: 2,
  },
  gaugeIcon: {
    fontSize: 20,
    fontWeight: "800",
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: 'left',
    alignSelf: "flex-start"
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  disclaimerContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  cardGlowWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 0,
  },
  iconBubbleTopLeft: {
    position: 'absolute',
    margin: -6,
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  headerGradientWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 425,
    zIndex: -1,
  },
  headerGradient: {
    flex: 1,

  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  findOutImage: {
    position: 'absolute',
    top: -20,
    right: -1,
    width: 110,
    height: 170,
    borderRadius: 20,
    transform: [{ rotate: '8deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 3,
  },
  findOutWrapper: {
    marginTop: 16,
    position: 'relative',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: -50,
    alignItems: 'flex-start',
  },
  startContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  featureStart: {
    fontSize: 13,
    color: 'pink',
    fontWeight: '600',
    marginLeft: 24,
    marginRight: 30,
    marginTop: 4,
    textAlign: 'left',
    alignSelf: 'flex-start'
  },
  goProButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginRight: -10,
    marginTop: 8,
    elevation: 2,
  },

  goProText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },

  goProPlus: {
    color: '#000',
    fontWeight: '900',
    fontSize: 14,
  },

});