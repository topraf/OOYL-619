import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, Target, ComparisonResult, LeagueStatus } from "@/types";

interface UserState {
  user: User;
  currentTarget: Target | null;
  comparisons: ComparisonResult[];
  freeComparisonUsed: boolean;
  isPremium: boolean;
  isLoading: boolean;
  
  setUserGender: (gender: "male" | "female") => void;
  setUserFrontImage: (uri: string) => void;
  setTargetImage: (uri: string, name?: string, isCelebrity?: boolean) => void;
  clearCurrentTarget: () => void;
  resetUserImages: () => void;
  
  compareWithTarget: () => Promise<ComparisonResult | null>;
  
  setPremiumStatus: (status: boolean) => void;
  
  clearHistory: () => void;
}

const initialUser: User = {
  id: "user_" + Date.now().toString(),
  gender: "male",
  frontImage: null,
  beautyScore: null,
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
            beautyScore: uri ? Math.random() * 0.5 + 0.3 : null,
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
            beautyScore: null,
          },
          currentTarget: null
        }));
      },
      
      compareWithTarget: async () => {
        const { user, currentTarget, freeComparisonUsed, isPremium } = get();
        
        // Check if user has image and target has an image
        if (!user.frontImage || !currentTarget?.image) {
          return null;
        }
        
        // Check if user has used free comparison and is not premium
        if (freeComparisonUsed && !isPremium) {
          return null;
        }
        
        set({ isLoading: true });
        
        // Simulate API call delay
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
        
        const result: ComparisonResult = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          user: { ...user },
          target: { ...currentTarget },
          leagueStatus,
          isPremium: isPremium,
        };
        
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
      
      clearHistory: () => {
        set({ comparisons: [] });
      },
    }),
    {
      name: "league-checker-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        comparisons: state.comparisons,
        freeComparisonUsed: state.freeComparisonUsed,
        isPremium: state.isPremium,
      }),
    }
  )
);