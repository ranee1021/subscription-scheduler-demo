export type ProductKind = "식단" | "단품";

export interface Product {
  id: string;
  name: string;
  description?: string;
  /**
   * 상품 유형 (식단 정기배송 / 일반 상품)
   */
  kind: ProductKind;
  /**
   * 식단 상품인 경우, 연결된 식단 단계 (예: "초기", "중기")
   * 일반 상품이면 undefined
   */
  mealStageId?: import("../meal/types").MealStageId;
  periodOptions: PeriodOption[];
  createdAt: Date;
}

export interface PeriodOption {
  period: "1주" | "2주" | "4주";
  price: number;
}


