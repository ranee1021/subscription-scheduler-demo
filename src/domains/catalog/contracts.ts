/**
 * Catalog 도메인 계약 (타입 정의)
 */

export type ProductKind = "식단" | "단품";

export interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  kind: ProductKind;
  mealStageId?: import("../subscription/contracts").MealStageId;
  periodOptions: PeriodOption[];
  createdAt: Date;
}

export interface PeriodOption {
  period: "1주" | "2주" | "4주";
  price: number;
}

