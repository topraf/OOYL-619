import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  shouldShowNotifications: boolean;
  shouldShowPremium: boolean;
  lastNotificationPrompt: string | null;
  lastPremiumPrompt: string | null;
  
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  
  skipNotifications: () => void;
  skipPremium: () => void;
  
  checkShouldShowNotifications: () => boolean;
  checkShouldShowPremium: () => boolean;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      currentStep: 0,
      shouldShowNotifications: false,
      shouldShowPremium: false,
      lastNotificationPrompt: null,
      lastPremiumPrompt: null,
      
      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },
      
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },
      
      resetOnboarding: () => {
        set({ 
          hasCompletedOnboarding: false, 
          currentStep: 0,
          shouldShowNotifications: false,
          shouldShowPremium: false
        });
      },
      
      skipNotifications: () => {
        const now = new Date().toISOString();
        set({ 
          shouldShowNotifications: false,
          lastNotificationPrompt: now
        });
      },
      
      skipPremium: () => {
        const now = new Date().toISOString();
        set({ 
          shouldShowPremium: false,
          lastPremiumPrompt: now
        });
      },
      
      checkShouldShowNotifications: () => {
        const { lastNotificationPrompt } = get();
        
        if (!lastNotificationPrompt) return true;
        
        // Check if it's been at least 3 days since the last prompt
        const lastPrompt = new Date(lastNotificationPrompt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastPrompt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const shouldShow = diffDays >= 3;
        set({ shouldShowNotifications: shouldShow });
        return shouldShow;
      },
      
      checkShouldShowPremium: () => {
        const { lastPremiumPrompt } = get();
        
        if (!lastPremiumPrompt) return true;
        
        // Check if it's been at least 2 days since the last prompt
        const lastPrompt = new Date(lastPremiumPrompt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastPrompt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const shouldShow = diffDays >= 2;
        set({ shouldShowPremium: shouldShow });
        return shouldShow;
      },
    }),
    {
      name: "league-checker-onboarding",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);