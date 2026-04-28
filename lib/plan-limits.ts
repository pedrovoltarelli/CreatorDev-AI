export const FREE_MONTHLY_LIMIT = 5;

export function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

export function getMonthlyGenerations(): number {
  if (typeof window === "undefined") return 0;
  const monthKey = getMonthKey();
  const data = localStorage.getItem("monthly_generations");
  if (!data) return 0;
  try {
    const parsed = JSON.parse(data);
    if (parsed.month === monthKey) {
      return parsed.count;
    }
    return 0;
  } catch {
    return 0;
  }
}

export function incrementMonthlyGenerations(count: number = 1): void {
  if (typeof window === "undefined") return;
  const monthKey = getMonthKey();
  const current = getMonthlyGenerations();
  localStorage.setItem("monthly_generations", JSON.stringify({
    month: monthKey,
    count: current + count,
  }));
}

export function getRemainingGenerations(plan: string): number {
  if (plan !== "free") return Infinity;
  return Math.max(0, FREE_MONTHLY_LIMIT - getMonthlyGenerations());
}

export function canGenerate(plan: string, platformsCount: number): boolean {
  if (plan !== "free") return true;
  const remaining = getRemainingGenerations(plan);
  return remaining >= platformsCount;
}
