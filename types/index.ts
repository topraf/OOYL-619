export type LeagueStatus = 
  | "way_beyond" 
  | "out_of_league" 
  | "slightly_above" 
  | "in_your_league" 
  | "slightly_below" 
  | "you_can_do_better";

export interface User {
  id: string;
  frontImage: string | null;
  sideImage: string | null;
  beautyScore: number;
}

export interface Target {
  id: string;
  name?: string;
  image: string;
  beautyScore: number;
  isCelebrity?: boolean;
}

export interface ComparisonResult {
  id: string;
  date: string;
  user: User;
  target: Target;
  leagueStatus: LeagueStatus;
  feedback: string;
  // Compatibility properties
  userImage: string;
  celebrity: Celebrity;
  score: number;
}

export interface Celebrity {
  id: string;
  name: string;
  image: string;
  beautyScore: number;
  category: string;
}

export interface CelebrityCategory {
  id: string;
  name: string;
  emoji: string;
}

export interface Subscription {
  id: string;
  title: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  savePercent?: string;
}