"use client";

import type { MonthlyMealPlan } from "../../subscription/contracts";
import { getMonthMeta } from "@/src/shared-ui/lib/format";

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

interface MealPlanCalendarSectionProps {
  mealPlan: MonthlyMealPlan | null;
  mealStageId: string;
}

export function MealPlanCalendarSection({
  mealPlan,
  mealStageId,
}: MealPlanCalendarSectionProps) {
  const { firstWeekday, daysInMonth } = getMonthMeta(2025, 12);

  const mealCells: Array<
    | { type: "empty"; key: string }
    | { type: "day"; key: string; dayNumber: number; menus: string[] }
  > = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    mealCells.push({ type: "empty", key: `empty-${i}` });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const menus = mealPlan?.days[day - 1]?.menus ?? [];
    mealCells.push({
      type: "day",
      key: `day-${day}`,
      dayNumber: day,
      menus,
    });
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">식단 정보</h2>
          <p className="mt-1 text-sm text-gray-500">
            2025년 12월 기준 {mealStageId} 식단표입니다.
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          2025년 12월 식단표
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {dayLabels.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {mealCells.map((cell) => {
            if (cell.type === "empty") {
              return (
                <div
                  key={cell.key}
                  className="aspect-square border-b border-r border-gray-100"
                />
              );
            }

            return (
              <div
                key={cell.key}
                className="aspect-square border-b border-r border-gray-100 p-2"
              >
                <div className="mb-1 text-xs font-semibold text-gray-900">
                  {cell.dayNumber}
                </div>
                <div className="space-y-1">
                  {cell.menus.map((menu, idx) => (
                    <div
                      key={idx}
                      className="truncate rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700"
                    >
                      {menu}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

