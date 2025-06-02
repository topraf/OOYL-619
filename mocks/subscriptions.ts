import { SubscriptionPlan } from "@/types";

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "weekly",
    name: "Weekly",
    price: "3.99€",
    interval: "week",
    features: [
      "Unlimited comparisons",
      "Celebrity comparisons",
      "AI beauty analysis",
      "AI roast feature",
      "Save history"
    ]
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "9€",
    interval: "month",
    features: [
      "Unlimited comparisons",
      "Celebrity comparisons",
      "AI beauty analysis",
      "AI roast feature",
      "Save history",
      "Save 10% vs weekly"
    ],
    popular: true
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "29€",
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