import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Platform, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Volume2, Share2, MessageCircle, Star } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import PaywallModal from "@/components/PaywallModal";
import BottomNavigation from "@/components/BottomNavigation";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

export default function RoastmasterScreen() {
  const router = useRouter();
  const { comparisons, isPremium } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [roast, setRoast] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const latestResult = comparisons[0];
  
  useEffect(() => {
    if (!isPremium) {
      // Don't show paywall immediately, show the example first
      setLoading(false);
      return;
    }
    
    if (latestResult) {
      generateRoast();
    } else {
      setLoading(false);
    }
  }, [latestResult, isPremium]);
  
  const generateRoast = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock roasts - in a real app, this would come from an AI service
      const roasts = [
        "I've seen better-looking faces on a potato. And the potato had more personality too!",
        "Your face is so asymmetrical, it looks like Picasso designed it during his experimental phase.",
        "If beauty were time, you'd be 3:45 AM on a Monday morning.",
        "Your selfie game is so weak, even your phone's front camera is trying to auto-delete.",
        "You're not ugly, you're just... well, let's say you've got a face that's perfect for radio.",
        "I'd roast your looks, but it seems like genetics already did that for me.",
        "Your face has more filters than a Starbucks coffee machine, and still couldn't get the job done.",
        "If you were a spice, you'd be flour. Basic and forgettable.",
        "Your beauty score is like your credit score - technically a number, but nothing to brag about.",
        "I've seen more definition in a foggy mirror than in your jawline."
      ];
      
      // Select a random roast
      const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
      setRoast(randomRoast);
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error generating roast:", error);
      setRoast("Sorry, our AI roastmaster is taking a coffee break. Try again later!");
    } finally {
      setLoading(false);
    }
  };
  
  const handleShare = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      try {
        const result = await Share.share({
          message: `AI Roastmaster says: "${roast}" - Get roasted on League Checker!`,
          title: "AI Roastmaster"
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not available on web");
    }
  };
  
  const handlePlayAudio = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Mock audio playback
    alert("Audio playback would start here in a real app");
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const handleUpgradeToPremium = () => {
    setShowPaywall(true);
  };
  
  // Show premium gating with example if user is not premium
  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Roastmaster</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>
              Get{" "}
              <Text style={styles.exampleTitleAccent}>Roasted</Text>
              {" "}by AI
            </Text>
            <Text style={styles.exampleSubtitle}>
              Our AI will analyze your photo and give you a hilarious roast
            </Text>
            
            {/* Example conversation */}
            <View style={styles.conversationContainer}>
              <View style={styles.messageContainer}>
                <View style={styles.aiAvatar}>
                  <MessageCircle size={16} color={colors.background} />
                </View>
                <View style={styles.aiMessage}>
                  <Text style={styles.aiMessageText}>
                    "I've seen better selfies on a potato cam from 2005. Your face has more blur than a witness protection program!"
                  </Text>
                </View>
              </View>
              
              <View style={styles.messageContainer}>
                <View style={styles.aiAvatar}>
                  <MessageCircle size={16} color={colors.background} />
                </View>
                <View style={styles.aiMessage}>
                  <Text style={styles.aiMessageText}>
                    "If confidence was beauty, you'd still be in trouble. But hey, at least your phone's camera is working overtime!"
                  </Text>
                </View>
              </View>
              
              <View style={styles.messageContainer}>
                <View style={styles.aiAvatar}>
                  <MessageCircle size={16} color={colors.background} />
                </View>
                <View style={styles.aiMessage}>
                  <Text style={styles.aiMessageText}>
                    "Your beauty score is like your WiFi signal - technically there, but barely functional! 😂"
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Premium Roast Features</Text>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🤖</Text>
                <Text style={styles.featureText}>AI-powered personalized roasts</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🔥</Text>
                <Text style={styles.featureText}>Multiple roast styles and intensities</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🎭</Text>
                <Text style={styles.featureText}>Celebrity roast comparisons</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🔊</Text>
                <Text style={styles.featureText}>Audio roasts with different voices</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.ctaContainer}>
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={handleUpgradeToPremium}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <LinearGradient
                colors={[colors.secondary, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.upgradeButtonGradient}
              >
                <Star size={20} color={colors.background} />
                <Text style={styles.upgradeButtonText}>Roast Me Now!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          <Text style={styles.ctaSubtext}>
            Unlock unlimited roasts and premium features
          </Text>
        </View>
        
        <BottomNavigation currentRoute="roast" />
        
        <PaywallModal
          visible={showPaywall}
          onClose={() => setShowPaywall(false)}
        />
      </SafeAreaView>
    );
  }
  
  if (!latestResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Roastmaster</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Photos Found</Text>
          <Text style={styles.emptyMessage}>
            Complete a comparison first to get roasted by our AI
          </Text>
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push("/")}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Text style={styles.buttonText}>Start Comparison</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <BottomNavigation currentRoute="roast" />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Roastmaster</Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: latestResult.user.frontImage || "" }}
            style={styles.userImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.imageGradient}
          />
        </View>
        
        <View style={styles.roastContainer}>
          <View style={styles.roastHeader}>
            <MessageCircle size={24} color={colors.primary} />
            <Text style={styles.roastTitle}>AI Roastmaster Says:</Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Preparing your roast...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.roastText}>{roast}</Text>
              
              <Animated.View style={animatedButtonStyle}>
                <TouchableOpacity 
                  style={styles.audioButton}
                  onPress={handlePlayAudio}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                >
                  <Volume2 size={20} color={colors.background} />
                  <Text style={styles.audioButtonText}>Hear Your Roast</Text>
                </TouchableOpacity>
              </Animated.View>
            </>
          )}
        </View>
        
        {!loading && (
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={styles.generateButton}
              onPress={generateRoast}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Text style={styles.generateButtonText}>Generate Another Roast</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        
        <TouchableOpacity 
          style={styles.shareFullButton}
          onPress={handleShare}
        >
          <Share2 size={20} color={colors.background} />
          <Text style={styles.shareFullButtonText}>Share Your Roast</Text>
        </TouchableOpacity>
        
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimer}>
            Our AI roasts are meant to be humorous and not to be taken seriously.
            We believe everyone is beautiful in their own way!
          </Text>
        </View>
      </ScrollView>
      
      <BottomNavigation currentRoute="roast" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // Space for bottom navigation
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 40,
  },
  exampleContainer: {
    padding: 16,
  },
  exampleTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  exampleTitleAccent: {
    color: colors.primary,
  },
  exampleSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  conversationContainer: {
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
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  aiMessage: {
    flex: 1,
    backgroundColor: colors.primary + "15",
    borderRadius: 12,
    padding: 12,
  },
  aiMessageText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontStyle: "italic",
  },
  featuresContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
  },
  ctaContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  upgradeButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  upgradeButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  upgradeButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: "900",
    marginLeft: 8,
  },
  ctaSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
  },
  imageContainer: {
    height: 300,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  userImage: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.border,
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  roastContainer: {
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roastHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  roastTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textLight,
  },
  roastText: {
    fontSize: 18,
    color: colors.text,
    lineHeight: 28,
    fontStyle: "italic",
    marginBottom: 16,
  },
  audioButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  audioButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  generateButton: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  generateButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  shareFullButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  shareFullButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  disclaimerContainer: {
    margin: 16,
    marginTop: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 18,
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
});