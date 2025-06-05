export const subscriptionPlans = [
  {
    id: "weekly",
    name: "Weekly",
    price: "$4.99",
    interval: "week" as const,
    popular: false,
  },
  {
    id: "monthly",
    name: "Monthly", 
    price: "$9.99",
    interval: "month" as const,
    popular: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$49.99",
    interval: "one-time" as const,
    popular: false,
  },
];