import { Celebrity } from "@/types";

export const celebrities: Celebrity[] = [
  // Actors
  {
    id: "1",
    name: "Ryan Gosling",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.92,
    category: "actors"
  },
  {
    id: "2", 
    name: "Emma Stone",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.89,
    category: "actors"
  },
  {
    id: "3",
    name: "Michael B. Jordan",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.94,
    category: "actors"
  },
  {
    id: "4",
    name: "Margot Robbie",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.91,
    category: "actors"
  },
  {
    id: "5",
    name: "Chris Hemsworth",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.93,
    category: "actors"
  },
  {
    id: "6",
    name: "Zendaya",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.90,
    category: "actors"
  },

  // Music
  {
    id: "7",
    name: "The Weeknd",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.88,
    category: "music"
  },
  {
    id: "8",
    name: "Ariana Grande",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.87,
    category: "music"
  },
  {
    id: "9",
    name: "Bruno Mars",
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.85,
    category: "music"
  },
  {
    id: "10",
    name: "Billie Eilish",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.86,
    category: "music"
  },

  // Sports
  {
    id: "11",
    name: "Cristiano Ronaldo",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.89,
    category: "sports"
  },
  {
    id: "12",
    name: "Serena Williams",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.88,
    category: "sports"
  },

  // Models
  {
    id: "13",
    name: "Gigi Hadid",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.92,
    category: "models"
  },
  {
    id: "14",
    name: "David Beckham",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.90,
    category: "models"
  },

  // Politics
  {
    id: "15",
    name: "Alexandria Ocasio-Cortez",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.84,
    category: "politics"
  },
  {
    id: "16",
    name: "Justin Trudeau",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    beautyScore: 0.83,
    category: "politics"
  }
];

export const categoryLabels = {
  actors: "Actors",
  music: "Music",
  sports: "Sports", 
  models: "Models",
  politics: "Politics"
};