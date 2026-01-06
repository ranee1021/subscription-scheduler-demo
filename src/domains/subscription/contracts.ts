/**
 * Subscription 도메인 계약 (타입 정의)
 */

export interface DeliverySchedule {
  sequence: number;
  originalDeliveryDate: Date;
  productionDate: Date;
}

export type DeliveryFrequency = "주3회" | "매일배송";

export type MealStageId = "초기" | "중기";

export interface MealStage {
  id: MealStageId;
  label: string;
  menusPerDay: number;
}

export interface DailyMeal {
  date: string; // ISO 날짜 문자열
  menus: string[];
}

export interface MonthlyMealPlan {
  year: number;
  month: number; // 1-12
  stageId: MealStageId;
  days: DailyMeal[];
}

export interface PaymentAttempt {
  daysBefore: number;
  attemptDate: Date;
}

