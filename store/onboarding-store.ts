import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      currentStep: 0,
      
      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },
      
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },
      
      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false, currentStep: 0 });
      },
    }),
    {
      name: "league-checker-onboarding",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);