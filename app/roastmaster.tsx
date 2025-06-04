import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Camera, Trash2, Zap } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform as RNPlatform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useUserStore } from "@/store/user-store";
import BottomNavigation from "@/components/BottomNavigation";
import PaywallModal from "@/components/PaywallModal";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";

export default function RoastmasterScreen() {
  const router = useRouter();
  const { isPremium, getColors } = useUserStore();
  const colors = getColors();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [roastText, setRoastText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(50);
  const buttonScale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: slideUp.value }],
      opacity: fadeIn.value,
    };
  });
  
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });

  useEffect(() => {
    if (!isPremium) {
      setShowPaywall(true);
    }
    
    // Entrance animation
    fadeIn.value = withTiming(1, { duration: 800 });
    slideUp.value = withTiming(0, { duration: 800 });
  }, [isPremium]);

  const pickImage = async () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need camera roll permissions to select your photo.");
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
      setRoastText(""); // Clear previous roast
    }
  };

  const takePhoto = async () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need camera permissions to take your photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setRoastText(""); // Clear previous roast
    }
  };

  const deleteImage = () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setSelectedImage(null);
    setRoastText("");
  };

  const generateRoast = async () => {
    if (!selectedImage) {
      Alert.alert("No image", "Please select or take a photo first.");
      return;
    }
    
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }

    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    buttonScale.value = withSpring(0.95);
    setTimeout(() => {
      buttonScale.value = withSpring(1);
    }, 150);

    setIsLoading(true);
    
    try {
      // Simulate AI roast generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const roasts = [
        "I've seen more personality in a stock photo. At least those people are getting paid to look that bland.",
        "You look like you'd ask for the manager at a self-checkout machine.",
        "Your face has the same energy as elevator music - technically present but completely forgettable.",
        "I bet you're the type of person who says 'living the dream' when someone asks how you're doing.",
        "You look like you'd get excited about a new flavor of yogurt.",
        "Your style screams 'I peaked in high school' but your face whispers 'I was homeschooled.'",
        "You have the kind of face that makes people say 'oh, you have a great personality' before they even meet you.",
        "I've seen more life in a Windows screensaver.",
      ];
      
      const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
      setRoastText(randomRoast);
      
    } catch (error) {
      Alert.alert("Error", "Failed to generate roast. Please try again.");
    } finally {
      setIsLoading(false);
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
          AI{" "}
          <Text style={[styles.headerTitleAccent, { color: colors.primary }]}>Roastmaster</Text>
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={animatedStyle}>
          <Text style={[styles.description, { color: colors.textLight }]}>
            Upload your photo and let our AI roast you with no mercy. Are you brave enough?
          </Text>

          <View style={[styles.imageSection, { backgroundColor: colors.card }]}>
            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                <TouchableOpacity 
                  style={[styles.deleteButton, { backgroundColor: colors.error }]}
                  onPress={deleteImage}
                >
                  <Trash2 size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <Camera size={48} color={colors.textLight} />
                <Text style={[styles.placeholderText, { color: colors.textLight }]}>
                  No photo selected
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.card }]}
              onPress={pickImage}
            >
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Choose Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.card }]}
              onPress={takePhoto}
            >
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity 
                style={[styles.roastButton, { opacity: isLoading ? 0.7 : 1 }]}
                onPress={generateRoast}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.roastButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.text} />
                  ) : (
                    <Zap size={24} color={colors.text} />
                  )}
                  <Text style={[styles.roastButtonText, { color: colors.text }]}>
                    {isLoading ? "Generating Roast..." : "Roast Me!"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {roastText && (
            <View style={[styles.roastContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.roastTitle, { color: colors.primary }]}>🔥 Your Roast</Text>
              <Text style={[styles.roastText, { color: colors.text }]}>{roastText}</Text>
            </View>
          )}

          <View style={styles.disclaimer}>
            <Text style={[styles.disclaimerText, { color: colors.textLight }]}>
              ⚠️ This is all in good fun! Our AI generates humorous roasts for entertainment purposes only.
              Don't take it personally - beauty is subjective and everyone is unique! 😊
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      <BottomNavigation currentRoute="roastmaster" />
      
      <PaywallModal
        visible={showPaywall}
        onClose={() => {
          setShowPaywall(false);
          if (!isPremium) {
            router.back();
          }
        }}
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
    padding: 16,
    paddingBottom: 8,
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
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  imageSection: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    minHeight: 200,
    justifyContent: "center",
  },
  imageContainer: {
    position: "relative",
  },
  selectedImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  deleteButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderContainer: {
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  roastButton: {
    borderRadius: 16,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  roastButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  roastButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  roastContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  roastTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  roastText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  disclaimer: {
    marginTop: 16,
  },
  disclaimerText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});