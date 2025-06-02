import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Camera, Upload } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import CameraView from "@/components/CameraView";
import ImagePreview from "@/components/ImagePreview";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

export default function UserPhotoScreen() {
  const router = useRouter();
  const { user, setUserFrontImage } = useUserStore();
  const [showCamera, setShowCamera] = useState(false);
  
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
    setUserFrontImage(uri);
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
      const uri = result.assets[0].uri;
      setUserFrontImage(uri);
    }
  };
  
  const handleRemovePhoto = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setUserFrontImage("");
  };
  
  const handleNext = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push("/target-photo");
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Take Your Selfie</Text>
          <Text style={styles.subtitle}>
            We need a clear photo of your face for accurate comparison
          </Text>
        </View>
        
        <View style={styles.photoSection}>
          {user.frontImage ? (
            <ImagePreview
              uri={user.frontImage}
              label="Your Selfie"
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
        
        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>Tips for Best Results:</Text>
          <Text style={styles.tipText}>• Use good lighting</Text>
          <Text style={styles.tipText}>• Keep a neutral expression</Text>
          <Text style={styles.tipText}>• Remove glasses and hats</Text>
          <Text style={styles.tipText}>• Ensure your full face is visible</Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity 
            style={[styles.nextButton, !user.frontImage && styles.disabledButton]}
            onPress={handleNext}
            disabled={!user.frontImage}
            onPressIn={user.frontImage ? onPressIn : undefined}
            onPressOut={user.frontImage ? onPressOut : undefined}
          >
            <Text style={[styles.nextButtonText, !user.frontImage && styles.disabledButtonText]}>
              Continue
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        {!user.frontImage && (
          <Text style={styles.footerText}>
            Please add a selfie to continue
          </Text>
        )}
      </View>
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
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
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
  tipContainer: {
    backgroundColor: colors.card,
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
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
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nextButtonText: {
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
});