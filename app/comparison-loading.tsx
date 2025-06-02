import React, { useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const imageSize = width * 0.3;

export default function ComparisonLoadingScreen() {
  const router = useRouter();
  const { user, currentTarget } = useUserStore();
  
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ]
    };
  });
  
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
    
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // Navigate to results after 2 seconds
    const timer = setTimeout(() => {
      router.replace("/results");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.card]}
        style={styles.gradient}
      >
        <Text style={styles.title}>Analyzing Your Photos</Text>
        
        <View style={styles.imagesContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: user.frontImage || "" }}
              style={styles.image}
            />
          </View>
          
          <Animated.View style={[styles.spinnerContainer, animatedStyle]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </Animated.View>
          
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: currentTarget?.image || "" }}
              style={styles.image}
            />
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Calculating league status...</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 48,
    textAlign: "center",
  },
  imagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 48,
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  spinnerContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  statusContainer: {
    width: "100%",
  },
  statusText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "70%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});