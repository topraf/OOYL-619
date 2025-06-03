export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  interval: "week" | "month" | "one-time";
  popular?: boolean;
  features: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "weekly",
    name: "Weekly",
    price: "€3.99",
    interval: "week",
    features: [
      "Unlimited comparisons",
      "Celebrity comparisons",
      "AI beauty analysis",
      "AI roast feature"
    ]
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "€9.00",
    interval: "month",
    popular: true,
    features: [
      "Unlimited comparisons",
      "Celebrity comparisons",
      "AI beauty analysis",
      "AI roast feature",
      "Priority support"
    ]
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "€29.00",
    interval: "one-time",
    features: [
      "Unlimited comparisons",
      "Celebrity comparisons",
      "AI beauty analysis",
      "AI roast feature",
      "Priority support",
      "Future features included"
    ]
  }
];