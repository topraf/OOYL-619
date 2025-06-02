import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from "react-native";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { colors } from "@/constants/colors";

interface ImagePreviewProps {
  uri: string;
  label?: string;
  onRemove?: () => void;
  style?: any;
}

const { width } = Dimensions.get("window");

export default function ImagePreview({ uri, label, onRemove, style }: ImagePreviewProps) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri }}
        style={styles.image}
        contentFit="cover"
      />
      
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
      
      {onRemove && (
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
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
    backgroundColor: colors.border,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.border,
  },
  labelContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  label: {
    color: colors.background,
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});