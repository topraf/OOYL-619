/**
 * Celebrity Comparison Screen
 * 
 * This screen allows users to compare two celebrities with each other.
 * Users can:
 * 1. Select two different celebrities from the database
 * 2. View a side-by-side comparison of their beauty scores
 * 3. See detailed analysis of which celebrity ranks higher
 * 
 * The screen includes:
 * - Two celebrity selection panels
 * - Search and filter functionality for each selection
 * - Comparison button to initiate analysis
 * - Results display with detailed breakdown
 * - Premium features with appropriate paywalls
 */

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Search, X, RefreshCw, ChevronRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useUserStore } from "@/store/user-store";
import { celebrities } from "@/mocks/celebrities";
import PaywallModal from "@/components/PaywallModal";
import LeagueGauge from "@/components/LeagueGauge";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withSequence } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function CelebrityCompareBetweenScreen() {
  const router = useRouter();
  const { isPremium, freeComparisonUsed, getColors } = useUserStore();
  const colors = getColors();
  
  const [firstCelebrity, setFirstCelebrity] = useState(null);
  const [secondCelebrity, setSecondCelebrity] = useState(null);
  const [showFirstSelection, setShowFirstSelection] = useState(false);
  const [showSecondSelection, setShowSecondSelection] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  
  const fadeAnim = useSharedValue(0);
  const slideUpAnim = useSharedValue(20);
  const buttonScale = useSharedValue(1);
  const resultScale = useSharedValue(0.95);
  
  const animatedFadeStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideUpAnim.value }],
    };
  });
  
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const animatedResultStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: resultScale.value }],
      opacity: fadeAnim.value,
    };
  });
  
  useEffect(() => {
    // Entrance animations
    fadeAnim.value = withTiming(1, { duration: 600 });
    slideUpAnim.value = withTiming(0, { duration: 600 });
  }, []);
  
  const handleCelebritySelect = (celebrity, isFirst) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isFirst) {
      setFirstCelebrity(celebrity);
      setShowFirstSelection(false);
    } else {
      setSecondCelebrity(celebrity);
      setShowSecondSelection(false);
    }
    
    // Reset comparison result when selecting new celebrities
    setComparisonResult(null);
  };
  
  const handleCompare = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Check if user can access this feature
    if (!isPremium && freeComparisonUsed) {
      setShowPaywall(true);
      return;
    }
    
    // Animate button press
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // Check if both celebrities are selected
    if (!firstCelebrity || !secondCelebrity) {
      return;
    }
    
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Generate mock comparison result
      const first = firstCelebrity;
      const second = secondCelebrity;
      
      const firstScore = first.beautyScore;
      const secondScore = second.beautyScore;
      const scoreDiff = Math.abs(firstScore - secondScore);
      
      let leagueStatus;
      let winner;
      
      if (scoreDiff < 0.05) {
        leagueStatus = "in_your_league";
        winner = "tie";
      } else if (firstScore > secondScore) {
        winner = "first";
        if (scoreDiff > 0.2) {
          leagueStatus = "way_beyond";
        } else if (scoreDiff > 0.1) {
          leagueStatus = "out_of_league";
        } else {
          leagueStatus = "slightly_above";
        }
      } else {
        winner = "second";
        if (scoreDiff > 0.2) {
          leagueStatus = "way_beyond";
        } else if (scoreDiff > 0.1) {
          leagueStatus = "out_of_league";
        } else {
          leagueStatus = "slightly_above";
        }
      }
      
      setComparisonResult({
        firstCelebrity: first,
        secondCelebrity: second,
        firstScore: Math.round(firstScore * 10),
        secondScore: Math.round(secondScore * 10),
        winner,
        leagueStatus,
        features: [
          { name: "Facial Symmetry", first: Math.round(Math.random() * 3 + 7), second: Math.round(Math.random() * 3 + 7) },
          { name: "Jawline", first: Math.round(Math.random() * 3 + 7), second: Math.round(Math.random() * 3 + 7) },
          { name: "Eyes", first: Math.round(Math.random() * 3 + 7), second: Math.round(Math.random() * 3 + 7) },
          { name: "Skin", first: Math.round(Math.random() * 3 + 7), second: Math.round(Math.random() * 3 + 7) },
        ]
      });
      
      // Animate result appearance
      fadeAnim.value = withTiming(1, { duration: 800 });
      resultScale.value = withSpring(1, { damping: 15 });
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 1500);
  };
  
  const getComparisonText = () => {
    if (!comparisonResult) return "";
    
    const { winner, firstCelebrity, secondCelebrity, leagueStatus } = comparisonResult;
    
    if (winner === "tie") {
      return `${firstCelebrity.name} and ${secondCelebrity.name} are equally matched!`;
    } else if (winner === "first") {
      switch (leagueStatus) {
        case "way_beyond":
          return `${firstCelebrity.name} is way beyond ${secondCelebrity.name}'s league!`;
        case "out_of_league":
          return `${firstCelebrity.name} is out of ${secondCelebrity.name}'s league`;
        case "slightly_above":
          return `${firstCelebrity.name} is slightly above ${secondCelebrity.name}'s league`;
        default:
          return `${firstCelebrity.name} is more attractive than ${secondCelebrity.name}`;
      }
    } else {
      switch (leagueStatus) {
        case "way_beyond":
          return `${secondCelebrity.name} is way beyond ${firstCelebrity.name}'s league!`;
        case "out_of_league":
          return `${secondCelebrity.name} is out of ${firstCelebrity.name}'s league`;
        case "slightly_above":
          return `${secondCelebrity.name} is slightly above ${firstCelebrity.name}'s league`;
        default:
          return `${secondCelebrity.name} is more attractive than ${firstCelebrity.name}`;
      }
    }
  };
  
  const renderCelebritySelection = (isFirst) => {
    const selectedCelebrity = isFirst ? firstCelebrity : secondCelebrity;
    
    return (
      <TouchableOpacity 
        style={[styles.selectionCard, { backgroundColor: colors.card }]}
        onPress={() => isFirst ? setShowFirstSelection(true) : setShowSecondSelection(true)}
      >
        {selectedCelebrity ? (
          <View style={styles.selectedCelebrity}>
            <Image
              source={{ uri: selectedCelebrity.image }}
              style={styles.selectedImage}
              contentFit="cover"
            />
            <View style={styles.selectedInfo}>
              <Text style={[styles.selectedName, { color: colors.text }]}>
                {selectedCelebrity.name}
              </Text>
              <Text style={[styles.selectedCategory, { color: colors.textLight }]}>
                {selectedCelebrity.category.charAt(0).toUpperCase() + selectedCelebrity.category.slice(1)}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.changeButton, { backgroundColor: colors.primary + "20" }]}
              onPress={() => isFirst ? setShowFirstSelection(true) : setShowSecondSelection(true)}
            >
              <RefreshCw size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptySelection}>
            <View style={[styles.emptyImagePlaceholder, { backgroundColor: colors.border }]}>
              <Text style={[styles.emptyImageText, { color: colors.textLight }]}>
                {isFirst ? "1" : "2"}
              </Text>
            </View>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              Select {isFirst ? "First" : "Second"} Celebrity
            </Text>
            <ChevronRight size={20} color={colors.textLight} />
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  const renderCelebrityList = (isFirst) => {
    return (
      <View style={[styles.selectionModal, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.card }]} 
            onPress={() => isFirst ? setShowFirstSelection(false) : setShowSecondSelection(false)}
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Select {isFirst ? "First" : "Second"} Celebrity
          </Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.celebritiesList} contentContainerStyle={styles.celebritiesListContent}>
          {celebrities.map((celebrity) => (
            <TouchableOpacity
              key={celebrity.id}
              style={[styles.celebrityListItem, { backgroundColor: colors.card }]}
              onPress={() => handleCelebritySelect(celebrity, isFirst)}
            >
              <Image
                source={{ uri: celebrity.image }}
                style={styles.celebrityListImage}
                contentFit="cover"
              />
              <View style={styles.celebrityListInfo}>
                <Text style={[styles.celebrityListName, { color: colors.text }]}>
                  {celebrity.name}
                </Text>
                <Text style={[styles.celebrityListCategory, { color: colors.textLight }]}>
                  {celebrity.category.charAt(0).toUpperCase() + celebrity.category.slice(1)}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      {showFirstSelection ? (
        renderCelebrityList(true)
      ) : showSecondSelection ? (
        renderCelebrityList(false)
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity 
              style={[styles.backButton, { backgroundColor: colors.card }]} 
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Compare{" "}
              <Text style={[styles.headerTitleAccent, { color: colors.primary }]}>Celebrities</Text>
            </Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            <Animated.View style={[styles.instructionsContainer, animatedFadeStyle]}>
              <Text style={[styles.instructions, { color: colors.text }]}>
                Select two celebrities to compare their beauty scores
              </Text>
            </Animated.View>
            
            <Animated.View style={[styles.selectionsContainer, animatedFadeStyle]}>
              {renderCelebritySelection(true)}
              <View style={styles.vsContainer}>
                <View style={[styles.vsCircle, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.vsText, { color: colors.background }]}>VS</Text>
                </View>
              </View>
              {renderCelebritySelection(false)}
            </Animated.View>
            
            <Animated.View style={[styles.compareButtonContainer, animatedButtonStyle]}>
              <TouchableOpacity
                style={[
                  styles.compareButton,
                  { backgroundColor: colors.primary },
                  (!firstCelebrity || !secondCelebrity) && { opacity: 0.6 }
                ]}
                onPress={handleCompare}
                disabled={!firstCelebrity || !secondCelebrity || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.background} />
                ) : (
                  <Text style={[styles.compareButtonText, { color: colors.background }]}>
                    Compare Celebrities
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
            
            {comparisonResult && (
              <Animated.View style={[styles.resultContainer, animatedResultStyle]}>
                <LinearGradient
                  colors={[colors.secondary, colors.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.resultCard}
                >
                  <Text style={[styles.resultTitle, { color: colors.background }]}>
                    {getComparisonText()}
                  </Text>
                  
                  <View style={styles.resultImagesContainer}>
                    <View style={styles.resultImageColumn}>
                      <Image
                        source={{ uri: comparisonResult.firstCelebrity.image }}
                        style={[styles.resultImage, { borderColor: colors.background }]}
                        contentFit="cover"
                      />
                      <Text style={[styles.resultImageName, { color: colors.background }]}>
                        {comparisonResult.firstCelebrity.name}
                      </Text>
                      <Text style={[styles.resultScore, { color: colors.background }]}>
                        {comparisonResult.firstScore}/10
                      </Text>
                    </View>
                    
                    <View style={styles.resultVsContainer}>
                      <Text style={[styles.resultVsText, { color: colors.background }]}>VS</Text>
                    </View>
                    
                    <View style={styles.resultImageColumn}>
                      <Image
                        source={{ uri: comparisonResult.secondCelebrity.image }}
                        style={[styles.resultImage, { borderColor: colors.background }]}
                        contentFit="cover"
                      />
                      <Text style={[styles.resultImageName, { color: colors.background }]}>
                        {comparisonResult.secondCelebrity.name}
                      </Text>
                      <Text style={[styles.resultScore, { color: colors.background }]}>
                        {comparisonResult.secondScore}/10
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
                
                <View style={styles.gaugeContainer}>
                  <LeagueGauge leagueStatus={comparisonResult.leagueStatus} />
                </View>
                
                {isPremium && (
                  <View style={[styles.featuresContainer, { backgroundColor: colors.card }]}>
                    <Text style={[styles.featuresTitle, { color: colors.text }]}>
                      Detailed Comparison
                    </Text>
                    
                    <View style={styles.featuresHeader}>
                      <Text style={[styles.featuresHeaderText, { color: colors.textLight }]}>Feature</Text>
                      <Text style={[styles.featuresHeaderText, { color: colors.textLight }]}>
                        {comparisonResult.firstCelebrity.name}
                      </Text>
                      <Text style={[styles.featuresHeaderText, { color: colors.textLight }]}>
                        {comparisonResult.secondCelebrity.name}
                      </Text>
                    </View>
                    
                    {comparisonResult.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <Text style={[styles.featureName, { color: colors.text }]}>{feature.name}</Text>
                        <Text 
                          style={[
                            styles.featureScore, 
                            { color: feature.first >= feature.second ? colors.primary : colors.text }
                          ]}
                        >
                          {feature.first}/10
                        </Text>
                        <Text 
                          style={[
                            styles.featureScore, 
                            { color: feature.second >= feature.first ? colors.primary : colors.text }
                          ]}
                        >
                          {feature.second}/10
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                
                <TouchableOpacity
                  style={[styles.newComparisonButton, { backgroundColor: colors.card }]}
                  onPress={() => {
                    setFirstCelebrity(null);
                    setSecondCelebrity(null);
                    setComparisonResult(null);
                  }}
                >
                  <Text style={[styles.newComparisonButtonText, { color: colors.primary }]}>
                    New Comparison
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </ScrollView>
        </>
      )}
      
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    fontWeight: "800",
  },
  headerTitleAccent: {
    // Color applied dynamically
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  instructionsContainer: {
    marginBottom: 24,
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  selectionsContainer: {
    marginBottom: 24,
  },
  selectionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCelebrity: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  selectedInfo: {
    flex: 1,
    marginLeft: 16,
  },
  selectedName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  selectedCategory: {
    fontSize: 14,
  },
  changeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptySelection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
  emptyImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImageText: {
    fontSize: 24,
    fontWeight: "700",
  },
  emptyText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 16,
  },
  vsContainer: {
    alignItems: "center",
    marginVertical: -8,
    zIndex: 10,
  },
  vsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  vsText: {
    fontSize: 16,
    fontWeight: "800",
  },
  compareButtonContainer: {
    marginBottom: 24,
  },
  compareButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  compareButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  selectionModal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  celebritiesList: {
    flex: 1,
  },
  celebritiesListContent: {
    padding: 16,
  },
  celebrityListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  celebrityListImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  celebrityListInfo: {
    flex: 1,
    marginLeft: 12,
  },
  celebrityListName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  celebrityListCategory: {
    fontSize: 14,
  },
  resultContainer: {
    marginTop: 16,
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  resultImagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultImageColumn: {
    alignItems: "center",
    width: "40%",
  },
  resultImage: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    borderWidth: 3,
  },
  resultImageName: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  resultScore: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
  },
  resultVsContainer: {
    width: "20%",
    alignItems: "center",
  },
  resultVsText: {
    fontSize: 18,
    fontWeight: "800",
  },
  gaugeContainer: {
    marginBottom: 24,
  },
  featuresContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  featuresHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  featuresHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    width: "33%",
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  featureName: {
    fontSize: 14,
    width: "33%",
  },
  featureScore: {
    fontSize: 14,
    fontWeight: "700",
    width: "33%",
    textAlign: "center",
  },
  newComparisonButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  newComparisonButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});