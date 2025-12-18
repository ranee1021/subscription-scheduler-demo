export type MealStageId = "초기" | "중기";

export interface MealStage {
  id: MealStageId;
  label: string;
  menusPerDay: number;
}

export interface DailyMeal {
  /**
   * ISO 날짜 문자열 (예: "2024-12-01")
   */
  date: string;
  menus: string[];
}

export interface MonthlyMealPlan {
  year: number;
  /**
   * 1-12
   */
  month: number;
  stageId: MealStageId;
  days: DailyMeal[];
}

