import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ComparisonResult, Target, User } from "@/types";
import { colors } from "@/constants/colors";

interface UserState {
  user: User;
  currentTarget: Target | null;
  comparisons: ComparisonResult[];
  isLoading: boolean;
  freeComparisonUsed: boolean;
  isPremium: boolean;
  notifications: boolean;
  isOffline: boolean;
  
  setUserImage: (frontImage: string, sideImage?: string) => void;
  setTargetImage: (image: string) => void;
  setCurrentTarget: (target: Target) => void;
  compareWithTarget: () => Promise<ComparisonResult | null>;
  clearHistory: () => void;
  setPremium: (isPremium: boolean) => void;
  setNotifications: (enabled: boolean) => void;
  setOfflineStatus: (isOffline: boolean) => void;
  getCachedComparisons: () => ComparisonResult[];
  cacheComparison: (result: ComparisonResult) => void;
  getColors: () => typeof colors;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: {
        id: "user-1",
        frontImage: null,
        sideImage: null,
        beautyScore: 0,
      },
      currentTarget: null,
      comparisons: [],
      isLoading: false,
      freeComparisonUsed: false,
      isPremium: false,
      notifications: true,
      isOffline: false,
      
      setUserImage: (frontImage: string, sideImage?: string) => {
        set(state => ({
          user: {
            ...state.user,
            frontImage,
            sideImage: sideImage || state.user.sideImage,
          }
        }));
      },
      
      setTargetImage: (image: string) => {
        set(state => ({
          currentTarget: state.currentTarget ? {
            ...state.currentTarget,
            image,
          } : {
            id: "target-1",
            image,
            beautyScore: 0.8,
          }
        }));
      },
      
      setCurrentTarget: (target: Target) => {
        set({ currentTarget: target });
      },
      
      compareWithTarget: async () => {
        const { user, currentTarget, freeComparisonUsed, isPremium } = get();
        
        if (!user.frontImage || !currentTarget) {
          return null;
        }
        
        if (freeComparisonUsed && !isPremium) {
          return null;
        }
        
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Generate a random score between 70 and 95
          const score = Math.floor(Math.random() * 26) + 70;
          
          // Generate feedback based on score
          let feedback = "";
          if (score >= 90) {
            feedback = `Wow! You have striking similarities with ${currentTarget.name || "this person"}! ✨`;
          } else if (score >= 80) {
            feedback = `Great match! You share many features with ${currentTarget.name || "this person"}. 🎯`;
          } else {
            feedback = `You have some nice similarities with ${currentTarget.name || "this person"}. 👍`;
          }
          
          const result: ComparisonResult = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            user: {
              ...user,
              beautyScore: score / 100,
            },
            target: currentTarget,
            leagueStatus: score >= 90 ? "in_your_league" : 
                          score >= 85 ? "slightly_above" : 
                          score >= 80 ? "slightly_below" : 
                          score >= 75 ? "out_of_league" : "way_beyond",
            feedback,
            userImage: user.frontImage || "",
            celebrity: {
              id: currentTarget.id,
              name: currentTarget.name || "Unknown",
              image: currentTarget.image,
              beautyScore: currentTarget.beautyScore,
              category: "unknown",
            },
            score: score,
          };
          
          get().cacheComparison(result);
          
          set(state => ({
            comparisons: [result, ...state.comparisons],
            freeComparisonUsed: true,
            isLoading: false,
          }));
          
          return result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      clearHistory: () => set({ comparisons: [] }),
      setPremium: (isPremium: boolean) => set({ isPremium }),
      setNotifications: (notifications: boolean) => set({ notifications }),
      setOfflineStatus: (isOffline: boolean) => set({ isOffline }),
      
      getCachedComparisons: () => {
        const { comparisons, isOffline } = get();
        return isOffline ? comparisons.slice(0, 10) : []; // Return last 10 when offline
      },
      
      cacheComparison: (result: ComparisonResult) => {
        // This is handled by the main comparisons array in this store
        // No additional caching needed since we persist the entire store
      },
      
      getColors: () => colors,
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        comparisons: state.comparisons,
        freeComparisonUsed: state.freeComparisonUsed,
        isPremium: state.isPremium,
        notifications: state.notifications,
      }),
    }
  )
);