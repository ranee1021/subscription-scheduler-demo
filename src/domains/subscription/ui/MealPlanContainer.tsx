"use client";

import { useState } from "react";
import { useMealPlan } from "../queries";
import { MealPlanView } from "./MealPlanView";

export function MealPlanContainer() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(12);
  const [selectedStage, setSelectedStage] = useState<"초기" | "중기" | null>("초기");

  const { plan, loading, error } = useMealPlan(currentYear, currentMonth, selectedStage);

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
      plan={plan}
      loading={loading}
      error={error}
      onStageChange={setSelectedStage}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
    />
  );
}

