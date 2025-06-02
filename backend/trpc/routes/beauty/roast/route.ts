import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export default publicProcedure
  .input(z.object({ 
    userImageUrl: z.string(),
    gender: z.enum(["male", "female"]).optional()
  }))
  .mutation(async ({ input }) => {
    // In a real app, this would call an AI service to generate a roast
    // For demo purposes, we'll return mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock roasts
    const roasts = [
      "I've seen better-looking faces on a potato. And the potato had more personality too!",
      "Your face is so asymmetrical, it looks like Picasso designed it during his experimental phase.",
      "If beauty were time, you'd be 3:45 AM on a Monday morning.",
      "Your selfie game is so weak, even your phone's front camera is trying to auto-delete.",
      "You're not ugly, you're just... well, let's say you've got a face that's perfect for radio.",
      "I'd roast your looks, but it seems like genetics already did that for me.",
      "Your face has more filters than a Starbucks coffee machine, and still couldn't get the job done.",
      "If you were a spice, you'd be flour. Basic and forgettable.",
      "Your beauty score is like your credit score - technically a number, but nothing to brag about.",
      "I've seen more definition in a foggy mirror than in your jawline."
    ];
    
    // Select a random roast
    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    
    return {
      roast: randomRoast,
      timestamp: new Date().toISOString()
    };
  });