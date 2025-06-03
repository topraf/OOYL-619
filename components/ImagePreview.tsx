import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from "react-native";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { useUserStore } from "@/store/user-store";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

interface ImagePreviewProps {
  uri: string;
  label?: string;
  onRemove?: () => void;
  style?: any;
}

const { width } = Dimensions.get("window");

export default function ImagePreview({ uri, label, onRemove, style }: ImagePreviewProps) {
  const { getColors } = useUserStore();
  const colors = getColors();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });
  
  const handleLoad = () => {
    setIsLoading(false);
    scale.value = withSpring(1);
    opacity.value = withSpring(1);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    scale.value = withSpring(1);
    opacity.value = withSpring(1);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.border }, style]}>
      {hasError ? (
        <View style={[styles.errorContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.errorText, { color: colors.textLight }]}>Failed to load image</Text>
        </View>
      ) : (
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image
            source={{ uri }}
            style={styles.image}
            contentFit="cover"
            onLoad={handleLoad}
            onError={handleError}
            cachePolicy="memory-disk"
            priority="high"
            placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
            transition={200}
          />
        </Animated.View>
      )}
      
      {isLoading && !hasError && (
        <View style={[styles.loadingContainer, { backgroundColor: colors.card }]}>
          <View style={[styles.loadingIndicator, { backgroundColor: colors.primary }]} />
        </View>
      )}
      
      {label && (
        <View style={[styles.labelContainer, { backgroundColor: colors.overlay }]}>
          <Text style={[styles.label, { color: colors.background }]}>{label}</Text>
        </View>
      )}
      
      {onRemove && (
        <TouchableOpacity 
          style={[styles.removeButton, { backgroundColor: colors.overlay }]} 
          onPress={onRemove}
        >
          <X size={16} color={colors.background} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.7,
  },
  errorContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 12,
    textAlign: "center",
  },
  labelContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});