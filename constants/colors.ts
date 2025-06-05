export const colors = {
  // Background colors
  background: "#000000",
  card: "#1A1A1A",
  
  // Text colors
  text: "#FFFFFF",
  textLight: "#A0A0A0",
  
  // Primary colors (orange/pink theme)
  primary: "#FF6B35",
  secondary: "#FF8E53",
  
  // Status colors
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  
  // Shadow
  shadow: "#000000",
  
  // Gradients
  gradientPrimary: ["#FF6B35", "#FF8E53"] as const,
  gradientSecondary: ["#FF8E53", "#FFB366"] as const,
  gradientCard: ["#1A1A1A", "#2A2A2A"] as const,
  gradientPink: ["#FF6B35", "#FF4081"] as const,
} as const;