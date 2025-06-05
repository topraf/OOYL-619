import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Info, Heart, Shield, Bell, HelpCircle, CreditCard, RefreshCw, Play } from "lucide-react-native";
import { useUserStore } from "@/store/user-store";
import { useOnboardingStore } from "@/store/onboarding-store";
import { useRouter } from "expo-router";
import BottomNavigation from "@/components/BottomNavigation";

export default function SettingsScreen() {
  const router = useRouter();
  const { isPremium, setPremiumStatus, getColors } = useUserStore();
  const { resetOnboarding, setCurrentStep, setHasCompletedOnboarding } = useOnboardingStore();
  const colors = getColors();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [saveHistory, setSaveHistory] = React.useState(true);
  
  const handleResetOnboarding = () => {
    resetOnboarding();
    setHasCompletedOnboarding(false);
    router.push("/onboarding");
  };

  const handleGoToOnboardingStep = (step: number, path: string) => {
    setCurrentStep(step);
    router.push(path);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isPremium && (
          <View style={[styles.premiumBanner, { backgroundColor: colors.primary }]}>
            <Text style={[styles.premiumTitle, { color: colors.background }]}>
              Premium{" "}
              <Text style={styles.premiumTitleAccent}>Subscription</Text>
            </Text>
            <Text style={[styles.premiumStatus, { color: colors.background }]}>Active</Text>
            <TouchableOpacity 
              style={styles.managePremiumButton}
              onPress={() => alert("Subscription management would open here")}
            >
              <Text style={[styles.managePremiumText, { color: colors.background }]}>Manage Subscription</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {!isPremium && (
          <TouchableOpacity 
            style={[styles.getPremiumButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/subscription")}
          >
            <CreditCard size={20} color={colors.background} />
            <Text style={[styles.getPremiumText, { color: colors.background }]}>
              Get{" "}
              <Text style={styles.getPremiumTextAccent}>Premium</Text>
            </Text>
          </TouchableOpacity>
        )}
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            App{" "}
            <Text style={[styles.sectionTitleAccent, { color: colors.primary }]}>Settings</Text>
          </Text>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Shield size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Save History</Text>
            </View>
            <Switch
              value={saveHistory}
              onValueChange={setSaveHistory}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About{" "}
            <Text style={[styles.sectionTitleAccent, { color: colors.primary }]}>& Support</Text>
          </Text>
          
          <TouchableOpacity style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
            <Info size={20} color={colors.text} />
            <Text style={[styles.aboutLabel, { color: colors.text }]}>How It Works</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
            <Heart size={20} color={colors.text} />
            <Text style={[styles.aboutLabel, { color: colors.text }]}>Rate the App</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
            <HelpCircle size={20} color={colors.text} />
            <Text style={[styles.aboutLabel, { color: colors.text }]}>Help & Support</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Debug &{" "}
            <Text style={[styles.sectionTitleAccent, { color: colors.primary }]}>Testing</Text>
          </Text>
          
          <TouchableOpacity 
            style={[styles.debugItem, { borderBottomColor: colors.border }]}
            onPress={handleResetOnboarding}
          >
            <RefreshCw size={20} color={colors.primary} />
            <Text style={[styles.debugLabel, { color: colors.text }]}>Reset & Show Onboarding</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugItem, { borderBottomColor: colors.border }]}
            onPress={() => handleGoToOnboardingStep(0, "/onboarding")}
          >
            <Play size={20} color={colors.primary} />
            <Text style={[styles.debugLabel, { color: colors.text }]}>Welcome Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugItem, { borderBottomColor: colors.border }]}
            onPress={() => handleGoToOnboardingStep(1, "/onboarding-features")}
          >
            <Play size={20} color={colors.primary} />
            <Text style={[styles.debugLabel, { color: colors.text }]}>Features Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugItem, { borderBottomColor: colors.border }]}
            onPress={() => handleGoToOnboardingStep(2, "/onboarding-more-features")}
          >
            <Play size={20} color={colors.primary} />
            <Text style={[styles.debugLabel, { color: colors.text }]}>More Features Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugItem, { borderBottomColor: colors.border }]}
            onPress={() => handleGoToOnboardingStep(3, "/onboarding-notifications")}
          >
            <Play size={20} color={colors.primary} />
            <Text style={[styles.debugLabel, { color: colors.text }]}>Notifications Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugItem, { borderBottomColor: colors.border }]}
            onPress={() => handleGoToOnboardingStep(4, "/onboarding-subscription")}
          >
            <Play size={20} color={colors.primary} />
            <Text style={[styles.debugLabel, { color: colors.text }]}>Subscription Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.demoButton, { backgroundColor: colors.primary + "20" }]}
            onPress={() => setPremiumStatus(!isPremium)}
          >
            <Text style={[styles.demoButtonText, { color: colors.primary }]}>
              {isPremium ? "Demo: Disable Premium" : "Demo: Enable Premium"}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text }]}>
            League{" "}
            <Text style={[styles.footerTextAccent, { color: colors.primary }]}>Checker</Text>
            {" "}v1.0.0
          </Text>
          <Text style={[styles.disclaimer, { color: colors.textLight }]}>
            This app is for entertainment purposes only. Beauty is subjective and our algorithm
            provides an approximation based on photographic evidence.
          </Text>
        </View>
      </ScrollView>
      
      <BottomNavigation currentRoute="settings" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // Space for bottom navigation
  },
  premiumBanner: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },
  premiumTitleAccent: {
    textShadowColor: "rgba(255,255,255,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  premiumStatus: {
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: "600",
  },
  getPremiumButton: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  getPremiumText: {
    fontSize: 18,
    fontWeight: "900",
    marginLeft: 8,
  },
  getPremiumTextAccent: {
    textShadowColor: "rgba(255,255,255,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
  },
  sectionTitleAccent: {
    // Color applied dynamically
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  aboutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  aboutLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  debugItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  debugLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  demoButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },
  footerTextAccent: {
    // Color applied dynamically
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});