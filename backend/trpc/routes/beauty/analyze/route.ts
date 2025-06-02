import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export default publicProcedure
  .input(z.object({ 
    userImageUrl: z.string(),
    targetImageUrl: z.string().optional(),
    gender: z.enum(["male", "female"]).optional()
  }))
  .mutation(async ({ input }) => {
    // In a real app, this would call an AI service to analyze the images
    // For demo purposes, we'll return mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userScore = Math.random() * 0.5 + 0.3; // Between 0.3 and 0.8
    const targetScore = input.targetImageUrl ? Math.random() * 0.5 + 0.4 : null; // Between 0.4 and 0.9
    
    // Calculate league status if target image is provided
    let leagueStatus = null;
    if (targetScore) {
      const scoreDiff = targetScore - userScore;
      
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
    }
    
    // Generate feature scores
    const featureScores = [
      { name: "Facial Symmetry", score: Math.round(Math.random() * 40 + 60), status: Math.random() > 0.5 ? "High" : "Mid" },
      { name: "Jawline", score: Math.round(Math.random() * 40 + 40), status: Math.random() > 0.7 ? "High" : "Mid" },
      { name: "Eyes", score: Math.round(Math.random() * 40 + 50), status: Math.random() > 0.6 ? "High" : "Mid" },
      { name: "Skin", score: Math.round(Math.random() * 40 + 60), status: Math.random() > 0.5 ? "High" : "Mid" },
    ];
    
    return {
      userScore,
      targetScore,
      leagueStatus,
      featureScores,
      analysisDate: new Date().toISOString()
    };
  });