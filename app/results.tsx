import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Platform, Dimensions, Share, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Share2, Camera, MessageCircle, Sparkles, ArrowLeft, Trash2 } from "lucide-react-native";
import * as Haptics from "expo-haptics";
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
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, latestResult]);

  const handleShare = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      try {
        const result = await Share.share({
          message: `I just found out if someone is in my league using League Checker! My score: ${getOverallScore()}/100`,
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
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.replace("/");
  };
  
  const handlePremiumFeature = (feature: string) => {
    if (isPremium) {
      if (Platform.OS !== "web") {
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

  const getOverallScore = () => {
    if (!latestResult?.user.beautyScore) return 0;
    return Math.round(latestResult.user.beautyScore * 100);
  };

  // Mock feature scores for demonstration
  const getFeatureScores = () => {
    return [
      { name: "Facial Symmetry", score: Math.round(Math.random() * 40 + 60), status: "High" },
      { name: "Jawline", score: Math.round(Math.random() * 40 + 40), status: "Mid" },
      { name: "Eyes", score: Math.round(Math.random() * 40 + 50), status: "Mid" },
      { name: "Skin", score: Math.round(Math.random() * 40 + 60), status: "High" },
    ];
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
        <Text style={styles.loadingText}>Analyzing your photos...</Text>
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
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your History</Text>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
            <Trash2 size={16} color={colors.error} />
          </TouchableOpacity>
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
              <View style={styles.cardContainer}>
                <ComparisonCard result={item} compact={true} />
              </View>
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
          <Text style={styles.emptyTitle}>No Results Yet</Text>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {showResult ? (
          <>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.push("/")}
              >
                <ArrowLeft size={20} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Your Results</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.historyButton} onPress={toggleHistoryView}>
                  <Text style={styles.historyButtonText}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                  <Share2 size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
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
                  <Text style={styles.scoreText}>{getOverallScore()}/100</Text>
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
                    {Math.round((latestResult.target.beautyScore || 0) * 100)}/100
                  </Text>
                </View>
              </View>
            </LinearGradient>
            
            <View style={styles.gaugeContainer}>
              <LeagueGauge leagueStatus={latestResult.leagueStatus} />
            </View>
            
            {isPremium && (
              <View style={styles.featureScoresContainer}>
                <Text style={styles.sectionTitle}>Your Beauty Analysis</Text>
                <View style={styles.featureScoresGrid}>
                  {getFeatureScores().map((feature, index) => (
                    <FeatureScoreCard 
                      key={index}
                      name={feature.name}
                      score={feature.score}
                      status={feature.status}
                    />
                  ))}
                </View>
              </View>
            )}
            
            <View style={styles.actionsContainer}>
              <Text style={styles.actionsTitle}>What's Next?</Text>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleNewComparison}
              >
                <Camera size={20} color={colors.text} />
                <Text style={styles.actionButtonText}>Try with another photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handlePremiumFeature("Beauty Analysis")}
              >
                <Sparkles size={20} color={colors.text} />
                <Text style={styles.actionButtonText}>Get beauty analysis & tips</Text>
                {!isPremium && <Text style={styles.premiumLabel}>Premium</Text>}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push("/roastmaster")}
              >
                <MessageCircle size={20} color={colors.text} />
                <Text style={styles.actionButtonText}>Get roasted by our AI</Text>
                {!isPremium && <Text style={styles.premiumLabel}>Premium</Text>}
              </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 24,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    marginRight: 8,
  },
  historyButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "700",
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
    fontWeight: "600",
    color: colors.background,
    marginTop: 8,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.background,
    marginTop: 4,
  },
  vsContainer: {
    width: "20%",
    alignItems: "center",
  },
  vsText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.background,
  },
  gaugeContainer: {
    marginBottom: 24,
  },
  featureScoresContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  featureScoresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionButtonText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  premiumLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
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
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
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
    fontWeight: "600",
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