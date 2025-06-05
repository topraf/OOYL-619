import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ComparisonResult } from "@/types";

interface User {
  frontImage: string | null;
  beautyScore: number | null;
  gender: "male" | "female" | null;
}

interface UserState {
  user: User;
  currentTarget: {
    id: string;
    name: string;
    image: string;
    beautyScore: number;
    isCelebrity?: boolean;
  } | null;
  comparisons: ComparisonResult[];
  isLoading: boolean;
  freeComparisonUsed: boolean;
  isPremium: boolean;
  notifications: boolean;
  isOffline: boolean;
  
  // Actions
  setUserPhoto: (uri: string) => void;
  setUserGender: (gender: "male" | "female") => void;
  setCurrentTarget: (target: UserState["currentTarget"]) => void;
  addComparison: (result: ComparisonResult) => void;
  setLoading: (loading: boolean) => void;
  clearHistory: () => void;
  setPremium: (premium: boolean) => void;
  setNotifications: (enabled: boolean) => void;
  setOffline: (offline: boolean) => void;
  getCachedComparisons: () => ComparisonResult[];
  cacheComparison: (result: ComparisonResult) => void;
  getColors: () => any;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: {
        frontImage: null,
        beautyScore: null,
        gender: null,
      },
      currentTarget: null,
      comparisons: [],
      isLoading: false,
      freeComparisonUsed: false,
      isPremium: false,
      notifications: true,
      isOffline: false,
      
      setUserPhoto: (uri: string) =>
        set((state) => ({
          user: { ...state.user, frontImage: uri },
        })),
      
      setUserGender: (gender: "male" | "female") =>
        set((state) => ({
          user: { ...state.user, gender },
        })),
      
      setCurrentTarget: (target) =>
        set({ currentTarget: target }),
      
      addComparison: (result: ComparisonResult) => {
        set((state) => {
          // Cache the comparison for offline access
          const updatedComparisons = [result, ...state.comparisons];
          
          return {
            comparisons: updatedComparisons,
            freeComparisonUsed: true,
            isLoading: false,
          };
        });
      },
      
      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),
      
      clearHistory: () =>
        set({ comparisons: [] }),
      
      setPremium: (premium: boolean) =>
        set({ isPremium: premium }),
      
      setNotifications: (enabled: boolean) =>
        set({ notifications: enabled }),
      
      setOffline: (offline: boolean) =>
        set({ isOffline: offline }),
      
      getCachedComparisons: () => {
        const state = get();
        return state.comparisons;
      },
      
      cacheComparison: (result: ComparisonResult) => {
        // This function is now handled within addComparison
        // Keeping it for backward compatibility
        const state = get();
        if (!state.comparisons.find(c => c.id === result.id)) {
          set((prevState) => ({
            comparisons: [result, ...prevState.comparisons.slice(0, 9)] // Keep only last 10
          }));
        }
      },
      
      getColors: () => {
        // Return color scheme - could be dynamic based on user preferences
        return {
          primary: "#FF6B35",
          secondary: "#FF8E53",
          accent: "#FF4081",
        };
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        freeComparisonUsed: state.freeComparisonUsed,
        isPremium: state.isPremium,
        notifications: state.notifications,
        comparisons: state.comparisons.slice(0, 10), // Only persist last 10 comparisons
      }),
    }
  )
);