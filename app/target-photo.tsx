import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Camera, Upload, Star } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import CameraView from "@/components/CameraView";
import ImagePreview from "@/components/ImagePreview";
import PaywallModal from "@/components/PaywallModal";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

export default function TargetPhotoScreen() {
  const router = useRouter();
  const { currentTarget, setTargetImage, freeComparisonUsed, isPremium, compareWithTarget } = useUserStore();
  const [showCamera, setShowCamera] = useState(false);
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
    setTargetImage(uri);
    setShowCamera(false);
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
      setTargetImage(result.assets[0].uri);
    }
  };
  
  const handleRemovePhoto = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setTargetImage("");
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
  
  const handleCompare = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (freeComparisonUsed && !isPremium) {
      setShowPaywall(true);
      return;
    }
    
    const result = await compareWithTarget();
    if (result) {
      router.push("/comparison-loading");
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
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Who Are You{" "}
            <Text style={styles.titleAccent}>Comparing</Text>
            {" "}With?
          </Text>
          <Text style={styles.subtitle}>
            Take or upload a photo of the person you want to compare with
          </Text>
        </View>
        
        <View style={styles.photoSection}>
          {currentTarget?.image ? (
            <ImagePreview
              uri={currentTarget.image}
              label="Comparison Target"
              onRemove={handleRemovePhoto}
              style={styles.previewImage}
            />
          ) : (
            <View style={styles.photoOptions}>
              <TouchableOpacity 
                style={styles.photoOption}
                onPress={handleTakePhoto}
              >
                <View style={styles.iconContainer}>
                  <Camera size={24} color={colors.primary} />
                </View>
                <Text style={styles.optionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.photoOption}
                onPress={handlePickImage}
              >
                <View style={styles.iconContainer}>
                  <Upload size={24} color={colors.primary} />
                </View>
                <Text style={styles.optionText}>Upload Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.orLine} />
        </View>
        
        <TouchableOpacity 
          style={styles.celebrityOption}
          onPress={handleCelebrityComparison}
        >
          <LinearGradient
            colors={[colors.secondary, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.celebrityGradient}
          >
            <View style={styles.celebrityContent}>
              <View style={styles.starIconContainer}>
                <Star size={24} color={colors.background} />
              </View>
              <View>
                <Text style={styles.celebrityTitle}>Compare with Celebrities</Text>
                <Text style={styles.celebritySubtitle}>
                  Choose from our database of famous people
                </Text>
              </View>
            </View>
            
            {(!isPremium && freeComparisonUsed) && (
              <View style={styles.premiumBadge}>
                <Star size={12} color={colors.background} />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>
            For{" "}
            <Text style={styles.tipTitleAccent}>Best Results:</Text>
          </Text>
          <Text style={styles.tipText}>📸 Use a clear, front-facing photo</Text>
          <Text style={styles.tipText}>💡 Ensure good lighting</Text>
          <Text style={styles.tipText}>😐 Choose a photo with neutral expression</Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity 
            style={[styles.compareButton, !currentTarget?.image && styles.disabledButton]}
            onPress={handleCompare}
            disabled={!currentTarget?.image}
            onPressIn={currentTarget?.image ? onPressIn : undefined}
            onPressOut={currentTarget?.image ? onPressOut : undefined}
          >
            <Text style={[styles.compareButtonText, !currentTarget?.image && styles.disabledButtonText]}>
              Compare Now
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        {!currentTarget?.image && (
          <Text style={styles.footerText}>
            Please add a photo to compare with
          </Text>
        )}
        
        {currentTarget?.image && freeComparisonUsed && !isPremium && (
          <Text style={styles.premiumFooterText}>
            This will use your premium comparison
          </Text>
        )}
      </View>
      
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSuccess={handleCompare}
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
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 22,
  },
  photoSection: {
    padding: 16,
    marginBottom: 16,
  },
  photoOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  photoOption: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  previewImage: {
    height: 300,
    borderRadius: 12,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.textLight,
    fontWeight: "500",
  },
  celebrityOption: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  celebrityGradient: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  celebrityContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  starIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  celebrityTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.background,
    marginBottom: 4,
  },
  celebritySubtitle: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.9,
  },
  premiumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
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
  compareButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  compareButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: colors.card,
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