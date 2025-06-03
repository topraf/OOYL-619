import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  hasShownNotifications: boolean;
  hasShownPremium: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  skipNotifications: () => void;
  skipPremium: () => void;
  
  // Conditional checks (disabled to prevent loops)
  checkShouldShowNotifications: () => boolean;
  checkShouldShowPremium: () => boolean;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      currentStep: 0,
      hasShownNotifications: false,
      hasShownPremium: false,
      
      setCurrentStep: (step: number) => set({ currentStep: step }),
      
      completeOnboarding: () => set({ 
        hasCompletedOnboarding: true,
        hasShownNotifications: true,
        hasShownPremium: true
      }),
      
      resetOnboarding: () => set({ 
        hasCompletedOnboarding: false,
        currentStep: 0,
        hasShownNotifications: false,
        hasShownPremium: false
      }),
      
      skipNotifications: () => set({ hasShownNotifications: true }),
      
      skipPremium: () => set({ hasShownPremium: true }),
      
      // Always return false to prevent loops
      checkShouldShowNotifications: () => false,
      checkShouldShowPremium: () => false,
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);