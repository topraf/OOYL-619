export const subscriptionPlans = [
  {
    id: "weekly",
    name: "Weekly",
    price: "€3.99",
    interval: "week" as const,
    popular: false,
  },
  {
    id: "monthly",
    name: "Monthly", 
    price: "€9.00",
    interval: "month" as const,
    popular: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "€29.00",
    interval: "one-time" as const,
    popular: false,
  },
];