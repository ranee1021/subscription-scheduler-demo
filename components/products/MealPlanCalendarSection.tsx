"use client";

import type { MonthlyMealPlan } from "@/src/domain/meal/types";
import { getMonthMeta } from "@/src/utils/date";

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

      <div className="overflow-hidden rounded-lg border border-gray-100">
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50 text-center text-xs font-medium text-gray-500">
          {dayLabels.map((label) => (
            <div key={label} className="px-2 py-2">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-100">
          {mealCells.map((cell) =>
            cell.type === "empty" ? (
              <div
                key={cell.key}
                className="h-24 bg-white/60"
                aria-hidden="true"
              />
            ) : (
              <div
                key={cell.key}
                className="flex h-24 flex-col bg-white p-2 text-xs"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    {cell.dayNumber}
                  </span>
                </div>
                <ul className="mt-1 space-y-0.5">
                  {cell.menus.map((menu) => (
                    <li
                      key={menu}
                      className="truncate rounded bg-gray-50 px-1 py-0.5 text-[11px] text-gray-700"
                      title={menu}
                    >
                      {menu}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

