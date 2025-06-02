export interface User {
  id: string;
  gender: "male" | "female";
  frontImage: string | null;
  beautyScore: number | null;
}

export interface Target {
  id: string;
  image: string;
  name?: string;
  beautyScore: number | null;
  isCelebrity?: boolean;
}

export interface Celebrity {
  id: string;
  name: string;
  image: string;
  beautyScore: number;
}

export interface ComparisonResult {
  id: string;
  date: string;
  user: User;
  target: Target;
  leagueStatus: LeagueStatus;
  isPremium: boolean;
}

export type LeagueStatus = 
  | "way_beyond" 
  | "out_of_league" 
  | "slightly_above" 
  | "in_your_league" 
  | "slightly_below" 
  | "you_can_do_better";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  interval: string;
  features: string[];
  popular?: boolean;
}