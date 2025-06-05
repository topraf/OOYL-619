import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Star, Trash2, Bell, Shield, HelpCircle, Mail, ExternalLink } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import { useComparisonStore } from "@/store/comparison-store";
import PaywallModal from "@/components/PaywallModal";
import BottomNavigation from "@/components/BottomNavigation";

export default function SettingsScreen() {
  const router = useRouter();
  const { isPremium, clearHistory, notifications, setNotifications } = useUserStore();
  const { clearHistory: clearComparisonHistory } = useComparisonStore();
  const [showPaywall, setShowPaywall] = useState(false);
  
  const handleClearHistory = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all your comparison history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: () => {
            clearHistory();
            clearComparisonHistory();
            Alert.alert("Success", "Your history has been cleared.");
          }
        }
      ]
    );
  };
  
  const handleUpgradeToPremium = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowPaywall(true);
  };
  
  const handleContactSupport = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert("Contact Support", "Email us at support@leaguechecker.com for help!");
  };
  
  const handlePrivacyPolicy = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert("Privacy Policy", "Privacy policy would open here in a real app.");
  };
  
  const handleTermsOfService = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert("Terms of Service", "Terms of service would open here in a real app.");
  };
  
  const toggleNotifications = (value: boolean) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotifications(value);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          Settings
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isPremium && (
          <TouchableOpacity 
            style={styles.premiumCard}
            onPress={handleUpgradeToPremium}
          >
            <LinearGradient
              colors={colors.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumGradient}
            >
              <View style={styles.premiumContent}>
                <Text style={styles.premiumTitle}>Get Pro</Text>
                <View style={styles.premiumFeatures}>
                  <Text style={styles.premiumFeature}>✓ Unlimited comparisons</Text>
                  <Text style={styles.premiumFeature}>✓ Celebrity database</Text>
                  <Text style={styles.premiumFeature}>✓ AI roast feature</Text>
                  <Text style={styles.premiumFeature}>✓ Detailed analysis</Text>
                </View>
                <View style={styles.premiumButton}>
                  <Text style={styles.premiumButtonText}>Try now</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={colors.text} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleClearHistory}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={20} color={colors.error} />
              <Text style={[styles.settingText, { color: colors.error }]}>Clear History</Text>
            </View>
            <ExternalLink size={16} color={colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleContactSupport}
          >
            <View style={styles.settingLeft}>
              <Mail size={20} color={colors.text} />
              <Text style={styles.settingText}>Contact Support</Text>
            </View>
            <ExternalLink size={16} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handlePrivacyPolicy}
          >
            <View style={styles.settingLeft}>
              <Shield size={20} color={colors.text} />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <ExternalLink size={16} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleTermsOfService}
          >
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color={colors.text} />
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <ExternalLink size={16} color={colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>League Checker v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ for fun</Text>
        </View>
      </ScrollView>
      
      <BottomNavigation currentRoute="settings" />
      
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  premiumCard: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumGradient: {
    padding: 20,
  },
  premiumContent: {
    alignItems: "flex-start",
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.background,
    marginBottom: 12,
  },
  premiumFeatures: {
    marginBottom: 16,
  },
  premiumFeature: {
    fontSize: 14,
    color: colors.background,
    marginBottom: 4,
    opacity: 0.9,
  },
  premiumButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.background,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: "500",
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: colors.textMuted,
  },
});