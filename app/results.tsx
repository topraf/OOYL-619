import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Platform, Dimensions, Share, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Home, Camera, MessageCircle, Star, History } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform as RNPlatform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import LeagueGauge from "@/components/LeagueGauge";
import ImagePreview from "@/components/ImagePreview";
import PaywallModal from "@/components/PaywallModal";
import FeatureScoreCard from "@/components/FeatureScoreCard";
import BottomNavigation from "@/components/BottomNavigation";
import ComparisonCard from "@/components/ComparisonCard";
import EmptyState from "@/components/EmptyState";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");

type FeatureStatus = "High" | "Mid" | "Low";

export default function ResultsScreen() {
  const router = useRouter();
  const { comparisons, isLoading, isPremium, clearHistory } = useUserStore();
  const [showResult, setShowResult] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const latestResult = comparisons[0];

  useEffect(() => {
    if (!isLoading && latestResult) {
      // Add a small delay for dramatic effect
      const timer = setTimeout(() => {
        setShowResult(true);
        if (RNPlatform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, latestResult]);

  const handleShare = async () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      try {
        const result = await Share.share({
          message: `I just found out if someone is in my league using League Checker! My score: ${getOverallScore()}/10`,
          title: "League Checker Results"
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not available on web");
    }
  };

  const handleNewComparison = () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
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
    // Simple confirmation
    if (comparisons.length > 0) {
      clearHistory();
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

  // Mock feature scores for demonstration
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
    setShowHistory(!showHistory);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Analyzing your{" "}
          <Text style={styles.loadingTextAccent}>photos...</Text>
        </Text>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        <Text style={styles.loadingSubtext}>Calculating league status</Text>
      </SafeAreaView>
    );
  }

  if (showHistory) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={toggleHistoryView}
          >
            <Home size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Your{" "}
            <Text style={styles.headerTitleAccent}>History</Text>
          </Text>
          <View style={styles.placeholder} />
        </View>
        
        {comparisons.length === 0 ? (
          <EmptyState
            title="No History Yet"
            message="Your comparisons will appear here after you complete them."
          />
        ) : (
          <FlatList
            data={comparisons}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.cardContainer}
                onPress={() => {
                  // Navigate to results with this specific comparison
                  setShowHistory(false);
                }}
              >
                <ComparisonCard result={item} compact={true} />
              </TouchableOpacity>
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
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No{" "}
            <Text style={styles.emptyTitleAccent}>Results</Text>
            {" "}Yet
          </Text>
          <Text style={styles.emptyMessage}>
            Take photos to see if someone is in your league!
          </Text>
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleNewComparison}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Text style={styles.buttonText}>Start Comparison</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <BottomNavigation currentRoute="results" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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
                style={styles.backButton} 
                onPress={() => router.push("/")}
              >
                <Home size={20} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                Your{" "}
                <Text style={styles.headerTitleAccent}>Results</Text>
              </Text>
              <TouchableOpacity 
                style={styles.historyButton} 
                onPress={toggleHistoryView}
              >
                <History size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <LinearGradient
              colors={[colors.secondary, colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.resultCard}
            >
              <Text style={styles.resultTitle}>
                {getLeagueText()}
              </Text>
              
              <View style={styles.imagesContainer}>
                <View style={styles.imageColumn}>
                  <ImagePreview
                    uri={latestResult.user.frontImage || ""}
                    style={styles.circleImage}
                  />
                  <Text style={styles.imageLabel}>You</Text>
                  <Text style={styles.scoreText}>{getOverallScore()}/10</Text>
                </View>
                
                <View style={styles.vsContainer}>
                  <Text style={styles.vsText}>VS</Text>
                </View>
                
                <View style={styles.imageColumn}>
                  <ImagePreview
                    uri={latestResult.target.image}
                    style={styles.circleImage}
                  />
                  <Text style={styles.imageLabel}>
                    {latestResult.target.name || "Them"}
                  </Text>
                  <Text style={styles.scoreText}>
                    {Math.round((latestResult.target.beautyScore || 0) * 10)}/10
                  </Text>
                </View>
              </View>
            </LinearGradient>
            
            <View style={styles.gaugeContainer}>
              <LeagueGauge leagueStatus={latestResult.leagueStatus} />
              <Text style={styles.leaguePhrase}>
                {getLeaguePhrase()}
              </Text>
              <Text style={styles.leagueDescription}>
                {getLeagueDescription()}
              </Text>
            </View>
            
            {isPremium && (
              <View style={styles.featureScoresContainer}>
                <Text style={styles.sectionTitle}>
                  Your Beauty{" "}
                  <Text style={styles.sectionTitleAccent}>Analysis</Text>
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
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.shareFullButton}
              onPress={handleShare}
            >
              <Text style={styles.shareFullButtonText}>Share Your Results</Text>
              <View style={styles.socialIcons}>
                <View style={[styles.socialIcon, { backgroundColor: "#E4405F" }]}>
                  <Text style={styles.socialIconText}>IG</Text>
                </View>
                <View style={[styles.socialIcon, { backgroundColor: "#FFFC00" }]}>
                  <Text style={[styles.socialIconText, { color: "#000" }]}>SC</Text>
                </View>
                <View style={[styles.socialIcon, { backgroundColor: "#000" }]}>
                  <Text style={styles.socialIconText}>TT</Text>
                </View>
              </View>
            </TouchableOpacity>
            
            <View style={styles.actionsContainer}>
              <Text style={styles.actionsTitle}>
                What's{" "}
                <Text style={styles.actionsTitleAccent}>Next?</Text>
              </Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.actionButtonsRow}
              >
                <TouchableOpacity 
                  style={styles.actionButtonCard}
                  onPress={handleNewComparison}
                >
                  <View style={styles.actionIconCircle}>
                    <Camera size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.actionButtonCardText}>Try with another photo again</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButtonCard}
                  onPress={() => router.push("/celebrities")}
                >
                  <View style={styles.actionIconCircle}>
                    <Star size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.actionButtonCardText}>Compare with celebrities</Text>
                  {!isPremium && <Text style={styles.premiumLabel}>Premium</Text>}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButtonCard}
                  onPress={() => router.push("/roastmaster")}
                >
                  <View style={styles.actionIconCircle}>
                    <MessageCircle size={24} color={colors.primary} />
                  </View>
                  <Text style={styles.actionButtonCardText}>Get roasted by our AI if you dare</Text>
                  {!isPremium && <Text style={styles.premiumLabel}>Premium</Text>}
                </TouchableOpacity>
              </ScrollView>
            </View>
            
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimer}>
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
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 24,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 24,
  },
  loadingTextAccent: {
    color: colors.primary,
  },
  loader: {
    marginVertical: 24,
  },
  loadingSubtext: {
    fontSize: 16,
    color: colors.textLight,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 120, // Increased space for bottom navigation
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
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
  headerTitleAccent: {
    color: colors.primary,
  },
  placeholder: {
    width: 40,
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.background,
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
    borderColor: colors.background,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.background,
    marginTop: 8,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.background,
    marginTop: 4,
  },
  vsContainer: {
    width: "20%",
    alignItems: "center",
  },
  vsText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.background,
  },
  gaugeContainer: {
    marginBottom: 24,
  },
  leaguePhrase: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
    marginTop: 12,
  },
  leagueDescription: {
    fontSize: 16,
    color: colors.textLight,
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
    color: colors.text,
    marginBottom: 16,
  },
  sectionTitleAccent: {
    color: colors.primary,
  },
  featureScoresRow: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  shareFullButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  shareFullButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
  socialIcons: {
    flexDirection: "row",
    gap: 8,
  },
  socialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  socialIconText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "700",
  },
  actionsContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionsTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 16,
  },
  actionsTitleAccent: {
    color: colors.primary,
  },
  actionButtonsRow: {
    flexDirection: "row",
    paddingRight: 16,
  },
  actionButtonCard: {
    width: width * 0.3,
    backgroundColor: colors.primary + "10",
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
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonCardText: {
    fontSize: 12,
    color: colors.text,
    textAlign: "center",
    lineHeight: 16,
  },
  premiumLabel: {
    position: "absolute",
    top: 4,
    right: 4,
    fontSize: 10,
    color: colors.primary,
    fontWeight: "700",
  },
  disclaimerContainer: {
    marginBottom: 24,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textLight,
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
    color: colors.text,
    marginBottom: 8,
  },
  emptyTitleAccent: {
    color: colors.primary,
  },
  emptyMessage: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
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
  },
  cardContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120, // Space for bottom navigation
  },
});