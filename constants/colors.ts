import { ColorValue } from 'react-native';

export const colors = {
  // Dark theme base
  background: "#0A0A0A" as ColorValue,
  card: "#1A1A1A" as ColorValue,
  border: "#2A2A2A" as ColorValue,
  
  // Orange/Pink gradient theme
  primary: "#FF6B35" as ColorValue, // Orange
  secondary: "#FF8E53" as ColorValue, // Light orange
  accent: "#FF4081" as ColorValue, // Pink accent
  
  // Text colors
  text: "#FFFFFF" as ColorValue,
  textLight: "#B0B0B0" as ColorValue,
  textMuted: "#808080" as ColorValue,
  
  // Status colors
  success: "#4CAF50" as ColorValue,
  warning: "#FF9800" as ColorValue,
  error: "#F44336" as ColorValue,
  info: "#2196F3" as ColorValue,
  
  // Shadow
  shadow: "rgba(0, 0, 0, 0.3)" as ColorValue,
  
  // Gradients - properly typed as readonly tuples
  gradientPrimary: ["#FF6B35", "#FF8E53"] as const,
  gradientSecondary: ["#FF8E53", "#FF4081"] as const,
  gradientCard: ["#1A1A1A", "#2A2A2A"] as const,
  gradientPink: ["#FF4081", "#E91E63"] as const,
};