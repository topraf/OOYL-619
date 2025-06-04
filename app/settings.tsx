import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Crown, Trash2, Info, Mail, Shield, Bell } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform as RNPlatform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUserStore } from "@/store/user-store";
import { useComparisonStore } from "@/store/comparison-store";
import BottomNavigation from "@/components/BottomNavigation";
import PaywallModal from "@/components/PaywallModal";

export default function SettingsScreen() {
  const router = useRouter();
  const { isPremium, setPremiumStatus, clearHistory, getColors } = useUserStore();
  const { clearHistory: clearComparisonHistory } = useComparisonStore();
  const colors = getColors();
  const [showPaywall, setShowPaywall] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSavingMode, setDataSavingMode] = useState(false);

  const handleUpgradeToPremium = () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowPaywall(true);
  };

  const handleClearHistory = () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all your comparison history? This action cannot be undone.",
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

  const handleContactSupport = () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert("Contact Support", "Email us at support@leaguechecker.com for any questions or issues.");
  };

  const handlePrivacyPolicy = () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert("Privacy Policy", "Your privacy is important to us. We don't store your photos permanently and all comparisons are processed securely.");
  };

  const handleAbout = () => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert("About League Checker", "League Checker v1.0\n\nFind out if someone is in your league using AI-powered beauty analysis. Remember, beauty is subjective and this is just for fun!");
  };

  const toggleNotifications = (value: boolean) => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotificationsEnabled(value);
  };

  const toggleDataSaving = (value: boolean) => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDataSavingMode(value);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.card }]} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!isPremium && (
          <TouchableOpacity 
            style={styles.premiumCard}
            onPress={handleUpgradeToPremium}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumGradient}
            >
              <View style={styles.premiumContent}>
                <Crown size={32} color={colors.text} />
                <View style={styles.premiumText}>
                  <Text style={[styles.premiumTitle, { color: colors.text }]}>Get Pro</Text>
                  <Text style={[styles.premiumSubtitle, { color: colors.text }]}>
                    Unlock unlimited comparisons and exclusive features
                  </Text>
                </View>
              </View>
              <View style={styles.premiumFeatures}>
                <Text style={[styles.premiumFeature, { color: colors.text }]}>✓ Unlimited comparisons</Text>
                <Text style={[styles.premiumFeature, { color: colors.text }]}>✓ Celebrity matching</Text>
                <Text style={[styles.premiumFeature, { color: colors.text }]}>✓ AI roasting</Text>
                <Text style={[styles.premiumFeature, { color: colors.text }]}>✓ Detailed analysis</Text>
              </View>
              <View style={[styles.tryNowButton, { backgroundColor: colors.background }]}>
                <Text style={[styles.tryNowText, { color: colors.primary }]}>Try now</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={colors.textLight} />
              <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingText, { color: colors.text }]}>Enable Data Saving Mode</Text>
            </View>
            <Switch
              value={dataSavingMode}
              onValueChange={toggleDataSaving}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
          
          <Text style={[styles.settingDescription, { color: colors.textLight }]}>
            Less data usage for quicker load times.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleClearHistory}>
            <View style={styles.settingLeft}>
              <Trash2 size={20} color={colors.error} />
              <Text style={[styles.settingText, { color: colors.error }]}>Clear History</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleContactSupport}>
            <View style={styles.settingLeft}>
              <Mail size={20} color={colors.textLight} />
              <Text style={[styles.settingText, { color: colors.text }]}>Contact Support</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacyPolicy}>
            <View style={styles.settingLeft}>
              <Shield size={20} color={colors.textLight} />
              <Text style={[styles.settingText, { color: colors.text }]}>Privacy Policy</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <View style={styles.settingLeft}>
              <Info size={20} color={colors.textLight} />
              <Text style={[styles.settingText, { color: colors.text }]}>About</Text>
            </View>
          </TouchableOpacity>
        </View>

        {isPremium && (
          <View style={[styles.premiumBadge, { backgroundColor: colors.primary + "20" }]}>
            <Crown size={16} color={colors.primary} />
            <Text style={[styles.premiumBadgeText, { color: colors.primary }]}>
              Premium Member
            </Text>
          </View>
        )}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  premiumCard: {
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumGradient: {
    borderRadius: 16,
    padding: 20,
  },
  premiumContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  premiumText: {
    marginLeft: 12,
    flex: 1,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    opacity: 0.9,
  },
  premiumFeatures: {
    marginBottom: 16,
  },
  premiumFeature: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.9,
  },
  tryNowButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tryNowText: {
    fontSize: 16,
    fontWeight: "700",
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  premiumBadgeText: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});