import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, Target, ComparisonResult, LeagueStatus, Celebrity } from "@/types";
import { lightColors, darkColors } from "@/constants/colors";
import { celebrities } from "@/mocks/celebrities";

type Theme = "dark"; // Only dark theme now

interface UserState {
  user: User & { gender?: "male" | "female" };
  currentTarget: Target | null;
  comparisons: ComparisonResult[];
  freeComparisonUsed: boolean;
  isPremium: boolean;
  isLoading: boolean;
  theme: Theme;
  isOffline: boolean;
  cachedComparisons: ComparisonResult[];
  
  setUserGender: (gender: "male" | "female") => void;
  setUserFrontImage: (uri: string) => void;
  setTargetImage: (uri: string, name?: string, isCelebrity?: boolean) => void;
  clearCurrentTarget: () => void;
  resetUserImages: () => void;
  
  compareWithTarget: () => Promise<ComparisonResult | null>;
  
  setPremiumStatus: (status: boolean) => void;
  setTheme: (theme: Theme) => void;
  getColors: () => typeof darkColors;
  
  clearHistory: () => void;
  setOfflineStatus: (isOffline: boolean) => void;
  cacheComparison: (comparison: ComparisonResult) => void;
  getCachedComparisons: () => ComparisonResult[];
}

const initialUser: User & { gender?: "male" | "female" } = {
  id: "user_" + Date.now().toString(),
  gender: "male",
  frontImage: null,
  sideImage: null,
  beautyScore: 0,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: initialUser,
      currentTarget: null,
      comparisons: [],
      freeComparisonUsed: false,
      isPremium: false,
      isLoading: false,
      theme: "dark", // Only dark theme
      isOffline: false,
      cachedComparisons: [],
      
      setUserGender: (gender: "male" | "female") => {
        set(state => ({
          user: {
            ...state.user,
            gender,
          }
        }));
      },
      
      setUserFrontImage: (uri: string) => {
        set(state => ({
          user: {
            ...state.user,
            frontImage: uri,
            // Simulate beauty score calculation when image is set
            beautyScore: uri ? Math.random() * 0.5 + 0.3 : 0,
          }
        }));
      },
      
      setTargetImage: (uri: string, name?: string, isCelebrity?: boolean) => {
        set({
          currentTarget: {
            id: "target_" + Date.now().toString(),
            image: uri,
            name: name,
            beautyScore: Math.random() * 0.5 + 0.4, // Simulate beauty score
            isCelebrity: isCelebrity,
          }
        });
      },
      
      clearCurrentTarget: () => {
        set({ currentTarget: null });
      },
      
      resetUserImages: () => {
        set(state => ({
          user: {
            ...state.user,
            frontImage: null,
            sideImage: null,
            beautyScore: 0,
          },
          currentTarget: null
        }));
      },
      
      compareWithTarget: async () => {
        const { user, currentTarget, freeComparisonUsed, isPremium, cacheComparison } = get();
        
        // Check if user has image and target has an image
        if (!user.frontImage || !currentTarget?.image) {
          return null;
        }
        
        // Check if user has used free comparison and is not premium
        if (freeComparisonUsed && !isPremium) {
          return null;
        }
        
        set({ isLoading: true });
        
        // Simulate API call delay with progress
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Calculate league status based on beauty scores
        const userScore = user.beautyScore || 0.5;
        const targetScore = currentTarget.beautyScore || 0.5;
        const scoreDiff = targetScore - userScore;
        
        let leagueStatus: LeagueStatus;
        
        if (scoreDiff > 0.3) {
          leagueStatus = "way_beyond";
        } else if (scoreDiff > 0.15) {
          leagueStatus = "out_of_league";
        } else if (scoreDiff > 0.05) {
          leagueStatus = "slightly_above";
        } else if (scoreDiff >= -0.05) {
          leagueStatus = "in_your_league";
        } else if (scoreDiff >= -0.15) {
          leagueStatus = "slightly_below";
        } else {
          leagueStatus = "you_can_do_better";
        }
        
        // Generate a score between 70-95
        const score = Math.floor(Math.random() * 26) + 70;
        
        // Find a random celebrity for the comparison
        const randomCelebrity = celebrities[Math.floor(Math.random() * celebrities.length)];
        
        const result: ComparisonResult = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          userImage: user.frontImage || "",
          celebrity: currentTarget.isCelebrity ? {
            id: currentTarget.id,
            name: currentTarget.name || "Unknown",
            image: currentTarget.image,
            beautyScore: currentTarget.beautyScore,
            category: "Celebrity"
          } : randomCelebrity,
          score: score,
          user: { ...user },
          target: { ...currentTarget },
          leagueStatus,
          feedback: `Comparison completed with ${currentTarget.name || "target"}`,
        };
        
        // Cache the comparison for offline access
        cacheComparison(result);
        
        set(state => ({
          comparisons: [result, ...state.comparisons],
          freeComparisonUsed: true,
          isLoading: false,
        }));
        
        return result;
      },
      
      setPremiumStatus: (status: boolean) => {
        set({ isPremium: status });
      },
      
      setTheme: (theme: Theme) => {
        set({ theme });
      },
      
      getColors: () => {
        // Always return dark colors
        return darkColors;
      },
      
      clearHistory: () => {
        set({ comparisons: [], cachedComparisons: [] });
      },
      
      setOfflineStatus: (isOffline: boolean) => {
        set({ isOffline });
      },
      
      cacheComparison: (comparison: ComparisonResult) => {
        set(state => ({
          cachedComparisons: [comparison, ...state.cachedComparisons.slice(0, 9)] // Keep last 10
        }));
      },
      
      getCachedComparisons: () => {
        const { cachedComparisons, isOffline } = get();
        return isOffline ? cachedComparisons : [];
      },
    }),
    {
      name: "league-checker-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        comparisons: state.comparisons,
        freeComparisonUsed: state.freeComparisonUsed,
        isPremium: state.isPremium,
        theme: state.theme,
        cachedComparisons: state.cachedComparisons,
      }),
    }
  )
);