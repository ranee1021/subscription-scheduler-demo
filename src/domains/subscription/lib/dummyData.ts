import type { DailyMeal, MealStage, MealStageId, MonthlyMealPlan } from "../contracts";
import type { Product } from "../../catalog/contracts";

export const mealStages: MealStage[] = [
  {
    id: "초기",
    label: "초기",
    menusPerDay: 2,
  },
  {
    id: "중기",
    label: "중기",
    menusPerDay: 3,
  },
];

/**
 * meal 메뉴를 단품으로도 주문할 수 있도록 Product 형태의 더미 상품으로 정의한 데이터
 */
export const mealMenuProducts: Product[] = [
  // 초기 단계 단품들 - 실제 데이터는 필요시 추가
];

export const earlyStageMenuIds: string[] =
  mealMenuProducts
    .filter((p) => p.mealStageId === "초기")
    .map((p) => p.id);

export const midStageMenuIds: string[] =
  mealMenuProducts
    .filter((p) => p.mealStageId === "중기")
    .map((p) => p.id);

function getMenusByStage(stageId: MealStageId): {
  menus: string[];
  menusPerDay: number;
} {
  const stage = mealStages.find((s) => s.id === stageId);
  if (!stage) {
    throw new Error(`Unknown stage: ${stageId}`);
  }

  const menuIds = stageId === "초기" ? earlyStageMenuIds : midStageMenuIds;
  const menus = menuIds.map((id) => {
    const product = mealMenuProducts.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Unknown meal product id in plan: ${id}`);
    }
    return product.name;
  });

  return {
    menus,
    menusPerDay: stage.menusPerDay,
  };
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function toISODate(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/**
 * 월 단위 식단표를 생성합니다.
 */
export function generateMonthlyMealPlan(
  stageId: MealStageId,
  year: number,
  month: number
): MonthlyMealPlan {
  const { menus, menusPerDay } = getMenusByStage(stageId);
  const daysInMonth = getDaysInMonth(year, month);

  const days: DailyMeal[] = [];
  let menuIndex = 0;

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dailyMenus: string[] = [];

    for (let i = 0; i < menusPerDay; i += 1) {
      dailyMenus.push(menus[menuIndex % menus.length]);
      menuIndex += 1;
    }

    days.push({
      date: toISODate(year, month, day),
      menus: dailyMenus,
    });
  }

  return {
    year,
    month,
    stageId,
    days,
  };
}

