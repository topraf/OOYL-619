import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Info, Heart, Shield, Bell, HelpCircle, CreditCard, RefreshCw, Play, Globe, Check } from "lucide-react-native";
import { useUserStore } from "@/store/user-store";
import { useOnboardingStore } from "@/store/onboarding-store";
import { useRouter } from "expo-router";
import { SUPPORTED_LANGUAGES, Language } from "@/constants/translations";
import BottomNavigation from "@/components/BottomNavigation";

export default function SettingsScreen() {
  const router = useRouter();
  const { isPremium, setPremiumStatus, getColors, language, setLanguage, getTranslations } = useUserStore();
  const { resetOnboarding, setCurrentStep, setHasCompletedOnboarding } = useOnboardingStore();
  const colors = getColors();
  const t = getTranslations();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  const handleResetOnboarding = () => {
    resetOnboarding();
    setHasCompletedOnboarding(false);
    router.push("/onboarding");
  };

  const handleGoToOnboardingStep = (step: number, path: string) => {
    setCurrentStep(step);
    router.push("/celebrity-details" as any); //router.push(path);

  };

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setShowLanguageModal(false);
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === language);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!isPremium && (
          <TouchableOpacity 
            style={[styles.getPremiumButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/subscription")}
          >
            <CreditCard size={20} color={colors.background} />
            <Text style={[styles.getPremiumText, { color: colors.background }]}>
              Get{" "}
              <Text style={styles.getPremiumTextAccent}>{t.common.premium}</Text>
            </Text>
          </TouchableOpacity>
        )}
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.screens.settings.app_settings.split(' ')[0]}{" "}
            <Text style={[styles.sectionTitleAccent, { color: colors.seventh }]}>
              {t.screens.settings.app_settings.split(' ')[1]}
            </Text>
          </Text>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>{t.screens.settings.notifications}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.seventh }}
              thumbColor={colors.text}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Shield size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>{t.screens.settings.save_history}</Text>
            </View>
            <Switch
              value={saveHistory}
              onValueChange={setSaveHistory}
              trackColor={{ false: colors.border, true: colors.seventh }}
              thumbColor={colors.text}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.settingInfo}>
              <Globe size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>{t.screens.settings.language}</Text>
            </View>
            <View style={styles.languageDisplay}>
              <Text style={[styles.languageText, { color: colors.textLight }]}>
                {currentLanguage?.flag} {currentLanguage?.name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.screens.settings.about_support.split(' & ')[0]}{" "}
            <Text style={[styles.sectionTitleAccent, { color: colors.seventh }]}>
              & {t.screens.settings.about_support.split(' & ')[1]}
            </Text>
          </Text>
          
          <TouchableOpacity style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
            <Info size={20} color={colors.text} />
            <Text style={[styles.aboutLabel, { color: colors.text }]}>{t.screens.settings.how_it_works}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
            <Heart size={20} color={colors.text} />
            <Text style={[styles.aboutLabel, { color: colors.text }]}>{t.screens.settings.rate_app}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.aboutItem, { borderBottomColor: colors.border }]}>
            <HelpCircle size={20} color={colors.text} />
            <Text style={[styles.aboutLabel, { color: colors.text }]}>{t.screens.settings.help_support}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.screens.settings.debug_testing.split(' & ')[0]} &{" "}
            <Text style={[styles.sectionTitleAccent, { color: colors.seventh }]}>
              {t.screens.settings.debug_testing.split(' & ')[1]}
            </Text>
          </Text>
          
          <TouchableOpacity 
            style={[styles.debugItem, { borderBottomColor: colors.border }]}
            onPress={handleResetOnboarding}
          >
            <RefreshCw size={20} color={colors.seventh} />
            <Text style={[styles.debugLabel, { color: colors.text }]}>{t.screens.settings.reset_onboarding}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugItem, { borderBottomColor: colors.border }]}
            onPress={() => handleGoToOnboardingStep(0, "/onboarding")}
          >
            <Play size={20} color={colors.seventh} />
            <Text style={[styles.debugLabel, { color: colors.text }]}>Welcome Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugItem, { borderBottomColor: colors.border }]}
            onPress={() => handleGoToOnboardingStep(1, "/onboarding-features")}
          >
            <Play size={20} color={colors.seventh} />
            <Text style={[styles.debugLabel, { color: colors.text }]}>Features Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugItem, { borderBottomColor: colors.border }]}
            onPress={() => handleGoToOnboardingStep(2, "/onboarding-more-features")}
          >
            <Play size={20} color={colors.seventh} />
            <Text style={[styles.debugLabel, { color: colors.text }]}>More Features Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugItem, { borderBottomColor: colors.border }]}
            onPress={() => handleGoToOnboardingStep(3, "/onboarding-notifications")}
          >
            <Play size={20} color={colors.seventh} />
            <Text style={[styles.debugLabel, { color: colors.text }]}>Notifications Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugItem, { borderBottomColor: colors.border }]}
            onPress={() => handleGoToOnboardingStep(4, "/onboarding-subscription")}
          >
            <Play size={20} color={colors.seventh} />
            <Text style={[styles.debugLabel, { color: colors.text }]}>Subscription Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.demoButton, { backgroundColor: colors.shadow + "20" }]}
            onPress={() => setPremiumStatus(!isPremium)}
          >
            <Text style={[styles.demoButtonText, { color: colors.seventh }]}>
              {isPremium ? t.screens.settings.demo_disable_premium : t.screens.settings.demo_premium}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text }]}>
            League{" "}
            <Text style={[styles.footerTextAccent, { color: colors.seventh }]}>Checker</Text>
            {" "}{t.screens.settings.version}
          </Text>
          <Text style={[styles.disclaimer, { color: colors.textLight }]}>
            {t.screens.settings.disclaimer}
          </Text>
        </View>
      </ScrollView>
      
      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t.screens.settings.language}</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Text style={[styles.modalClose, { color: colors.primary }]}>{t.common.close}</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={SUPPORTED_LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.languageItem, { borderBottomColor: colors.border }]}
                  onPress={() => handleLanguageSelect(item.code)}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageFlag}>{item.flag}</Text>
                    <Text style={[styles.languageName, { color: colors.text }]}>{item.name}</Text>
                  </View>
                  {language === item.code && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  languageDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageText: {
    fontSize: 14,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalClose: {
    fontSize: 16,
    fontWeight: "600",
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  languageInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
  },
});