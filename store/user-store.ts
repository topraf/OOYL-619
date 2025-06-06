/**
 * User Store - Main application state management using Zustand
 * 
 * This store manages the core application state including:
 * - User profile data (gender, photos, beauty scores)
 * - Comparison targets (people or celebrities to compare with)
 * - Comparison history and results
 * - Premium subscription status
 * - App settings and preferences
 * 
 * Key Features:
 * - Photo management for user selfies and target images
 * - Mock AI beauty analysis with realistic scoring
 * - League status calculation based on beauty score differences
 * - Premium feature gating
 * - Comparison history tracking
 * - Color theme management (dark theme with orange/pink gradients)
 * 
 * The store uses mock data for demonstration purposes. In a production app,
 * this would integrate with real AI services and backend APIs.
 * 
 * State Structure:
 * - user: User profile with photos and scores
 * - currentTarget: Selected comparison target
 * - comparisons: Array of completed comparisons
 * - freeComparisonUsed: Tracks if user has used their free comparison
 * - isPremium: Premium subscription status
 * - isLoading: Loading state for async operations
 */

import { create } from "zustand";
import { User, Target, ComparisonResult, LeagueStatus } from "@/types";
import { darkColors } from "@/constants/colors";

interface UserState {
  user: User & { gender?: "male" | "female" };
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
  getColors: () => typeof darkColors;
  
  clearHistory: () => void;
}

const initialUser: User & { gender?: "male" | "female" } = {
  id: "user_" + Date.now().toString(),
  gender: "male",
  frontImage: null,
  sideImage: null,
  beautyScore: 0,
};

export const useUserStore = create<UserState>()((set, get) => ({
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
    
    const result: ComparisonResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      user: { ...user },
      target: { ...currentTarget },
      leagueStatus,
      feedback: `Comparison completed with ${currentTarget.name || "target"}`,
      userImage: user.frontImage || "", // Add for compatibility
      celebrity: {
        id: currentTarget.id,
        name: currentTarget.name || "Unknown",
        image: currentTarget.image,
        beautyScore: currentTarget.beautyScore || 0.5,
        category: "unknown"
      }, // Add for compatibility
      score: Math.round((user.beautyScore || 0.5) * 100), // Add for compatibility
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
  
  getColors: () => {
    // Always return dark colors with orange/pink theme
    return darkColors;
  },
  
  clearHistory: () => {
    set({ comparisons: [] });
  },
}));