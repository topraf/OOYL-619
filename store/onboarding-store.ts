import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OnboardingState {
  currentStep: number;
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  premiumOffered: boolean;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  enableNotifications: () => void;
  skipNotifications: () => void;
  acceptPremium: () => void;
  skipPremium: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 0,
      hasCompletedOnboarding: false,
      notificationsEnabled: false,
      premiumOffered: false,
      
      setCurrentStep: (step: number) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ 
        currentStep: state.currentStep + 1 
      })),
      
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(0, state.currentStep - 1) 
      })),
      
      completeOnboarding: () => set({ 
        hasCompletedOnboarding: true,
        currentStep: 0
      }),
      
      resetOnboarding: () => set({ 
        currentStep: 0,
        hasCompletedOnboarding: false,
        notificationsEnabled: false,
        premiumOffered: false
      }),
      
      setHasCompletedOnboarding: (value: boolean) => set({
        hasCompletedOnboarding: value
      }),
      
      enableNotifications: () => set({
        notificationsEnabled: true
      }),
      
      skipNotifications: () => set({
        notificationsEnabled: false
      }),
      
      acceptPremium: () => set({
        premiumOffered: true
      }),
      
      skipPremium: () => set({
        premiumOffered: false
      }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);