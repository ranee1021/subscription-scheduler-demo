import { useEffect, useMemo, useState } from "react";
import type { MealStageId, MonthlyMealPlan } from "@/src/domain/meal/types";

export function useMealPlan() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(12);
  const [selectedStage, setSelectedStage] = useState<MealStageId>("초기");
  const [plan, setPlan] = useState<MonthlyMealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadPlan() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          year: String(currentYear),
          month: String(currentMonth),
          stageId: selectedStage,
        });

        const res = await fetch(`/api/meal-plans?${params.toString()}`);
        if (!res.ok) {
          throw new Error("식단표 API 호출 실패");
        }

        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error ?? "식단표 로드 실패");
        }

        if (!cancelled) {
          setPlan(json.data as MonthlyMealPlan);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : "식단표를 불러오는데 실패했습니다."
          );
          setPlan(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPlan();

    return () => {
      cancelled = true;
    };
  }, [currentYear, currentMonth, selectedStage]);

  return {
    currentYear,
    currentMonth,
    selectedStage,
    plan,
    loading,
    error,
    setCurrentYear,
    setCurrentMonth,
    setSelectedStage,
  };
}

