/**
 * Celebrity Lookalike Screen
 * 
 * This screen allows users to find their celebrity lookalikes.
 * Users can:
 * 1. Upload their photo
 * 2. Get AI-powered analysis to find celebrity matches
 * 3. View a ranked list of celebrities they resemble
 * 4. See detailed similarity scores and features
 * 
 * The screen includes:
 * - Photo upload/capture functionality
 * - AI analysis visualization
 * - Results display with multiple celebrity matches
 * - Similarity breakdown by facial features
 * - Premium features with appropriate paywalls
 * 
 * Note: This is a placeholder for a future feature.
 */

import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Camera, Upload, Construction } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUserStore } from "@/store/user-store";
import PaywallModal from "@/components/PaywallModal";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

export default function CelebrityLookalikeScreen() {
  const router = useRouter();
  const { isPremium, freeComparisonUsed, getColors } = useUserStore();
  const colors = getColors();
  
  const [showPaywall, setShowPaywall] = useState(false);
  
  const fadeAnim = useSharedValue(0);
  const slideUpAnim = useSharedValue(20);
  
  const animatedFadeStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideUpAnim.value }],
    };
  });
  
  React.useEffect(() => {
    // Entrance animations
    fadeAnim.value = withTiming(1, { duration: 600 });
    slideUpAnim.value = withTiming(0, { duration: 600 });
  }, []);
  
  const handleFeatureAccess = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Check if user can access this feature
    if (!isPremium && freeComparisonUsed) {
      setShowPaywall(true);
    } else {
      // This would normally start the lookalike process
      alert("This feature is coming soon!");
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.card }]} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Find Your{" "}
          <Text style={[styles.headerTitleAccent, { color: colors.primary }]}>Lookalike</Text>
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Animated.View style={[styles.comingSoonContainer, animatedFadeStyle]}>
          <LinearGradient
            colors={[colors.secondary, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.comingSoonCard}
          >
            <Construction size={64} color={colors.background} />
            <Text style={[styles.comingSoonTitle, { color: colors.background }]}>
              Coming Soon!
            </Text>
            <Text style={[styles.comingSoonDescription, { color: colors.background }]}>
              We're working hard to bring you this exciting feature. 
              Soon you'll be able to discover which celebrities you look like!
            </Text>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View style={[styles.featurePreviewContainer, animatedFadeStyle]}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>
            How It Will Work
          </Text>
          
          <View style={[styles.featureStep, { backgroundColor: colors.card }]}>
            <View style={[styles.stepNumberContainer, { backgroundColor: colors.primary }]}>
              <Text style={[styles.stepNumber, { color: colors.background }]}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Upload Your Photo</Text>
              <Text style={[styles.stepDescription, { color: colors.textLight }]}>
                Take a selfie or upload your best photo
              </Text>
            </View>
          </View>
          
          <View style={[styles.featureStep, { backgroundColor: colors.card }]}>
            <View style={[styles.stepNumberContainer, { backgroundColor: colors.primary }]}>
              <Text style={[styles.stepNumber, { color: colors.background }]}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>AI Analysis</Text>
              <Text style={[styles.stepDescription, { color: colors.textLight }]}>
                Our AI will analyze your facial features
              </Text>
            </View>
          </View>
          
          <View style={[styles.featureStep, { backgroundColor: colors.card }]}>
            <View style={[styles.stepNumberContainer, { backgroundColor: colors.primary }]}>
              <Text style={[styles.stepNumber, { color: colors.background }]}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Find Matches</Text>
              <Text style={[styles.stepDescription, { color: colors.textLight }]}>
                See which celebrities you resemble the most
              </Text>
            </View>
          </View>
        </Animated.View>
        
        <Animated.View style={[styles.actionContainer, animatedFadeStyle]}>
          <TouchableOpacity 
            style={[styles.notifyButton, { backgroundColor: colors.primary }]}
            onPress={handleFeatureAccess}
          >
            <Text style={[styles.notifyButtonText, { color: colors.background }]}>
              Notify Me When Available
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.disclaimerText, { color: colors.textLight }]}>
            This premium feature will be available to all subscribers as soon as it launches.
          </Text>
        </Animated.View>
      </ScrollView>
      
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
  comingSoonContainer: {
    marginBottom: 32,
  },
  comingSoonCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 12,
  },
  comingSoonDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.9,
  },
  featurePreviewContainer: {
    marginBottom: 32,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },
  featureStep: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "700",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionContainer: {
    alignItems: "center",
  },
  notifyButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  notifyButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  disclaimerText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});