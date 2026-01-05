"use client";

import { mealStages } from "@/src/domain/meal/dummyData";
import type { MealStageId } from "@/src/domain/meal/types";
import { getMonthLabel, splitDate } from "@/src/utils/date";
import type { useMealPlanCalendar } from "@/src/hooks/useMealPlanCalendar";

interface MealPlanViewProps {
  currentYear: number;
  currentMonth: number;
  selectedStage: MealStageId;
  loading: boolean;
  error: string | null;
  onStageChange: (stage: MealStageId) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  calendar: ReturnType<typeof useMealPlanCalendar>;
}

export function MealPlanView({
  currentYear,
  currentMonth,
  selectedStage,
  loading,
  error,
  onStageChange,
  onPrevMonth,
  onNextMonth,
  calendar,
}: MealPlanViewProps) {
  const { cells, isDecember, dayLabels } = calendar;

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
                onClick={() => onStageChange(stage.id)}
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
              onClick={onPrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              ◀
            </button>
            <div className="text-lg font-semibold text-slate-900">
              {getMonthLabel(currentYear, currentMonth)}
            </div>
            <button
              type="button"
              onClick={onNextMonth}
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

