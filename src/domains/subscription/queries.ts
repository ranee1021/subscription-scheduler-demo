/**
 * Subscription 도메인 쿼리 (React Query/SWR 훅)
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { getMealPlan } from "./service";
import { getMonthMeta, splitDate } from "@/src/shared-ui/lib/format";
import type { MonthlyMealPlan, MealStageId } from "./contracts";

export function useMealPlan(
  year: number,
  month: number,
  stageId: MealStageId | null
) {
  const [plan, setPlan] = useState<MonthlyMealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!stageId) {
      setLoading(false);
      return;
    }

    const loadPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMealPlan(year, month, stageId);
        setPlan(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("식단표를 불러오는데 실패했습니다.")
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [year, month, stageId]);

  return { plan, loading, error };
}

export function useMealPlanCalendar(
  year: number,
  month: number,
  plan: MonthlyMealPlan | null
) {
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
    dayLabels: ["일", "월", "화", "수", "목", "금", "토"],
    splitDate,
  };
}
