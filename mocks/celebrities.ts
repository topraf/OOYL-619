
import { Celebrity, CelebrityCategory } from "@/types";

export const celebrityCategories: CelebrityCategory[] = [
  { id: "all", name: "All", emoji: "🌟" },
  { id: "actors", name: "Actors", emoji: "🎬" },
  { id: "music", name: "Music", emoji: "🎵" },
  { id: "sports", name: "Sports", emoji: "⚽" },
  { id: "models", name: "Models", emoji: "👗" },
  { id: "influencers", name: "Influencers", emoji: "📱" },
  { id: "politics", name: "Politics", emoji: "🏛️" },
  { id: "business", name: "Business", emoji: "💼" },
  { id: "adult actors", name: "Adult actors", emoji: "🔞"},
];

export const celebrities: Celebrity[] = [
  {
    id: "1",
    name: "Brad Pitt",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.92,
    category: "actors",
    gender: "male"
  },
  {
    id: "2",
    name: "Angelina Jolie",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.94,
    category: "actors",
    gender: "female"
  },
  {
    id: "3",
    name: "Beyoncé",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.93,
    category: "music",
    gender: "female"
  },
  {
    id: "4",
    name: "Chris Hemsworth",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.91,
    category: "actors",
    gender: "male"
  },
  {
    id: "5",
    name: "Zendaya",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.92,
    category: "actors",
    gender: "female"
  },
  {
    id: "6",
    name: "Michael B. Jordan",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.90,
    category: "actors",
    gender: "male"
  },
  {
    id: "7",
    name: "Rihanna",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.93,
    category: "music",
    gender: "female"
  },
  {
    id: "8",
    name: "Idris Elba",
    image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.89,
    category: "actors",
    gender: "male"
  },
  {
    id: "9",
    name: "Gal Gadot",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.92,
    category: "actors",
    gender: "female"
  },
  {
    id: "10",
    name: "Harry Styles",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.88,
    category: "music",
    gender: "male"
  },
  {
    id: "11",
    name: "Margot Robbie",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.93,
    category: "actors",
    gender: "female"
  },
  {
    id: "12",
    name: "Cristiano Ronaldo",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.89,
    category: "sports",
    gender: "male"
  },
  {
    id: "13",
    name: "Kendall Jenner",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.91,
    category: "models",
    gender: "female"
  },
  {
    id: "14",
    name: "Timothée Chalamet",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.87,
    category: "actors",
    gender: "male"
  },
  {
    id: "15",
    name: "Dua Lipa",
    image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.90,
    category: "music",
    gender: "female"
  },
  {
    id: "16",
    name: "Tom Holland",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.86,
    category: "actors",
    gender: "male"
  },
  {
    id: "17",
    name: "Serena Williams",
    image: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.88,
    category: "sports",
    gender: "female"
  },
  {
    id: "18",
    name: "Elon Musk",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.82,
    category: "business",
    gender: "male"
  },
  {
    id: "19",
    name: "Emma Watson",
    image: "https://images.unsplash.com/photo-1557555187-23d685287bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.91,
    category: "actors",
    gender: "female"
  },
  {
    id: "20",
    name: "Barack Obama",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.85,
    category: "politics",
    gender: "male"
  },
];



/*
import { Celebrity } from "@/mocks/celebrity-test";

export function formatWikidataResult(raw: any[]): Celebrity[] {
  return raw.map((entry, index): Celebrity => ({
    id: entry.person.value.split("/").pop() || `${index}`,
    name: entry.personLabel?.value || "Unknown",
    image: entry.image?.value || "https://via.placeholder.com/300",
    beautyScore: Math.random(),
    category: "actors",
    gender:
        entry.genderLabel?.value?.toLowerCase() === "female" ? "female" : "male",
  }));
}
*/