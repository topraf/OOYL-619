import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Platform, Dimensions, Share, FlatList, Linking, Image as RNImage } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Home, Camera, MessageCircle, Star, History, Wifi, WifiOff } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform as RNPlatform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import { useComparisonStore } from "@/store/comparison-store";
import LeagueGauge from "@/components/LeagueGauge";
import ImagePreview from "@/components/ImagePreview";
import PaywallModal from "@/components/PaywallModal";
import FeatureScoreCard from "@/components/FeatureScoreCard";
import BottomNavigation from "@/components/BottomNavigation";
import ComparisonCard from "@/components/ComparisonCard";
import EmptyState from "@/components/EmptyState";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming, useAnimatedProps } from "react-native-reanimated";

const { width } = Dimensions.get("window");

type FeatureStatus = "High" | "Mid" | "Low";

export default function ResultsScreen() {
  const router = useRouter();
  const { comparisons, isLoading, isPremium, clearHistory, isOffline, getCachedComparisons } = useUserStore();
  const { history, clearHistory: clearComparisonHistory } = useComparisonStore();
  const [showResult, setShowResult] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
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
  const cachedResults = getCachedComparisons();
  const displayResults = isOffline ? cachedResults : (history.length > 0 ? history : comparisons);

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

  const handleShareInstagram = async () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      try {
        const message = `I just found out if someone is in my league using League Checker! My score: ${getOverallScore()}/10`;
        
        const instagramUrl = `instagram://story-camera`;
        const canOpen = await Linking.canOpenURL(instagramUrl);
        
        if (canOpen) {
          await Linking.openURL(instagramUrl);
        } else {
          await Share.share({
            message: message,
            title: "League Checker Results"
          });
        }
      } catch (error) {
        console.error("Error sharing to Instagram:", error);
      }
    } else {
      alert("Instagram sharing is not available on web");
    }
  };

  const handleShareSnapchat = async () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      try {
        const message = `I just found out if someone is in my league using League Checker! My score: ${getOverallScore()}/10`;
        
        const snapchatUrl = `snapchat://`;
        const canOpen = await Linking.canOpenURL(snapchatUrl);
        
        if (canOpen) {
          await Linking.openURL(snapchatUrl);
        } else {
          await Share.share({
            message: message,
            title: "League Checker Results"
          });
        }
      } catch (error) {
        console.error("Error sharing to Snapchat:", error);
      }
    } else {
      alert("Snapchat sharing is not available on web");
    }
  };

  const handleShareX = async () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      try {
        const message = `I just found out if someone is in my league using League Checker! My score: ${getOverallScore()}/10`;
        const twitterUrl = `twitter://post?message=${encodeURIComponent(message)}`;
        const canOpen = await Linking.canOpenURL(twitterUrl);
        
        if (canOpen) {
          await Linking.openURL(twitterUrl);
        } else {
          const webUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
          await Linking.openURL(webUrl);
        }
      } catch (error) {
        console.error("Error sharing to X:", error);
      }
    } else {
      const message = `I just found out if someone is in my league using League Checker! My score: ${getOverallScore()}/10`;
      const webUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
      window.open(webUrl, '_blank');
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

  const handleClearHistory = () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    if (displayResults.length > 0) {
      clearHistory();
      clearComparisonHistory();
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

  const getFeatureScores = () => {
    const scores = [
      { name: "Facial Symmetry", score: Math.round(Math.random() * 4 + 6) },
      { name: "Jawline", score: Math.round(Math.random() * 4 + 4) },
      { name: "Eyes", score: Math.round(Math.random() * 4 + 5) },
      { name: "Skin", score: Math.round(Math.random() * 4 + 6) },
    ];

    return scores.map(item => ({
      ...item,
      status: (item.score >= 7 ? "High" : item.score >= 5 ? "Mid" : "Low") as FeatureStatus
    }));
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const toggleHistoryView = () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowHistory(!showHistory);
  };

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

  if (showHistory) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.card }]} 
            onPress={toggleHistoryView}
          >
            <Home size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Your{" "}
            <Text style={[styles.headerTitleAccent, { color: colors.primary }]}>History</Text>
          </Text>
          {isOffline && (
            <View style={[styles.offlineIndicator, { backgroundColor: colors.warning }]}>
              <WifiOff size={16} color={colors.background} />
            </View>
          )}
          <View style={styles.placeholder} />
        </View>
        
        {displayResults.length === 0 ? (
          <EmptyState
            title="No History Yet"
            message={isOffline ? "No cached comparisons available offline." : "Your comparisons will appear here after you complete them."}
          />
        ) : (
          <FlatList
            data={displayResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Animated.View
                style={[
                  animatedCardStyle,
                  { 
                    transform: [{ 
                      translateY: useSharedValue(index * 20).value 
                    }] 
                  }
                ]}
              >
                <TouchableOpacity 
                  style={styles.cardContainer}
                  onPress={() => {
                    if (RNPlatform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setShowHistory(false);
                  }}
                >
                  <ComparisonCard result={item} compact={true} />
                </TouchableOpacity>
              </Animated.View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
        
        <BottomNavigation currentRoute="results" />
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
              <TouchableOpacity 
                style={[styles.historyButton, { backgroundColor: colors.card }]} 
                onPress={toggleHistoryView}
              >
                <History size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <Animated.View style={animatedCardStyle}>
              <LinearGradient
                colors={colors.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.resultCard}
              >
                <Text style={[styles.resultTitle, { color: colors.background }]}>
                  {getLeagueText()}
                </Text>
                
                <View style={styles.imagesContainer}>
                  <View style={styles.imageColumn}>
                    <ImagePreview
                      uri={latestResult.user.frontImage || ""}
                      style={[styles.circleImage, { borderColor: colors.background }]}
                    />
                    <Text style={[styles.imageLabel, { color: colors.background }]}>You</Text>
                    <Text style={[styles.scoreText, { color: colors.background }]}>{getOverallScore()}/10</Text>
                  </View>
                  
                  <View style={styles.vsContainer}>
                    <Text style={[styles.vsText, { color: colors.background }]}>VS</Text>
                  </View>
                  
                  <View style={styles.imageColumn}>
                    <ImagePreview
                      uri={latestResult.target.image}
                      style={[styles.circleImage, { borderColor: colors.background }]}
                    />
                    <Text style={[styles.imageLabel, { color: colors.background }]}>
                      {latestResult.target.name || "Them"}
                    </Text>
                    <Text style={[styles.scoreText, { color: colors.background }]}>
                      {Math.round((latestResult.target.beautyScore || 0) * 10)}/10
                    </Text>
                  </View>
                </View>
              </LinearGradient>
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
            
            {isPremium && (
              <Animated.View style={[styles.featureScoresContainer, animatedSlideStyle]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Your Beauty{" "}
                  <Text style={[styles.sectionTitleAccent, { color: colors.primary }]}>Analysis</Text>
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featureScoresRow}
                >
                  {getFeatureScores().map((feature, index) => (
                    <FeatureScoreCard 
                      key={index}
                      name={feature.name}
                      score={feature.score}
                      status={feature.status}
                    />
                  ))}
                </ScrollView>
              </Animated.View>
            )}
            
            <Animated.View style={[styles.shareContainer, { backgroundColor: colors.card }, animatedSlideStyle]}>
              <Text style={[styles.shareTitle, { color: colors.text }]}>Share Your Results</Text>
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.socialButton, { backgroundColor: "#E4405F" }]}
                  onPress={handleShareInstagram}
                >
                  <View style={styles.socialIconContainer}>
                    <RNImage 
                      source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/132px-Instagram_logo_2016.svg.png" }} 
                      style={styles.socialIcon} 
                    />
                  </View>
                  <Text style={styles.socialButtonText}>Instagram</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.socialButton, { backgroundColor: "#FFFC00" }]}
                  onPress={handleShareSnapchat}
                >
                  <View style={styles.socialIconContainer}>
                    <RNImage 
                      source={{ uri: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/320px-Snapchat_logo.svg.png" }} 
                      style={styles.socialIcon} 
                    />
                  </View>
                  <Text style={[styles.socialButtonText, { color: "#000" }]}>Snapchat</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.socialButton, { backgroundColor: "#000" }]}
                  onPress={handleShareX}
                >
                  <View style={styles.socialIconContainer}>
                    <RNImage 
                      source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/X_logo_2023_%28white%29.png/320px-X_logo_2023_%28white%29.png" }} 
                      style={styles.socialIcon} 
                    />
                  </View>
                  <Text style={styles.socialButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            <Animated.View style={[styles.actionsContainer, { backgroundColor: colors.card }, animatedSlideStyle]}>
              <Text style={[styles.actionsTitle, { color: colors.text }]}>
                What's{" "}
                <Text style={[styles.actionsTitleAccent, { color: colors.primary }]}>Next?</Text>
              </Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.actionButtonsRow}
              >
                <TouchableOpacity 
                  style={[styles.actionButtonCard, { backgroundColor: colors.primary + "10" }]}
                  onPress={handleNewComparison}
                >
                  <View style={[styles.actionIconCircle, { backgroundColor: colors.background }]}>
                    <Camera size={24} color={colors.primary} />
                  </View>
                  <Text style={[styles.actionButtonCardText, { color: colors.text }]}>Try with another photo again</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButtonCard, { backgroundColor: colors.primary + "10" }]}
                  onPress={() => router.push("/celebrities")}
                >
                  <View style={[styles.actionIconCircle, { backgroundColor: colors.background }]}>
                    <Star size={24} color={colors.primary} />
                  </View>
                  <Text style={[styles.actionButtonCardText, { color: colors.text }]}>Compare with celebrities</Text>
                  {!isPremium && <Text style={[styles.premiumLabel, { color: colors.primary }]}>Premium</Text>}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButtonCard, { backgroundColor: colors.primary + "10" }]}
                  onPress={() => router.push("/roastmaster")}
                >
                  <View style={[styles.actionIconCircle, { backgroundColor: colors.background }]}>
                    <MessageCircle size={24} color={colors.primary} />
                  </View>
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
  historyButton: {
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
  offlineIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
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
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    borderWidth: 3,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  socialIconContainer: {
    width: 24,
    height: 24,
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  socialButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
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
  cardContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
});