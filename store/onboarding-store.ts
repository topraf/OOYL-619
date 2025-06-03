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
        hasShownPremium: true,
        currentStep: 0
      }),
      
      resetOnboarding: () => set({ 
        hasCompletedOnboarding: false,
        currentStep: 0,
        hasShownNotifications: false,
        hasShownPremium: false
      }),
      
      skipNotifications: () => set({ hasShownNotifications: true }),
      
      skipPremium: () => set({ hasShownPremium: true }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);