/**
 * Results Screen - Display comparison analysis results
 * 
 * This screen shows the outcome of a beauty comparison between the user
 * and their selected target (person or celebrity). Key features include:
 * 
 * - League status visualization with animated gauge
 * - Side-by-side photo comparison with beauty scores
 * - Detailed feature analysis (premium feature)
 * - Social sharing capabilities
 * - Action buttons for next steps (new comparison, celebrities, AI roast)
 * - Premium upgrade prompts for non-premium users
 * 
 * The screen handles both loading states during analysis and empty states
 * when no comparisons have been made. It integrates with both user store
 * and comparison store for data management.
 * 
 * Premium Features:
 * - Detailed feature scores (facial symmetry, jawline, eyes, skin)
 * - Advanced sharing options
 * - Unlimited comparisons
 * 
 * Navigation: Includes bottom navigation and back button to homepage
 * Animations: Smooth entrance animations and celebration effects
 */

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions, Share, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Home, Camera, MessageCircle, Star, Share2 } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform as RNPlatform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useUserStore } from "@/store/user-store";
import { useComparisonStore } from "@/store/comparison-store";
import LeagueGauge from "@/components/LeagueGauge";
import ImagePreview from "@/components/ImagePreview";
import PaywallModal from "@/components/PaywallModal";
//import FeatureScoreCard from "@/components/FeatureScoreCard";
import BottomNavigation from "@/components/BottomNavigation";
// import ComparisonCard from "@/components/ComparisonCard";
// import EmptyState from "@/components/EmptyState";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from "react-native-reanimated";
//import { FontAwesome } from '@expo/vector-icons';
import { getIndicatorPosition } from "@/components/LeagueGauge";
import { Ionicons } from "@expo/vector-icons";


const { width } = Dimensions.get("window");

{/* type FeatureStatus = "High" | "Mid" | "Low"; */}

export default function ResultsScreen() {
  const router = useRouter();
  const { comparisons, isLoading, isPremium, getColors } = useUserStore();
  const { history } = useComparisonStore();
  const colors = getColors();
  const [showResult, setShowResult] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  
  const buttonScale = useSharedValue(1);
  const cardScale = useSharedValue(1);
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(50);
  
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }],
      opacity: fadeIn.value,
    };
  });
  
  const animatedSlideStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: slideUp.value }],
      opacity: fadeIn.value,
    };
  });
  
  // Use comparison store history instead of user store
  const latestResult = history[0] || comparisons[0];

  useEffect(() => {
    if (!isLoading && latestResult) {
      // Enhanced entrance animation
      fadeIn.value = withTiming(1, { duration: 800 });
      slideUp.value = withTiming(0, { duration: 800 });
      
      const timer = setTimeout(() => {
        setShowResult(true);
        if (RNPlatform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Subtle celebration animation
        cardScale.value = withSequence(
          withTiming(1.05, { duration: 200 }),
          withTiming(1, { duration: 200 })
        );
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, latestResult]);

  const handleShareGeneral = async () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    try {
      const message = `I just found out if someone is in my league using League Checker! My score: ${getOverallScore()}/10`;
      await Share.share({
        message: message,
        title: "League Checker Results"
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleNewComparison = () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Animate button press
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    router.replace("/");
  };
  
  const handlePremiumFeature = (feature: string) => {
    if (isPremium) {
      if (RNPlatform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      alert(`${feature} feature coming soon!`);
    } else {
      setShowPaywall(true);
    }
  };

  const getLeagueText = () => {
    if (!latestResult) return "";
    
    switch (latestResult.leagueStatus) {
      case "way_beyond":
        return "They are way beyond your league";
      case "out_of_league":
        return "They are out of your league";
      case "slightly_above":
        return "They are slightly above your league";
      case "in_your_league":
        return "They are in your league";
      case "slightly_below":
        return "They are slightly below your league";
      case "you_can_do_better":
        return "You can do better";
      default:
        return "They are in your league";
    }
  };

  const getLeagueDescription = () => {
    if (!latestResult) return "";
    
    switch (latestResult.leagueStatus) {
      case "way_beyond":
        return "This person is significantly more attractive than you based on our analysis.";
      case "out_of_league":
        return "This person is more attractive than you, but not impossibly so.";
      case "slightly_above":
        return "This person is slightly more attractive than you.";
      case "in_your_league":
        return "You and this person are well-matched in terms of attractiveness!";
      case "slightly_below":
        return "You are slightly more attractive than this person.";
      case "you_can_do_better":
        return "You are significantly more attractive than this person.";
      default:
        return "You and this person are well-matched in terms of attractiveness!";
    }
  };

  const getLeaguePhrase = () => {
    if (!latestResult) return "";
    
    switch (latestResult.leagueStatus) {
      case "way_beyond":
        return "Dream on! 🌟";
      case "out_of_league":
        return "Aim high! 🎯";
      case "slightly_above":
        return "Close call! 📈";
      case "in_your_league":
        return "Perfect match! 💫";
      case "slightly_below":
        return "You're winning! 🏆";
      case "you_can_do_better":
        return "Reach higher! 🚀";
      default:
        return "Perfect match! 💫";
    }
  };

  const getOverallScore = () => {
    if (!latestResult?.user.beautyScore) return 0;
    return Math.round(latestResult.user.beautyScore * 10);
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const indicatorLeft = getIndicatorPosition(latestResult.leagueStatus);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Animated.View style={animatedSlideStyle}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Analyzing your{" "}
            <Text style={[styles.loadingTextAccent, { color: colors.primary }]}>photos...</Text>
          </Text>
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          <Text style={[styles.loadingSubtext, { color: colors.textLight }]}>Calculating league status</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (!latestResult) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No{" "}
            <Text style={[styles.emptyTitleAccent, { color: colors.primary }]}>Results</Text>
            {" "}Yet
          </Text>
          <Text style={[styles.emptyMessage, { color: colors.textLight }]}>
            Take photos to see if someone is in your league!
          </Text>
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }]} 
              onPress={handleNewComparison}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>Start Comparison</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <BottomNavigation currentRoute="results" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
      >
        {showResult ? (
          <>
            <View style={styles.header}>
              <TouchableOpacity
                style={[styles.backButton, { backgroundColor: colors.card }]}
                onPress={() => router.push("/")}
              >
                <Home size={20} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Your{" "}
                <Text style={[styles.headerTitleAccent, { color: colors.primary }]}>Results</Text>
              </Text>
              <View style={styles.placeholder} />
            </View>

            <Animated.View style={animatedCardStyle}>
              <View style={[styles.resultCard, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.resultTitle, { color: colors.background }]}>
                  {getLeagueText()}
                </Text>

                <View style={styles.imagesContainer}>
                  <View style={styles.imageColumn}>
                    <Animated.View
                        style={{
                          transform: [{ rotate: "-8deg" },
                                      { translateX: -24 },
                                      { translateY: -10 },
                          ]
                        }}
                    >
                      <ImagePreview
                          uri={latestResult.user.frontImage || ""}
                          style={[styles.circleImage, { borderColor: colors.background }]}
                      />
                    </Animated.View>
                    <View style={styles.scoreContainer}>
                      <Text style={styles.scoreText}>{getOverallScore()}/10</Text>
                    </View>
                  </View>

                  <View style={styles.vsContainer}>
                    <Text style={[styles.vsText, { color: colors.background }]}></Text>
                  </View>

                  <View style={styles.centerButton}>
                    <Ionicons name="swap-horizontal" size={20} color="white" />
                  </View>

                  <View style={styles.imageColumn}>
                    <Animated.View
                        style={{
                          transform: [{ rotate: "8deg" },
                            { translateX: 6 },
                            { translateY: -10 },
                          ]
                        }}
                    >
                      <ImagePreview
                          uri={latestResult.target.image}
                          style={[styles.circleImage2, { borderColor: colors.background }]}
                      />
                    </Animated.View>

                    <View style={styles.scoreContainer2}>
                      <Text style={styles.scoreText}>
                        {Math.round((latestResult.target.beautyScore || 0) * 10)}/10
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
            
            <Animated.View style={[styles.gaugeContainer, animatedSlideStyle]}>
              <LeagueGauge leagueStatus={latestResult.leagueStatus} />
              <Text style={[styles.leaguePhrase, { color: colors.primary }]}>
                {getLeaguePhrase()}
              </Text>
              <Text style={[styles.leagueDescription, { color: colors.textLight }]}>
                {getLeagueDescription()}
              </Text>
            </Animated.View>

            <Animated.View style={[styles.shareContainer, { backgroundColor: colors.card }, animatedSlideStyle]}>
              <Text style={[styles.shareTitle, { color: colors.text }]}>Share Your Results</Text>
              <View style={styles.socialButtonsContainer}>
                {/* SNAPCHAT */}
                <TouchableOpacity onPress={() => Linking.openURL("snapchat://").catch(() =>
                    Linking.openURL("https://www.snapchat.com/")
                )} style={[styles.socialButton, { backgroundColor: "#FFFC00" }]}>
                  <Image source={require("../assets/icons/Snapchat.png")} style={styles.icon} />
                </TouchableOpacity>

                {/* INSTAGRAM */}
                <TouchableOpacity onPress={() => Linking.openURL("instagram://app").catch(() =>
                    Linking.openURL("https://www.instagram.com/")
                )} style={[styles.socialButton, { backgroundColor: "#d83496" }]}>
                  <LinearGradient
                      colors={["#F58529", "#DD2A7B", "#8134AF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFillObject}
                  />
                  <Image source={require("../assets/icons/Instagram_icon.png.webp")} style={styles.icon} />
                </TouchableOpacity>

                {/* WHATSAPP */}
                <TouchableOpacity onPress={() => Linking.openURL("whatsapp://send").catch(() =>
                    Linking.openURL("https://wa.me/")
                )} style={[styles.socialButton, { backgroundColor: "#25D366" }]}>
                  <Image source={require("../assets/icons/Whatsapp.png")} style={styles.icon} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: colors.background }]}
                  onPress={handleShareGeneral}
                >
                  <Share2 size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View style={[styles.actionsContainer, { backgroundColor: colors.background }, animatedSlideStyle]}>
              <Text style={[styles.actionsTitle, { color: colors.text }]}>
                What's Next ?
              </Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.actionButtonsRow}
              >
                <TouchableOpacity 
                  style={[styles.actionButtonCard, { backgroundColor: colors.card }]}
                  onPress={handleNewComparison}
                >
                  <View style={[styles.actionIconCircle, { backgroundColor: colors.third + 20 }]}>
                    <Camera size={24} color={colors.third} />
                  </View>
                  <Text style={[styles.actionButtonCardText, { color: colors.text }]}>Try with another {'\n'} photo again</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButtonCard, { backgroundColor: colors.card }]}
                  onPress={() => router.push("/celebrities")}
                >
                  <View style={[styles.actionIconCircle, { backgroundColor: colors.primary + 20 }]}>
                    <Star size={24} color={colors.primary} />
                  </View>
                  <View style={styles.pro}> <Text style={styles.textpro}> PRO </Text> </View>
                  <Text style={[styles.actionButtonCardText, { color: colors.text }]}>Compare with celebrities</Text>
                  {!isPremium && <Text style={[styles.premiumLabel, { color: colors.primary }]}>Premium</Text>}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButtonCard, { backgroundColor: colors.card }]}
                  onPress={() => router.push("/roastmaster")}
                >
                  <View style={[styles.actionIconCircle, { backgroundColor: colors.primary + 20 }]}>
                    <MessageCircle size={24} color={colors.primary} />
                  </View>
                  <View style={styles.pro}> <Text style={styles.textpro}> PRO </Text> </View>
                  <Text style={[styles.actionButtonCardText, { color: colors.text }]}>Get roasted by our AI if you dare</Text>
                  {!isPremium && <Text style={[styles.premiumLabel, { color: colors.primary }]}>Premium</Text>}
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
            
            <View style={styles.disclaimerContainer}>
              <Text style={[styles.disclaimer, { color: colors.textLight }]}>
                This comparison is based on photographic evidence only. Beauty is subjective and
                not everyone is photogenic. Don't take these results too seriously!
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </ScrollView>
      
      <BottomNavigation currentRoute="results" />
      
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 24,
  },
  loadingTextAccent: {
    // Color applied dynamically
  },
  loader: {
    marginVertical: 24,
  },
  loadingSubtext: {
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
  },
  headerTitleAccent: {
    // Color applied dynamically
  },
  placeholder: {
    width: 40,
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 20,
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageColumn: {
    alignItems: "center",
    width: "40%",
  },
  circleImage: {
    width: 160,
    height: 250,
    borderRadius: 10,
    left: 30,
    zIndex: 1,
  },
  circleImage2: {
    width: 160,
    height: 250,
    borderRadius: 10,
    zIndex: 10,
    right: 10,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },

  scoreContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.37)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    transform: [{ rotate: "-10deg" }],
  },

  scoreContainer2: {
    position: "absolute",
    bottom: 10,
    left: 28,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.37)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    transform: [{ rotate: "10deg" }],
  },

  centerButton: {
    position: "absolute",
    top: 100,
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0.8,
    borderColor: "gray",
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  centerIcon: {
    color: "white",
    fontSize: 18,
  },

  vsContainer: {
    width: "20%",
    alignItems: "center",
  },
  vsText: {
    fontSize: 18,
    fontWeight: "800",
  },
  gaugeContainer: {
    marginBottom: 24,
  },
  leaguePhrase: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
  },
  leagueDescription: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  featureScoresContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 16,
  },
  sectionTitleAccent: {
    // Color applied dynamically
  },
  featureScoresRow: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  shareContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden"
  },
  socialButtonText: {
    fontSize: 20,
  },
  actionsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionsTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
  },
  actionsTitleAccent: {
    // Color applied dynamically
  },
  actionButtonsRow: {
    flexDirection: "row",
    paddingRight: 16,
  },
  actionButtonCard: {
    width: width * 0.3,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonCardText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  premiumLabel: {
    position: "absolute",
    top: 4,
    right: 4,
    fontSize: 10,
    fontWeight: "700",
  },
  disclaimerContainer: {
    marginBottom: 24,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },
  emptyTitleAccent: {
    // Color applied dynamically
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  pro: {
    backgroundColor: "#171010",
    position: "absolute",
    top: 48,
    left: 36,
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 6,
    borderWidth: 0.4,
    borderColor: "#fc8032",
  },
  textpro: {
    color: "#fc8032",
    fontWeight: "bold",
    fontSize: 10,
    letterSpacing: 1,
  },
});