import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function GenderSelectionScreen() {
  const router = useRouter();
  const { setUserGender } = useUserStore();
  
  const maleButtonScale = useSharedValue(1);
  const femaleButtonScale = useSharedValue(1);
  
  const animatedMaleButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: maleButtonScale.value }]
    };
  });
  
  const animatedFemaleButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: femaleButtonScale.value }]
    };
  });
  
  const handleSelectGender = (gender: "male" | "female") => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setUserGender(gender);
    router.push("/user-photo");
  };

  const onMalePressIn = () => {
    maleButtonScale.value = withSpring(0.95);
  };

  const onMalePressOut = () => {
    maleButtonScale.value = withSpring(1);
  };
  
  const onFemalePressIn = () => {
    femaleButtonScale.value = withSpring(0.95);
  };

  const onFemalePressOut = () => {
    femaleButtonScale.value = withSpring(1);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Gender</Text>
        <Text style={styles.subtitle}>
          This helps us provide more accurate comparison results
        </Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <Animated.View style={[styles.optionWrapper, animatedMaleButtonStyle]}>
          <TouchableOpacity 
            style={styles.option}
            onPress={() => handleSelectGender("male")}
            onPressIn={onMalePressIn}
            onPressOut={onMalePressOut}
          >
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
              style={styles.optionImage}
            />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Male</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={[styles.optionWrapper, animatedFemaleButtonStyle]}>
          <TouchableOpacity 
            style={styles.option}
            onPress={() => handleSelectGender("female")}
            onPressIn={onFemalePressIn}
            onPressOut={onFemalePressOut}
          >
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }}
              style={styles.optionImage}
            />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Female</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Your selection helps our AI provide more accurate beauty analysis and comparison results
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    maxWidth: "80%",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 24,
  },
  optionWrapper: {
    width: (width - 64) / 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  option: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.card,
  },
  optionImage: {
    width: "100%",
    height: (width - 64) / 2 * 1.3,
  },
  optionContent: {
    padding: 16,
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  infoContainer: {
    padding: 24,
    marginTop: 32,
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
});