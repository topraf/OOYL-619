import { Celebrity } from "@/types";

export const celebrities: Celebrity[] = [
  {
    id: "1",
    name: "Emma Stone",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.92,
    category: "actors"
  },
  {
    id: "2", 
    name: "Ryan Gosling",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.89,
    category: "actors"
  },
  {
    id: "3",
    name: "Zendaya",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.95,
    category: "actors"
  },
  {
    id: "4",
    name: "Michael B. Jordan",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.91,
    category: "actors"
  },
  {
    id: "5",
    name: "Taylor Swift",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.88,
    category: "music"
  },
  {
    id: "6",
    name: "The Weeknd",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.85,
    category: "music"
  },
  {
    id: "7",
    name: "Ariana Grande",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.90,
    category: "music"
  },
  {
    id: "8",
    name: "Bruno Mars",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.83,
    category: "music"
  },
  {
    id: "9",
    name: "Alexandria Ocasio-Cortez",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.86,
    category: "politics"
  },
  {
    id: "10",
    name: "Justin Trudeau",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.84,
    category: "politics"
  },
  {
    id: "11",
    name: "Jacinda Ardern",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.87,
    category: "politics"
  },
  {
    id: "12",
    name: "Emmanuel Macron",
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.79,
    category: "politics"
  },
  {
    id: "13",
    name: "Serena Williams",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.89,
    category: "sports"
  },
  {
    id: "14",
    name: "Cristiano Ronaldo",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.92,
    category: "sports"
  },
  {
    id: "15",
    name: "Simone Biles",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.88,
    category: "sports"
  },
  {
    id: "16",
    name: "Lewis Hamilton",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    beautyScore: 0.85,
    category: "sports"
  }
];

export const celebrityCategories = [
  { id: "all", name: "All", emoji: "🌟" },
  { id: "actors", name: "Actors", emoji: "🎬" },
  { id: "music", name: "Music", emoji: "🎵" },
  { id: "politics", name: "Politics", emoji: "🏛️" },
  { id: "sports", name: "Sports", emoji: "⚽" }
];