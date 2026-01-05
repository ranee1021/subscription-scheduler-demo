import { useMemo } from "react";
import type { DeliverySchedule } from "@/src/domain/schedule/types";
import { isSameDate } from "@/src/utils/date";

export function useDeliveryCalendar(
  selectedDate: Date | null,
  schedules: DeliverySchedule[]
) {
  const lastDeliveryDate =
    schedules.length > 0
      ? schedules[schedules.length - 1].originalDeliveryDate
      : null;

  const getCalendarWeeks = (): Date[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayDayOfWeek = today.getDay();
    const daysToMonday = todayDayOfWeek === 0 ? -6 : 1 - todayDayOfWeek;

    const firstMonday = new Date(today);
    firstMonday.setDate(today.getDate() + daysToMonday);
    firstMonday.setHours(0, 0, 0, 0);

    let weeksToShow = 6;

    if (lastDeliveryDate) {
      const lastDeliveryDateOnly = new Date(
        lastDeliveryDate.getFullYear(),
        lastDeliveryDate.getMonth(),
        lastDeliveryDate.getDate()
      );
      const lastDayOf6Weeks = new Date(firstMonday);
      lastDayOf6Weeks.setDate(firstMonday.getDate() + 41);

      if (lastDeliveryDateOnly > lastDayOf6Weeks) {
        const lastDeliveryDayOfWeek = lastDeliveryDateOnly.getDay();
        const daysToLastMonday =
          lastDeliveryDayOfWeek === 0 ? -6 : 1 - lastDeliveryDayOfWeek;
        const lastDeliveryMonday = new Date(lastDeliveryDateOnly);
        lastDeliveryMonday.setDate(
          lastDeliveryDateOnly.getDate() + daysToLastMonday
        );

        const daysDiff = Math.ceil(
          (lastDeliveryMonday.getTime() - firstMonday.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        weeksToShow = Math.ceil(daysDiff / 7) + 1;
      }
    }

    const calendarDays: Date[] = [];
    const totalDays = weeksToShow * 7;
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(firstMonday);
      date.setDate(firstMonday.getDate() + i);
      calendarDays.push(date);
    }

    return calendarDays;
  };

  const calendarDays = useMemo(() => getCalendarWeeks(), [lastDeliveryDate]);

  const firstDayOfWeek = calendarDays.length > 0 ? calendarDays[0].getDay() : 0;

  const firstDeliveryDate =
    schedules.length > 0 ? schedules[0].originalDeliveryDate : null;

  const isDeliveryDate = (date: Date): boolean => {
    if (!selectedDate) return false;
    return schedules.some((schedule) =>
      isSameDate(schedule.originalDeliveryDate, date)
    );
  };

  const getDeliverySequence = (date: Date): number | null => {
    if (!selectedDate) return null;
    const schedule = schedules.find((s) =>
      isSameDate(s.originalDeliveryDate, date)
    );
    return schedule ? schedule.sequence : null;
  };

  const isDateSelectable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);
    minDate.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 21);
    maxDate.setHours(23, 59, 59, 999);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate.getDay() === 0) return false;

    return checkDate >= minDate && checkDate <= maxDate;
  };

  const isFirstDeliveryDate = (date: Date): boolean => {
    return firstDeliveryDate ? isSameDate(date, firstDeliveryDate) : false;
  };

  const isLastDeliveryDate = (date: Date): boolean => {
    return lastDeliveryDate ? isSameDate(date, lastDeliveryDate) : false;
  };

  const isInDeliveryPeriod = (date: Date): boolean => {
    if (!firstDeliveryDate || !lastDeliveryDate) return false;

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const firstOnly = new Date(
      firstDeliveryDate.getFullYear(),
      firstDeliveryDate.getMonth(),
      firstDeliveryDate.getDate()
    );
    const lastOnly = new Date(
      lastDeliveryDate.getFullYear(),
      lastDeliveryDate.getMonth(),
      lastDeliveryDate.getDate()
    );

    return dateOnly >= firstOnly && dateOnly <= lastOnly;
  };

  return {
    calendarDays,
    firstDayOfWeek,
    lastDeliveryDate,
    firstDeliveryDate,
    isDeliveryDate,
    getDeliverySequence,
    isDateSelectable,
    isFirstDeliveryDate,
    isLastDeliveryDate,
    isInDeliveryPeriod,
  };
}

