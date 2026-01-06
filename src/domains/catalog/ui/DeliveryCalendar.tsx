"use client";

import { isSameDate } from "@/src/shared-ui/lib/format";
import type { useDeliveryCalendar } from "../../subscription/usecases";

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

interface DeliveryCalendarProps {
  calendar: ReturnType<typeof useDeliveryCalendar>;
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
}

export function DeliveryCalendar({
  calendar,
  selectedDate,
  onDateClick,
}: DeliveryCalendarProps) {
  const {
    calendarDays,
    firstDayOfWeek,
    isDeliveryDate,
    getDeliverySequence,
    isDateSelectable,
    isFirstDeliveryDate,
    isLastDeliveryDate,
    isInDeliveryPeriod,
  } = calendar;

  return (
    <div className="calendar">
      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {calendarDays.map((date, index) => {
          const isSelected = selectedDate && isSameDate(selectedDate, date);
          const isDelivery = isDeliveryDate(date);
          const isToday = isSameDate(date, new Date());
          const isSelectable = isDateSelectable(date);
          const sequence = getDeliverySequence(date);
          const firstDeliv = isFirstDeliveryDate(date);
          const lastDeliv = isLastDeliveryDate(date);
          const inPeriod = isInDeliveryPeriod(date);

          let bgClass = "";
          let cursorClass = "";
          let borderClass = "";

          if (!isSelectable) {
            bgClass = "text-gray-300";
            cursorClass = "cursor-default";
            borderClass = "";
          } else if (isSelected) {
            bgClass = "bg-indigo-600 text-white font-semibold";
            cursorClass = "cursor-pointer";
            borderClass = "";
          } else if (isToday) {
            bgClass = "bg-gray-100 text-gray-900 font-medium";
            cursorClass = "cursor-pointer";
            borderClass = "border border-dashed border-gray-300";
          } else {
            bgClass = "text-gray-700";
            cursorClass = "cursor-pointer";
            borderClass = "border border-dashed border-gray-300";
          }

          return (
            <div key={index} className="relative">
              {inPeriod && (
                <div className="pointer-events-none absolute inset-0 rounded-lg bg-indigo-50/30" />
              )}

              <button
                type="button"
                onClick={() => onDateClick(date)}
                disabled={!isSelectable}
                className={`relative aspect-square w-full rounded-lg text-sm transition ${bgClass} ${cursorClass} ${borderClass} disabled:hover:bg-transparent disabled:opacity-60`}
              >
                <div>{date.getDate()}</div>
                {isDelivery && sequence && (
                  <div className="absolute right-0.5 top-0.5 rounded bg-indigo-200 px-1 text-[10px] font-bold text-indigo-800">
                    {sequence}차
                  </div>
                )}
              </button>
              {firstDeliv && (
                <div className="absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2">
                  <div className="whitespace-nowrap rounded bg-indigo-600 px-2 py-1 text-[10px] font-medium text-white shadow-lg">
                    식단 시작일
                  </div>
                  <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-indigo-600" />
                </div>
              )}
              {lastDeliv && (
                <div className="absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2">
                  <div className="whitespace-nowrap rounded bg-indigo-600 px-2 py-1 text-[10px] font-medium text-white shadow-lg">
                    식단 마지막 배송일
                  </div>
                  <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-indigo-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-indigo-600" />
          <span>선택된 첫 배송일</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-dashed border-gray-300" />
          <span>선택 가능 날짜</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-indigo-200 bg-indigo-50/30" />
          <span>정기배송 기간</span>
        </div>
      </div>
    </div>
  );
}

