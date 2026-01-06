"use client";

import type { MonthlyMealPlan, MealStageId } from "../contracts";

interface MealPlanViewProps {
  currentYear: number;
  currentMonth: number;
  selectedStage: MealStageId | null;
  plan: MonthlyMealPlan | null;
  loading: boolean;
  error: Error | null;
  onStageChange: (stage: MealStageId | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MealPlanView({
  currentYear,
  currentMonth,
  selectedStage,
  plan,
  loading,
  error,
  onStageChange,
  onPrevMonth,
  onNextMonth,
}: MealPlanViewProps) {
  // 실제 구현은 기존 MealPlanView를 참고하여 마이그레이션 필요
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">식단표</h1>
        {loading && <div>로딩 중...</div>}
        {error && <div>에러: {error.message}</div>}
        {plan && <div>식단표 데이터 표시</div>}
      </div>
    </div>
  );
}

