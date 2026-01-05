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

/**
 * meal 메뉴를 단품으로도 주문할 수 있도록
 * Product 형태의 더미 상품으로 정의한 데이터
 * (실제 물리 데이터처럼 한 건 한 건 명시)
 */
export const mealMenuProducts: Product[] = [
  // 초기 단계 단품 (meal-early-01 ~)
  {
    id: "meal-early-01",
    name: "한우청경채죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-01.jpg",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-02",
    name: "양배추당근죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-02.jpg",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-03",
    name: "한우대추사과죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-03.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-04",
    name: "브로콜리감자죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-04.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-05",
    name: "닭고기단호박죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-05.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-06",
    name: "고구마찹쌀죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-06.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-07",
    name: "한우감자죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-07.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-08",
    name: "바나나배죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-08.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-09",
    name: "수수닭죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-09.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-10",
    name: "사과고구마죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-10.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-11",
    name: "한우양배추찹쌀죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-11.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-12",
    name: "감자당근죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-12.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-13",
    name: "브로콜리닭죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-13.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-14",
    name: "수수고구마죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-14.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-15",
    name: "한우근대죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-15.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-16",
    name: "사과타락죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-16.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-17",
    name: "한우적채죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-17.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-18",
    name: "애호박사과죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-18.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-19",
    name: "현미닭죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-19.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-20",
    name: "고구마브로콜리죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-20.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-21",
    name: "한우김가루죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-21.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-22",
    name: "찹쌀배죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-22.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-23",
    name: "애호박닭죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-23.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-24",
    name: "콜리플라워당근죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-24.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-25",
    name: "한우사과죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-25.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-26",
    name: "오트밀단호박죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-26.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-27",
    name: "찹쌀비타민닭죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-27.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-28",
    name: "고구마타락죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-28.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-29",
    name: "한우수수죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-29.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-30",
    name: "한우단호박당근죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-30.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-31",
    name: "고구마오트밀죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-31.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-32",
    name: "한우무죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-32.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-early-33",
    name: "브로콜리양배추죽",
    description: "초기 단품 메뉴",
    kind: "단품",
    mealStageId: "초기",
    imageUrl: "/products/meal-early-33.png",
    periodOptions: [{ period: "1주", price: 3500 }],
    createdAt: new Date("2025-12-01"),
  },

  // 중기 단계 단품 (meal-mid-01 ~)
  {
    id: "meal-mid-01",
    name: "한우가지두부죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-01.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-02",
    name: "닭살사과고구마죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-02.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-03",
    name: "한우알배추죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-03.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-04",
    name: "찹쌀사과죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-04.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-05",
    name: "한우당근사과죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-05.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-06",
    name: "오트밀채소닭죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-06.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-07",
    name: "한우새송이순두부죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-07.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-08",
    name: "오트밀감자죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-08.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-09",
    name: "한우흑미배죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-09.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-10",
    name: "야채닭죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-10.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-11",
    name: "한우오이애호박죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-11.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-12",
    name: "병어리콩바나나죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-12.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-13",
    name: "한우양배추과일죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-13.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-14",
    name: "비타민채흰살생선죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-14.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-15",
    name: "한우애호박무죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-15.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-16",
    name: "닭살청경채당근죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-16.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-17",
    name: "한우시금치사과죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-17.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-18",
    name: "알밤고구마죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-18.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-19",
    name: "한우차조콜리죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-19.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-20",
    name: "블루베리고구마죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-20.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-21",
    name: "김연근한우죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-21.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-22",
    name: "닭고기단호박배죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-22.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-23",
    name: "한우아욱감자죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-23.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-24",
    name: "녹두대추닭죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-24.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-25",
    name: "한우검은콩애호박죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-25.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "meal-mid-26",
    name: "사과브로콜리죽",
    description: "중기 단품 메뉴",
    kind: "단품",
    mealStageId: "중기",
    imageUrl: "/products/meal-mid-26.png",
    periodOptions: [{ period: "1주", price: 3800 }],
    createdAt: new Date("2025-12-01"),
  },
];

// 단계별 식단표에서 사용할 메뉴 id 시퀀스
// - "초기" 단계: 초기 단품들(id가 "meal-early-"로 시작)
// - "중기" 단계: 중기 단품들(id가 "meal-mid-"로 시작)
// 필요하면 여기에서 순서를 커스터마이징해도 되고,
// 기본값은 단품 정의 순서를 그대로 사용합니다.
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

  // 단계별로 사용할 메뉴 id 목록을 고르고,
  // 실제로 식단표에 보여줄 이름은 mealMenuProducts에서 lookup해서 가져온다.
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

