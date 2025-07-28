import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {Camera, Upload, ScanFace} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import CameraView from "@/components/CameraView";
import ImagePreview from "@/components/ImagePreview";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

export default function TargetPhotoScreen() {
  const router = useRouter();
  const { currentTarget, setTargetImage, user, compareWithTarget } = useUserStore();
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
    setTargetImage(uri);
    setShowCamera(false);
  };

  const handlePickImage = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images' as any,
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

  const handleCompare = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

  const canContinue = user.frontImage && user.sideImage;

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
            Take Your selfie{""}
            <Text style={styles.titleNum}>2/2</Text>
          </Text>
        </View>

        <View style={styles.tipContainer2}>
          <LinearGradient
              colors={[
                'rgba(31,31,31,1)',
                'rgba(28,28,28,0.98)',
                'rgba(26,26,26,0.95)',
                'rgba(23,23,23,0.9)',
                'rgba(21,21,21,0.85)',
                'rgba(18,18,18,0.78)',
                'rgba(16,16,16,0.7)',
                'rgba(13,13,13,0.65)',
                'rgba(10,10,10,0.6)',
                'rgba(8,8,8,0.55)',
                'rgba(5,5,5,0.52)',
                'rgba(3,3,3,0.5)',
                'rgba(0,0,0,0.48)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.tipContainer2, StyleSheet.absoluteFillObject]}
          ></LinearGradient>
        </View>

        <View style={styles.faceGuide}>
          {currentTarget?.image ? (
            <ImagePreview
              uri={currentTarget.image}
              //label="Comparison Target"
              onRemove={handleRemovePhoto}
              style={styles.previewImageInside}
            />
          ) : (
              <ScanFace size={100} color="#555" />
          )}
        </View>

        <View>
          <View style={styles.buttonSection}>
            <View style={styles.BlockText}>
              <Text style={styles.tipText}>• Use good lighting</Text>
              <Text style={styles.tipText}>• Keep a neutral expression</Text>
              <Text style={styles.tipText}>• Remove glasses and hats</Text>
              <Text style={styles.tipText}>• Ensure your full face is visible</Text>
            </View>
            <TouchableOpacity onPress={handleTakePhoto} style={styles.photoButton}>
              <LinearGradient
                  colors={['#D46DD8', '#FF914D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.photoButtonGradient}
              >
                <View style={styles.iconTextRow}>
                  <Camera size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.photoButtonText}>
                    {user.frontImage ? "Take Another" : "Take Photo"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePickImage} style={styles.photoButtonSecondary}>
              <View style={styles.iconTextRow}>
                <Upload size={20} color="#FF8570" style={{ marginRight: 8 }} />
                <Text style={styles.photoButtonTextSecondary}>
                  {user.frontImage ? "Upload Another" : "Upload Photo"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
              style={[
                styles.buttonWrapper,
                !currentTarget?.image && styles.disabledButtonWrapper
              ]}
              onPress={handleCompare}
              disabled={!currentTarget?.image}
              onPressIn={currentTarget?.image ? onPressIn : undefined}
              onPressOut={currentTarget?.image ? onPressOut : undefined}
          >
            <LinearGradient
                colors={['#FF914D', '#2C1B17']}
                start={{ x: 1, y: 2 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.button,
                  !currentTarget?.image && { opacity: 0.7 }
                ]}
            >
              <Text style={[
                styles.buttonText,
                !currentTarget?.image && { color: '#888' }
              ]}>
                Continue
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {!canContinue && (
            <Text style={styles.footerText}>
              Please add a photo to continue
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
    padding: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
    paddingHorizontal: 34,
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
  previewImageInside: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
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
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    zIndex: 10,
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    marginTop: 8,
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
  premiumFooterText: {
    fontSize: 12,
    color: colors.primary,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },

  titleNum: {
    fontSize: 28,
    fontWeight: "900",
    color: '#808080',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  BlockText: {
    height: 120,
    borderRadius: 12,
  },
  tipContainer2: {
    position: 'absolute',         // le retire du flux normal
    top: 200,                     // ajuster la position verticale
    left: 16,
    right: 16,
    height: 500,
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgb(43,40,40)',
    zIndex: -1,                   // derrière les autres éléments
  },
  faceGuide: {
    width: '60%',
    height: 260,
    backgroundColor: 'rgb(16,15,15)',
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  buttonSection: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 10,
  },
  photoButton: {
    width: '80%',
    borderRadius: 30,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  photoButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(121,124,239,0.18)',
  },
  photoButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButtonWrapper: {
    opacity: 0.2,
    backgroundColor: colors.shadow,
  },
  photoButtonSecondary: {
    width: '80%',
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgb(43,40,40)',
    backgroundColor: 'rgb(14,14,14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonTextSecondary: {
    color: 'rgb(255,133,112)',
    fontWeight: '600',
    fontSize: 16,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#e9815f',
    borderRadius: 10,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    padding: 18,
  },
  buttonText: {
    color: '#fc8032',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
  },
});