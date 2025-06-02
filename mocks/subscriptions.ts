import { SubscriptionPlan } from "@/types";

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$9.99",
    interval: "month",
    features: [
      "Unlimited comparisons",
      "Celebrity comparisons",
      "AI beauty analysis",
      "AI roast feature",
      "Save history"
    ]
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$59.99",
    interval: "year",
    features: [
      "Unlimited comparisons",
      "Celebrity comparisons",
      "AI beauty analysis",
      "AI roast feature",
      "Save history",
      "50% savings vs monthly"
    ],
    popular: true
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$149.99",
    interval: "one-time",
    features: [
      "Unlimited comparisons",
      "Celebrity comparisons",
      "AI beauty analysis",
      "AI roast feature",
      "Save history",
      "All future updates",
      "No recurring payments"
    ]
  }
];