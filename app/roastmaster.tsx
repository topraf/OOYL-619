import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Camera, Upload, Trash2, Zap } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import ImagePreview from "@/components/ImagePreview";
import CameraView from "@/components/CameraView";
import PaywallModal from "@/components/PaywallModal";
import BottomNavigation from "@/components/BottomNavigation";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

export default function RoastMasterScreen() {
  const router = useRouter();
  const { user, freeComparisonUsed, isPremium } = useUserStore();
  const [roastImage, setRoastImage] = useState<string | null>(user.frontImage);
  const [showCamera, setShowCamera] = useState(false);
  const [roastResult, setRoastResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const handleTakePhoto = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowCamera(true);
  };
  
  const handleCaptureComplete = (uri: string) => {
    setRoastImage(uri);
    setShowCamera(false);
    setRoastResult(null); // Clear previous roast
  };
  
  const handlePickImage = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setRoastImage(result.assets[0].uri);
      setRoastResult(null); // Clear previous roast
    }
  };
  
  const handleRemovePhoto = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setRoastImage(null);
    setRoastResult(null);
  };
  
  const handleGetRoasted = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    if (freeComparisonUsed && !isPremium) {
      setShowPaywall(true);
      return;
    }
    
    if (!roastImage) return;
    
    setIsLoading(true);
    
    try {
      // Simulate AI roast generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const roasts = [
        "I've seen more personality in a stock photo. At least those people are getting paid to look that bland! 😴",
        "Your selfie game is so weak, even your front camera is trying to flip to the back! 📸",
        "I'd roast you harder, but I'm afraid you might actually melt. That filter is working overtime! 🔥",
        "Your photo screams 'I peaked in high school' louder than your yearbook quote! 📚",
        "I've seen more life in a mannequin. At least they have better posture! 🤖",
        "Your smile says 'confident' but your eyes say 'please validate me on social media'! 👀",
        "That lighting is doing more heavy lifting than a gym membership you definitely don't have! 💪",
        "I'd say you're photogenic, but that would require you to actually show up in the photo! 👻"
      ];
      
      const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
      setRoastResult(randomRoast);
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error generating roast:", error);
      setRoastResult("Even our AI is speechless... and that's saying something! 🤐");
    } finally {
      setIsLoading(false);
    }
  };
  
  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };
  
  if (showCamera) {
    return (
      <CameraView
        onCapture={handleCaptureComplete}
        onCancel={() => setShowCamera(false)}
      />
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          AI{" "}
          <Text style={styles.titleAccent}>Roast</Text>
          {" "}Master
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.warningContainer}>
          <LinearGradient
            colors={["#FF4081", "#E91E63"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.warningGradient}
          >
            <Zap size={24} color={colors.background} />
            <Text style={styles.warningTitle}>Warning: Brutal Honesty Ahead!</Text>
            <Text style={styles.warningText}>
              Our AI doesn't hold back. Prepare for some savage roasting! 🔥
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.photoSection}>
          {roastImage ? (
            <View style={styles.imageContainer}>
              <ImagePreview
                uri={roastImage}
                label="Ready to be roasted"
                onRemove={handleRemovePhoto}
                style={styles.previewImage}
              />
              <View style={styles.imageActions}>
                <TouchableOpacity 
                  style={styles.imageAction}
                  onPress={handleTakePhoto}
                >
                  <Camera size={20} color={colors.primary} />
                  <Text style={styles.imageActionText}>Retake</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.imageAction}
                  onPress={handlePickImage}
                >
                  <Upload size={20} color={colors.primary} />
                  <Text style={styles.imageActionText}>Upload New</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.imageAction}
                  onPress={handleRemovePhoto}
                >
                  <Trash2 size={20} color={colors.error} />
                  <Text style={[styles.imageActionText, { color: colors.error }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.photoOptions}>
              <TouchableOpacity 
                style={styles.photoOption}
                onPress={handleTakePhoto}
              >
                <LinearGradient
                  colors={colors.gradientPrimary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.photoOptionGradient}
                >
                  <Camera size={32} color={colors.background} />
                  <Text style={styles.photoOptionText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.photoOption}
                onPress={handlePickImage}
              >
                <LinearGradient
                  colors={colors.gradientSecondary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.photoOptionGradient}
                >
                  <Upload size={32} color={colors.background} />
                  <Text style={styles.photoOptionText}>Upload Photo</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {roastResult && (
          <View style={styles.roastContainer}>
            <LinearGradient
              colors={colors.gradientCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.roastGradient}
            >
              <Text style={styles.roastTitle}>🔥 AI Roast Results 🔥</Text>
              <Text style={styles.roastText}>{roastResult}</Text>
            </LinearGradient>
          </View>
        )}
        
        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>
            Roasting{" "}
            <Text style={styles.tipTitleAccent}>Tips:</Text>
          </Text>
          <Text style={styles.tipText}>🎭 It's all in good fun - don't take it personally!</Text>
          <Text style={styles.tipText}>📸 Clear photos get better (worse?) roasts</Text>
          <Text style={styles.tipText}>😂 Share with friends for maximum laughs</Text>
          <Text style={styles.tipText}>🔄 Try different photos for variety</Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity 
            style={[styles.roastButton, !roastImage && styles.disabledButton]}
            onPress={handleGetRoasted}
            disabled={!roastImage || isLoading}
            onPressIn={roastImage && !isLoading ? onPressIn : undefined}
            onPressOut={roastImage && !isLoading ? onPressOut : undefined}
          >
            <LinearGradient
              colors={roastImage && !isLoading ? ["#FF4081", "#E91E63"] : [colors.card, colors.card]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.roastButtonGradient}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Zap size={20} color={roastImage ? colors.background : colors.textLight} />
              )}
              <Text style={[
                styles.roastButtonText, 
                !roastImage && styles.disabledButtonText
              ]}>
                {isLoading ? "Preparing Roast..." : "Get Roasted!"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        {!roastImage && (
          <Text style={styles.footerText}>
            Add a photo to get roasted by our AI
          </Text>
        )}
        
        {roastImage && freeComparisonUsed && !isPremium && (
          <Text style={styles.premiumFooterText}>
            This will use your premium roast
          </Text>
        )}
      </View>
      
      <BottomNavigation currentRoute="roastmaster" />
      
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSuccess={handleGetRoasted}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
  titleAccent: {
    color: colors.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  warningContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  warningGradient: {
    padding: 16,
    alignItems: "center",
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.background,
    marginTop: 8,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: colors.background,
    textAlign: "center",
    opacity: 0.9,
  },
  photoSection: {
    padding: 16,
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: "center",
  },
  previewImage: {
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  imageAction: {
    alignItems: "center",
    padding: 8,
  },
  imageActionText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
    fontWeight: "600",
  },
  photoOptions: {
    gap: 16,
  },
  photoOption: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  photoOptionGradient: {
    padding: 20,
    alignItems: "center",
    minHeight: 100,
    justifyContent: "center",
  },
  photoOptionText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.background,
    marginTop: 8,
  },
  roastContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  roastGradient: {
    padding: 20,
  },
  roastTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  roastText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: "center",
  },
  tipContainer: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },
  tipTitleAccent: {
    color: colors.primary,
  },
  tipText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  roastButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  roastButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  roastButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.background,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButtonText: {
    color: colors.textLight,
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    marginTop: 8,
  },
  premiumFooterText: {
    fontSize: 12,
    color: colors.primary,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
});