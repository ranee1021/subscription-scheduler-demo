import { NextResponse } from "next/server";
import { generateMonthlyMealPlan } from "@/src/domain/meal/dummyData";
import type { MealStageId, MonthlyMealPlan } from "@/src/domain/meal/types";

type SearchParams = {
  year?: string;
  month?: string;
  stageId?: string;
};

function parseStageId(value: string | undefined): MealStageId {
  if (value === "초기" || value === "중기") {
    return value;
  }
  // 기본값: 초기
  return "초기";
}

function parseYear(value: string | undefined): number {
  const n = Number(value);
  if (!Number.isNaN(n) && n >= 2000 && n <= 2100) {
    return n;
  }
  return 2025;
}

function parseMonth(value: string | undefined): number {
  const n = Number(value);
  if (!Number.isNaN(n) && n >= 1 && n <= 12) {
    return n;
  }
  return 12;
}

/**
 * GET /api/meal-plans
 *
 * 쿼리스트링:
 * - year: 숫자 (예: 2025)
 * - month: 숫자 (1-12)
 * - stageId: "초기" | "중기"
 *
 * 응답:
 * - data: MonthlyMealPlan
 *
 * 지금은 generateMonthlyMealPlan을 이용한 더미 데이터지만,
 * 나중에는 이 자리에 DB/엑셀 기반 조회 로직을 넣으면 됩니다.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params: SearchParams = {
      year: searchParams.get("year") ?? undefined,
      month: searchParams.get("month") ?? undefined,
      stageId: searchParams.get("stageId") ?? undefined,
    };

    const year = parseYear(params.year);
    const month = parseMonth(params.month);
    const stageId = parseStageId(params.stageId);

    const plan: MonthlyMealPlan = generateMonthlyMealPlan(
      stageId,
      year,
      month
    );

    return NextResponse.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error("식단표 조회 실패:", error);
    return NextResponse.json(
      {
        success: false,
        error: "식단표를 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

