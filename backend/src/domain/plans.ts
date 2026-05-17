export type PlanType = "monthly" | "annual";

export const PLANS = {
  monthly: {
    value: Number(process.env.PLAN_MONTHLY_VALUE) || 180,
    cycle: "MONTHLY" as const,
    label: "Mensal",
    description: "Plano Mensal Academia",
  },
  annual: {
    value: Number(process.env.PLAN_ANNUAL_VALUE) || 1800,
    cycle: "YEARLY" as const,
    label: "Anual",
    description: "Plano Anual Academia",
  },
} as const;

export function getPlan(plan: PlanType) {
  return PLANS[plan];
}

export function isValidPlan(plan: string): plan is PlanType {
  return plan === "monthly" || plan === "annual";
}
