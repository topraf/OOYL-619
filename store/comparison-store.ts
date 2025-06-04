import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ComparisonResult, Celebrity } from "@/types";
import { celebrities } from "@/mocks/celebrities";

interface ComparisonState {
  history: ComparisonResult[];
  currentImage: string | null;
  isLoading: boolean;
  cachedResults: ComparisonResult[];
  isOffline: boolean;
  
  addComparison: (userImage: string) => Promise<ComparisonResult>;
  clearHistory: () => void;
  clearCurrentImage: () => void;
  setOfflineStatus: (isOffline: boolean) => void;
  getCachedResults: () => ComparisonResult[];
  cacheResult: (result: ComparisonResult) => void;
  preloadImages: (results: ComparisonResult[]) => Promise<void>;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      history: [],
      currentImage: null,
      isLoading: false,
      cachedResults: [],
      isOffline: false,
      
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
          userImage: userImage,
          celebrity: randomCelebrity,
          score: score,
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
        };
        
        // Cache the result for offline access
        get().cacheResult(result);
        
        set(state => ({
          history: [result, ...state.history],
          currentImage: userImage,
          isLoading: false,
        }));
        
        return result;
      },
      
      clearHistory: () => set({ history: [], cachedResults: [] }),
      clearCurrentImage: () => set({ currentImage: null }),
      
      setOfflineStatus: (isOffline: boolean) => set({ isOffline }),
      
      getCachedResults: () => {
        const { cachedResults, isOffline } = get();
        return isOffline ? cachedResults : [];
      },
      
      cacheResult: (result: ComparisonResult) => {
        set(state => ({
          cachedResults: [result, ...state.cachedResults.slice(0, 19)] // Keep last 20
        }));
      },
      
      preloadImages: async (results: ComparisonResult[]) => {
        // In a real app, this would preload images for offline access
        // For now, we'll just simulate the process
        try {
          const imageUrls = results.flatMap(result => [
            result.userImage || "",
            result.celebrity.image
          ]);
          
          // Simulate image preloading
          await Promise.all(
            imageUrls.map(url => 
              new Promise(resolve => setTimeout(resolve, 100))
            )
          );
          
          console.log(`Preloaded ${imageUrls.length} images for offline access`);
        } catch (error) {
          console.error("Error preloading images:", error);
        }
      },
    }),
    {
      name: "beauty-comparison-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        history: state.history,
        cachedResults: state.cachedResults,
      }),
    }
  )
);