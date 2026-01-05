"use client";

import { useMealPlan } from "@/src/hooks/useMealPlan";
import { useMealPlanCalendar } from "@/src/hooks/useMealPlanCalendar";
import { MealPlanView } from "./MealPlanView";

export function MealPlanContainer() {
  const {
    currentYear,
    currentMonth,
    selectedStage,
    plan,
    loading,
    error,
    setCurrentYear,
    setCurrentMonth,
    setSelectedStage,
  } = useMealPlan();

  const calendar = useMealPlanCalendar(currentYear, currentMonth, plan);

  const handlePrevMonth = () => {
    const prev = new Date(currentYear, currentMonth - 2, 1);
    setCurrentYear(prev.getFullYear());
    setCurrentMonth(prev.getMonth() + 1);
  };

  const handleNextMonth = () => {
    const next = new Date(currentYear, currentMonth, 1);
    setCurrentYear(next.getFullYear());
    setCurrentMonth(next.getMonth() + 1);
  };

  return (
    <MealPlanView
      currentYear={currentYear}
      currentMonth={currentMonth}
      selectedStage={selectedStage}
      loading={loading}
      error={error}
      onStageChange={setSelectedStage}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
      calendar={calendar}
    />
  );
}

