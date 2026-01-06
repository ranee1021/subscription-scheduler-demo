/**
 * Subscription 도메인 서비스 (API 호출)
 */

import { apiFetch } from "@/src/core/api/client";
import type { MonthlyMealPlan, MealStageId } from "./contracts";

export async function getMealPlan(
  year: number,
  month: number,
  stageId: MealStageId
): Promise<MonthlyMealPlan> {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
    stageId,
  });

  const response = await apiFetch<MonthlyMealPlan>(`/api/meal-plans?${params.toString()}`);

  if (!response.success || !response.data) {
    throw new Error(response.error || "식단표를 불러오는데 실패했습니다.");
  }

  return response.data;
}

