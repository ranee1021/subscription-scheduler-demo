import { useMemo } from "react";
import type { MonthlyMealPlan } from "@/src/domain/meal/types";
import { getMonthMeta } from "@/src/utils/date";

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

export function useMealPlanCalendar(year: number, month: number, plan: MonthlyMealPlan | null) {
  const { firstWeekday, daysInMonth } = useMemo(
    () => getMonthMeta(year, month, plan?.days.length),
    [year, month, plan]
  );

  const cells = useMemo(() => {
    const result: Array<
      | {
          type: "empty";
          key: string;
        }
      | {
          type: "day";
          key: string;
          date: string;
          dayNumber: number;
          menus: string[];
        }
    > = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      result.push({ type: "empty", key: `empty-${i}` });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = plan?.days[day - 1]?.date ?? "";
      const menus = plan?.days[day - 1]?.menus ?? [];
      const key = date
        ? `day-${date}`
        : `day-${year}-${month}-${day}`;

      result.push({
        type: "day",
        key,
        date,
        dayNumber: day,
        menus,
      });
    }

    return result;
  }, [firstWeekday, daysInMonth, plan, year, month]);

  const isDecember = plan?.year === 2025 && plan?.month === 12;

  return {
    cells,
    isDecember,
    dayLabels,
  };
}

