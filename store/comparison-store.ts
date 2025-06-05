import { create } from "zustand";
import { ComparisonResult, Celebrity } from "@/types";
import { celebrities } from "@/mocks/celebrities";

interface ComparisonState {
  history: ComparisonResult[];
  currentImage: string | null;
  isLoading: boolean;
  
  addComparison: (userImage: string) => Promise<ComparisonResult>;
  clearHistory: () => void;
  clearCurrentImage: () => void;
}

export const useComparisonStore = create<ComparisonState>()((set, get) => ({
  history: [],
  currentImage: null,
  isLoading: false,
  
  addComparison: async (userImage: string) => {
    set({ isLoading: true });
    
    // Simulate API call delay with progress updates
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Randomly select a celebrity
    const randomCelebrity = celebrities[Math.floor(Math.random() * celebrities.length)];
    
    // Generate a random score between 70 and 95
    const score = Math.floor(Math.random() * 26) + 70;
    
    // Generate feedback based on score
    let feedback = "";
    if (score >= 90) {
      feedback = `Wow! You have striking similarities with ${randomCelebrity.name}! ✨`;
    } else if (score >= 80) {
      feedback = `Great match! You share many features with ${randomCelebrity.name}. 🎯`;
    } else {
      feedback = `You have some nice similarities with ${randomCelebrity.name}. 👍`;
    }
    
    const result: ComparisonResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      user: {
        id: "user-1",
        frontImage: userImage,
        sideImage: null,
        beautyScore: score / 100,
      },
      target: {
        id: randomCelebrity.id,
        name: randomCelebrity.name,
        image: randomCelebrity.image,
        beautyScore: randomCelebrity.beautyScore,
        isCelebrity: true,
      },
      leagueStatus: score >= 90 ? "in_your_league" : 
                    score >= 85 ? "slightly_above" : 
                    score >= 80 ? "slightly_below" : 
                    score >= 75 ? "out_of_league" : "way_beyond",
      feedback,
      userImage: userImage, // Add for compatibility
      celebrity: randomCelebrity, // Add for compatibility
      score: score, // Add for compatibility
    };
    
    set(state => ({
      history: [result, ...state.history],
      currentImage: userImage,
      isLoading: false,
    }));
    
    return result;
  },
  
  clearHistory: () => set({ history: [] }),
  clearCurrentImage: () => set({ currentImage: null }),
}));