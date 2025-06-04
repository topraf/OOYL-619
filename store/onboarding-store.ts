import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OnboardingState {
  currentStep: number;
  hasCompletedOnboarding: boolean;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setHasCompletedOnboarding: (value: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 0,
      hasCompletedOnboarding: false,
      
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
        hasCompletedOnboarding: false
      }),
      
      setHasCompletedOnboarding: (value: boolean) => set({
        hasCompletedOnboarding: value
      }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);