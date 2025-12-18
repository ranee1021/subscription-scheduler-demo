"use client";

import { useEffect, useMemo, useState } from "react";
import { mealStages } from "@/src/domain/meal/dummyData";
import type { MealStageId, MonthlyMealPlan } from "@/src/domain/meal/types";

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

function getMonthLabel(year: number, month: number) {
  return `${year}년 ${month}월`;
}

function getMonthMeta(year: number, month: number, plan?: MonthlyMealPlan) {
  const firstDay = new Date(year, month - 1, 1);
  const firstWeekday = firstDay.getDay(); // 0(일) - 6(토)
  const daysInMonth =
    plan?.days.length ?? new Date(year, month, 0).getDate();
  return { firstWeekday, daysInMonth };
}

function splitDate(date: string) {
  const [y, m, d] = date.split("-").map((v) => Number(v));
  return { year: y, month: m, day: d };
}

export default function MealPlanPage() {
  // 12월 한 달 분 먼저 노출
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(12);
  const [selectedStage, setSelectedStage] = useState<MealStageId>("초기");
  const [plan, setPlan] = useState<MonthlyMealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API에서 식단표 조회 (headless 패턴)
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

  const { firstWeekday, daysInMonth } = useMemo(
    () => getMonthMeta(currentYear, currentMonth, plan ?? undefined),
    [currentYear, currentMonth, plan]
  );

  const cells: Array<
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
    cells.push({ type: "empty", key: `empty-${i}` });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = plan?.days[day - 1]?.date ?? "";
    const menus = plan?.days[day - 1]?.menus ?? [];
    cells.push({
      type: "day",
      key: `day-${date}`,
      date,
      dayNumber: day,
      menus,
    });
  }

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

  const isDecember = plan?.year === 2025 && plan?.month === 12;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-md">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              식단표 캘린더
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              상단 탭에서 {"\""}초기{"\""}, {"\""}중기{"\""}를 선택해 단계별
              식단을 확인할 수 있어요.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 p-1">
            {mealStages.map((stage) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStage(stage.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  selectedStage === stage.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </header>

        <section className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              ◀
            </button>
            <div className="text-lg font-semibold text-slate-900">
              {getMonthLabel(currentYear, currentMonth)}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              ▶
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              * 현재는 2025년 12월 식단만 실제 데이터가 채워져 있습니다.
            </span>
            {loading && <span className="text-sky-500">불러오는 중...</span>}
            {error && (
              <span className="text-red-500">
                오류: {error}
              </span>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-medium text-slate-500">
            {dayLabels.map((label) => (
              <div key={label} className="px-2 py-2">
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-slate-200">
            {cells.map((cell) =>
              cell.type === "empty" ? (
                <div
                  key={cell.key}
                  className="h-28 bg-slate-50"
                  aria-hidden="true"
                />
              ) : (
                <div
                  key={cell.key}
                  className="flex h-28 flex-col bg-white p-2 text-xs"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      {cell.dayNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {cell.date
                        ? dayLabels[
                            new Date(
                              splitDate(cell.date).year,
                              splitDate(cell.date).month - 1,
                              splitDate(cell.date).day
                            ).getDay()
                          ]
                        : "-"}
                    </span>
                  </div>

                  {isDecember && cell.menus.length > 0 ? (
                    <ul className="mt-1 space-y-0.5">
                      {cell.menus.map((menu) => (
                        <li
                          key={menu}
                          className="truncate rounded bg-slate-50 px-1 py-0.5 text-[11px] text-slate-700"
                          title={menu}
                        >
                          {menu}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-3 text-[10px] text-slate-300">
                      {loading ? "불러오는 중..." : "식단 데이터 없음"}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

