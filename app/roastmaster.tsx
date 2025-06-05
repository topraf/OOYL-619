import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Platform, Share, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Volume2, Share2, MessageCircle, Star, Camera, Upload, X, Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useUserStore } from "@/store/user-store";
import { useComparisonStore } from "@/store/comparison-store";
import PaywallModal from "@/components/PaywallModal";
import BottomNavigation from "@/components/BottomNavigation";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withTiming,
  withRepeat
} from "react-native-reanimated";

export default function RoastmasterScreen() {
  const router = useRouter();
  const { isPremium, getColors } = useUserStore();
  const { history } = useComparisonStore();
  const colors = getColors();
  const [loading, setLoading] = useState(false);
  const [roast, setRoast] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const buttonScale = useSharedValue(1);
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(30);
  const pulseScale = useSharedValue(1);
  const typingDots = useSharedValue(0);
  
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const animatedFadeStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeIn.value,
      transform: [{ translateY: slideUp.value }]
    };
  });
  
  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }]
    };
  });
  
  const latestResult = history[0];
  
  useEffect(() => {
    // Entrance animations
    fadeIn.value = withTiming(1, { duration: 800 });
    slideUp.value = withTiming(0, { duration: 800 });
    
    // Set initial image from latest result if available
    if (latestResult && !selectedImage) {
      setSelectedImage(latestResult.user.frontImage);
    }
  }, [latestResult]);
  
  const pickImage = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need camera roll permissions to select a photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setRoast(""); // Clear previous roast
    }
  };

  const takePhoto = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need camera permissions to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setRoast(""); // Clear previous roast
    }
  };

  const removeImage = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedImage(null);
    setRoast("");
  };
  
  const generateRoast = async () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select or take a photo first.");
      return;
    }
    
    setLoading(true);
    
    // Typing animation
    typingDots.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      false
    );
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const roasts = [
        "I've seen better-looking faces on a potato. And the potato had more personality too! 🥔",
        "Your face is so asymmetrical, it looks like Picasso designed it during his experimental phase. 🎨",
        "If beauty were time, you'd be 3:45 AM on a Monday morning. ⏰",
        "Your selfie game is so weak, even your phone's front camera is trying to auto-delete. 📱",
        "You're not ugly, you're just... well, let's say you've got a face that's perfect for radio. 📻",
        "I'd roast your looks, but it seems like genetics already did that for me. 🧬",
        "Your face has more filters than a Starbucks coffee machine, and still couldn't get the job done. ☕",
        "If you were a spice, you'd be flour. Basic and forgettable. 🌾",
        "Your beauty score is like your credit score - technically a number, but nothing to brag about. 💳",
        "I've seen more definition in a foggy mirror than in your jawline. 🪞"
      ];
      
      const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
      setRoast(randomRoast);
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Celebration animation
      pulseScale.value = withSequence(
        withTiming(1.1, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
      
    } catch (error) {
      console.error("Error generating roast:", error);
      setRoast("Sorry, our AI roastmaster is taking a coffee break. Try again later! ☕");
    } finally {
      setLoading(false);
      typingDots.value = 0;
    }
  };
  
  const handleShare = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    try {
      const result = await Share.share({
        message: `AI Roastmaster says: "${roast}" - Get roasted on League Checker!`,
        title: "AI Roastmaster"
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  
  const handlePlayAudio = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    alert("Audio playback would start here in a real app");
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const handleUpgradeToPremium = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowPaywall(true);
  };
  
  // Show premium gating with example if user is not premium
  if (!isPremium) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.card }]} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>AI Roastmaster</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.exampleContainer, animatedFadeStyle]}>
            <Text style={[styles.exampleTitle, { color: colors.text }]}>
              Get{" "}
              <Text style={[styles.exampleTitleAccent, { color: colors.primary }]}>Roasted</Text>
              {" "}by AI
            </Text>
            <Text style={[styles.exampleSubtitle, { color: colors.textLight }]}>
              Our AI will analyze your photo and give you a hilarious roast
            </Text>
            
            <Animated.View style={[styles.conversationContainer, { backgroundColor: colors.card }, animatedPulseStyle]}>
              <View style={styles.messageContainer}>
                <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
                  <MessageCircle size={16} color={colors.background} />
                </View>
                <View style={[styles.aiMessage, { backgroundColor: colors.primary + "15" }]}>
                  <Text style={[styles.aiMessageText, { color: colors.text }]}>
                    "I've seen better selfies on a potato cam from 2005. Your face has more blur than a witness protection program! 📸"
                  </Text>
                </View>
              </View>
              
              <View style={styles.messageContainer}>
                <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
                  <MessageCircle size={16} color={colors.background} />
                </View>
                <View style={[styles.aiMessage, { backgroundColor: colors.primary + "15" }]}>
                  <Text style={[styles.aiMessageText, { color: colors.text }]}>
                    "If confidence was beauty, you'd still be in trouble. But hey, at least your phone's camera is working overtime! 💪"
                  </Text>
                </View>
              </View>
              
              <View style={styles.messageContainer}>
                <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
                  <MessageCircle size={16} color={colors.background} />
                </View>
                <View style={[styles.aiMessage, { backgroundColor: colors.primary + "15" }]}>
                  <Text style={[styles.aiMessageText, { color: colors.text }]}>
                    "Your beauty score is like your WiFi signal - technically there, but barely functional! 😂"
                  </Text>
                </View>
              </View>
            </Animated.View>
            
            <View style={[styles.featuresContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.featuresTitle, { color: colors.text }]}>Premium Roast Features</Text>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🤖</Text>
                <Text style={[styles.featureText, { color: colors.text }]}>AI-powered personalized roasts</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🔥</Text>
                <Text style={[styles.featureText, { color: colors.text }]}>Multiple roast styles and intensities</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🎭</Text>
                <Text style={[styles.featureText, { color: colors.text }]}>Celebrity roast comparisons</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🔊</Text>
                <Text style={[styles.featureText, { color: colors.text }]}>Audio roasts with different voices</Text>
              </View>
            </View>
          </Animated.View>
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
                <Text style={[styles.upgradeButtonText, { color: colors.background }]}>Roast Me Now!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          <Text style={[styles.ctaSubtext, { color: colors.textLight }]}>
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
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.card }]} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>AI Roastmaster</Text>
          {roast && (
            <TouchableOpacity 
              style={[styles.shareButton, { backgroundColor: colors.card }]} 
              onPress={handleShare}
            >
              <Share2 size={20} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
        
        <Animated.View style={[styles.imageSection, animatedFadeStyle]}>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.userImage}
                contentFit="cover"
              />
              <TouchableOpacity 
                style={[styles.removeImageButton, { backgroundColor: colors.error }]}
                onPress={removeImage}
              >
                <X size={16} color={colors.background} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.placeholderContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.placeholderText, { color: colors.textLight }]}>
                Select a photo to get roasted
              </Text>
            </View>
          )}
          
          <View style={styles.imageActions}>
            <TouchableOpacity 
              style={[styles.imageActionButton, { backgroundColor: colors.card }]}
              onPress={takePhoto}
            >
              <Camera size={20} color={colors.primary} />
              <Text style={[styles.imageActionText, { color: colors.text }]}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.imageActionButton, { backgroundColor: colors.card }]}
              onPress={pickImage}
            >
              <Upload size={20} color={colors.primary} />
              <Text style={[styles.imageActionText, { color: colors.text }]}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {selectedImage && (
          <Animated.View style={[styles.roastContainer, { backgroundColor: colors.card }, animatedPulseStyle]}>
            <View style={styles.roastHeader}>
              <MessageCircle size={24} color={colors.primary} />
              <Text style={[styles.roastTitle, { color: colors.text }]}>AI Roastmaster Says:</Text>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textLight }]}>Preparing your roast...</Text>
                <View style={styles.typingIndicator}>
                  <Text style={[styles.typingDots, { color: colors.primary }]}>●●●</Text>
                </View>
              </View>
            ) : roast ? (
              <>
                <Text style={[styles.roastText, { color: colors.text }]}>{roast}</Text>
                
                <Animated.View style={animatedButtonStyle}>
                  <TouchableOpacity 
                    style={[styles.audioButton, { backgroundColor: colors.primary }]}
                    onPress={handlePlayAudio}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                  >
                    <Volume2 size={20} color={colors.background} />
                    <Text style={[styles.audioButtonText, { color: colors.background }]}>Hear Your Roast</Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : (
              <Text style={[styles.noRoastText, { color: colors.textLight }]}>
                Tap "Generate Roast" to get roasted by our AI!
              </Text>
            )}
          </Animated.View>
        )}
        
        {selectedImage && (
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={[styles.generateButton, { backgroundColor: colors.primary }]}
              onPress={generateRoast}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              disabled={loading}
            >
              <Text style={[styles.generateButtonText, { color: colors.background }]}>
                {loading ? "Generating..." : roast ? "Generate Another Roast" : "Generate Roast"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        
        <View style={styles.disclaimerContainer}>
          <Text style={[styles.disclaimer, { color: colors.textLight }]}>
            Our AI roasts are meant to be humorous and not to be taken seriously.
            We believe everyone is beautiful in their own way! ✨
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 40,
  },
  imageSection: {
    padding: 16,
  },
  imageContainer: {
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  userImage: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderContainer: {
    height: 300,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "500",
  },
  imageActions: {
    flexDirection: "row",
    gap: 12,
  },
  imageActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageActionText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  exampleContainer: {
    padding: 16,
  },
  exampleTitle: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  exampleTitleAccent: {
    // Color applied dynamically
  },
  exampleSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  conversationContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "rgba(0, 0, 0, 0.1)",
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  aiMessage: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
  },
  aiMessageText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
  },
  featuresContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "700",
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
  },
  ctaContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  upgradeButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "rgba(0, 0, 0, 0.1)",
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
    fontSize: 18,
    fontWeight: "900",
    marginLeft: 8,
  },
  ctaSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  roastContainer: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
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
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  typingIndicator: {
    marginTop: 12,
  },
  typingDots: {
    fontSize: 20,
    fontWeight: "bold",
  },
  roastText: {
    fontSize: 18,
    lineHeight: 28,
    fontStyle: "italic",
    marginBottom: 16,
  },
  noRoastText: {
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
    padding: 24,
  },
  audioButton: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  audioButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  generateButton: {
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimerContainer: {
    margin: 16,
    marginTop: 8,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});