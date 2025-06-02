import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Info, Heart, Shield, Bell, HelpCircle, CreditCard } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();
  const { isPremium, setPremiumStatus } = useUserStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [saveHistory, setSaveHistory] = React.useState(true);
  
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isPremium && (
          <View style={styles.premiumBanner}>
            <Text style={styles.premiumTitle}>Premium Subscription</Text>
            <Text style={styles.premiumStatus}>Active</Text>
            <TouchableOpacity 
              style={styles.managePremiumButton}
              onPress={() => alert("Subscription management would open here")}
            >
              <Text style={styles.managePremiumText}>Manage Subscription</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {!isPremium && (
          <TouchableOpacity 
            style={styles.getPremiumButton}
            onPress={() => router.push("/subscription")}
          >
            <CreditCard size={20} color={colors.background} />
            <Text style={styles.getPremiumText}>Get Premium</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.text} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Shield size={20} color={colors.text} />
              <Text style={styles.settingLabel}>Save History</Text>
            </View>
            <Switch
              value={saveHistory}
              onValueChange={setSaveHistory}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Info size={20} color={colors.text} />
            <Text style={styles.aboutLabel}>How It Works</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Heart size={20} color={colors.text} />
            <Text style={styles.aboutLabel}>Rate the App</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <HelpCircle size={20} color={colors.text} />
            <Text style={styles.aboutLabel}>Help & Support</Text>
          </TouchableOpacity>
        </View>
        
        {/* For demo purposes only - to toggle premium status */}
        <TouchableOpacity 
          style={styles.demoButton}
          onPress={() => setPremiumStatus(!isPremium)}
        >
          <Text style={styles.demoButtonText}>
            {isPremium ? "Demo: Disable Premium" : "Demo: Enable Premium"}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>League Checker v1.0.0</Text>
          <Text style={styles.disclaimer}>
            This app is for entertainment purposes only. Beauty is subjective and our algorithm
            provides an approximation based on photographic evidence.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  premiumBanner: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.background,
    marginBottom: 4,
  },
  premiumStatus: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.9,
    marginBottom: 16,
  },
  managePremiumButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  managePremiumText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "600",
  },
  getPremiumButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  getPremiumText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  aboutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  aboutLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  demoButton: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  demoButtonText: {
    color: colors.textLight,
    fontSize: 14,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 18,
  },
});