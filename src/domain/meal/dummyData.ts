import { DailyMeal, MealStage, MealStageId, MonthlyMealPlan } from "./types";
import type { Product } from "../product/types";

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

export const earlyStageMenus: string[] = [
  "한우청경채죽",
  "양배추당근죽",
  "한우대추사과죽",
  "브로콜리감자죽",
  "닭고기단호박죽",
  "고구마찹쌀죽",
  "한우감자죽",
  "바나나배죽",
  "수수닭죽",
  "사과고구마죽",
  "한우양배추찹쌀죽",
  "감자당근죽",
  "브로콜리닭죽",
  "수수고구마죽",
  "한우근대죽",
  "사과타락죽",
  "한우적채죽",
  "애호박사과죽",
  "현미닭죽",
  "고구마브로콜리죽",
  "한우김가루죽",
  "찹쌀배죽",
  "애호박닭죽",
  "콜리플라워당근죽",
  "한우사과죽",
  "오트밀단호박죽",
  "찹쌀비타민닭죽",
  "고구마타락죽",
  "한우수수죽",
  "한우단호박당근죽",
  "고구마오트밀죽",
  "한우무죽",
  "브로콜리양배추죽",
];

export const midStageMenus: string[] = [
  "한우가지두부죽",
  "닭살사과고구마죽",
  "한우알배추죽",
  "찹쌀사과죽",
  "한우당근사과죽",
  "오트밀채소닭죽",
  "한우새송이순두부죽",
  "오트밀감자죽",
  "한우흑미배죽",
  "야채닭죽",
  "한우오이애호박죽",
  "병어리콩바나나죽",
  "한우양배추과일죽",
  "비타민채흰살생선죽",
  "한우애호박무죽",
  "닭살청경채당근죽",
  "한우시금치사과죽",
  "알밤고구마죽",
  "한우차조콜리죽",
  "블루베리고구마죽",
  "김연근한우죽",
  "닭고기단호박배죽",
  "한우아욱감자죽",
  "녹두대추닭죽",
  "한우검은콩애호박죽",
  "사과브로콜리죽",
];

/**
 * meal 메뉴를 단품으로도 주문할 수 있도록
 * Product 형태의 더미 상품으로 변환한 데이터
 */
function createMealMenuProductsFromNames(
  names: string[],
  stageId: MealStageId,
  baseIdPrefix: string,
  baseCreatedAt: Date,
  unitPrice: number
): Product[] {
  return names.map((name, index) => {
    const seq = String(index + 1).padStart(2, "0");
    return {
      id: `${baseIdPrefix}-${seq}`,
      name,
      description: `${stageId} 단품 메뉴`,
      kind: "단품",
      mealStageId: stageId,
      periodOptions: [
        {
          period: "1주",
          price: unitPrice,
        },
      ],
      createdAt: baseCreatedAt,
    };
  });
}

const earlyMenuProducts: Product[] = createMealMenuProductsFromNames(
  earlyStageMenus,
  "초기",
  "meal-early",
  new Date("2025-12-01"),
  3500
);

const midMenuProducts: Product[] = createMealMenuProductsFromNames(
  midStageMenus,
  "중기",
  "meal-mid",
  new Date("2025-12-01"),
  3800
);

/**
 * 모든 meal 단품 상품 목록
 * - kind: "단품"
 * - mealStageId: "초기" | "중기"
 */
export const mealMenuProducts: Product[] = [
  ...earlyMenuProducts,
  ...midMenuProducts,
];

function getMenusByStage(stageId: MealStageId): {
  menus: string[];
  menusPerDay: number;
} {
  const stage = mealStages.find((s) => s.id === stageId);
  if (!stage) {
    throw new Error(`Unknown stage: ${stageId}`);
  }

  const menus = stageId === "초기" ? earlyStageMenus : midStageMenus;
  return {
    menus,
    menusPerDay: stage.menusPerDay,
  };
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate(); // month는 1-12 기준
}

function toISODate(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/**
 * 월 단위 식단표를 생성합니다.
 * 현재는 12월 데이터만 실제 서비스에 사용할 예정이지만,
 * 함수는 다른 월에도 재사용 가능하도록 만들어 둡니다.
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

