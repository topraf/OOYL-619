import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Camera, Star, MessageCircle, Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import ImagePreview from "@/components/ImagePreview";
import PaywallModal from "@/components/PaywallModal";
import BottomNavigation from "@/components/BottomNavigation";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { user, freeComparisonUsed, isPremium, getColors } = useUserStore();
  const [showPaywall, setShowPaywall] = useState(false);
  
  const buttonScale = useSharedValue(1);
  const cardScale = useSharedValue(1);
  const fadeIn = useSharedValue(0);
  
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
  
  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 800 });
  }, []);
  
  const handleTakePhoto = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    router.push("/user-photo");
  };
  
  const handleCelebrityComparison = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isPremium || !freeComparisonUsed) {
      router.push("/celebrities");
    } else {
      setShowPaywall(true);
    }
  };
  
  const handleAIRoast = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isPremium || !freeComparisonUsed) {
      router.push("/roastmaster");
    } else {
      setShowPaywall(true);
    }
  };
  
  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            League{" "}
            <Text style={styles.titleAccent}>Checker</Text>
          </Text>
          <Text style={styles.subtitle}>
            Find out if someone is in your league using AI
          </Text>
        </View>
        
        {user.frontImage && (
          <Animated.View style={[styles.userPhotoContainer, animatedCardStyle]}>
            <ImagePreview
              uri={user.frontImage}
              label="Your Photo"
              style={styles.userPhoto}
            />
          </Animated.View>
        )}
        
        <View style={styles.actionsContainer}>
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={styles.mainAction}
              onPress={handleTakePhoto}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <LinearGradient
                colors={colors.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainActionGradient}
              >
                <Camera size={32} color={colors.background} />
                <Text style={styles.mainActionText}>Start League Check</Text>
                <Text style={styles.mainActionSubtext}>
                  {user.frontImage ? "Retake your photo" : "Take your photo first"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.secondaryActions}>
            <Animated.View style={[styles.secondaryActionContainer, animatedCardStyle]}>
              <TouchableOpacity 
                style={styles.secondaryAction}
                onPress={handleCelebrityComparison}
              >
                <LinearGradient
                  colors={colors.gradientSecondary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.secondaryActionGradient}
                >
                  <View style={styles.plusIcon}>
                    <Plus size={20} color={colors.background} />
                  </View>
                  <Image
                    source={{ uri: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face" }}
                    style={styles.actionImage}
                  />
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>Celebrities</Text>
                    <Text style={styles.actionSubtitle}>Compare with famous people</Text>
                  </View>
                  {(!isPremium && freeComparisonUsed) && (
                    <View style={styles.premiumBadge}>
                      <Star size={12} color={colors.background} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={[styles.secondaryActionContainer, animatedCardStyle]}>
              <TouchableOpacity 
                style={styles.secondaryAction}
                onPress={handleAIRoast}
              >
                <LinearGradient
                  colors={["#FF4081", "#E91E63"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.secondaryActionGradient}
                >
                  <View style={styles.plusIcon}>
                    <Plus size={20} color={colors.background} />
                  </View>
                  <Image
                    source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" }}
                    style={styles.actionImage}
                  />
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>AI Roast</Text>
                    <Text style={styles.actionSubtitle}>Get roasted by our AI</Text>
                  </View>
                  {(!isPremium && freeComparisonUsed) && (
                    <View style={styles.premiumBadge}>
                      <Star size={12} color={colors.background} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>
            How It{" "}
            <Text style={styles.featuresTitleAccent}>Works</Text>
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.primary + "20" }]}>
                <Text style={styles.featureNumber}>1</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Take Your Photo</Text>
                <Text style={styles.featureDescription}>Upload a clear front-facing photo</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.primary + "20" }]}>
                <Text style={styles.featureNumber}>2</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Choose Target</Text>
                <Text style={styles.featureDescription}>Select who you want to compare with</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.primary + "20" }]}>
                <Text style={styles.featureNumber}>3</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Get Results</Text>
                <Text style={styles.featureDescription}>See if they are in your league!</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <BottomNavigation currentRoute="home" />
      
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  header: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 22,
  },
  userPhotoContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  userPhoto: {
    height: 200,
    borderRadius: 16,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  mainAction: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainActionGradient: {
    padding: 24,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  mainActionText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.background,
    marginTop: 12,
    marginBottom: 4,
  },
  mainActionSubtext: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.9,
  },
  secondaryActions: {
    gap: 16,
  },
  secondaryActionContainer: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryAction: {
    position: "relative",
  },
  secondaryActionGradient: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 80,
    position: "relative",
  },
  plusIcon: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  actionImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.background,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.9,
  },
  premiumBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  featuresContainer: {
    paddingHorizontal: 24,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  featuresTitleAccent: {
    color: colors.primary,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 18,
  },
});