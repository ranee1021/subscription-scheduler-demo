/**
 * Subscription 도메인 유즈케이스 (비즈니스 로직)
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { generateDeliverySchedules } from "./lib/generateSchedule";
import { generatePaymentAttempts } from "./lib/generatePayment";
import type {
  DeliveryFrequency,
  DeliverySchedule,
  PaymentAttempt,
} from "./contracts";
import type { Product } from "../catalog/contracts";
import { PERIOD_OPTIONS, type PeriodOption } from "./constants";

export function useProductOrderForm(product: Product | null) {
  const periodOptions = useMemo(() => {
    return product?.periodOptions || [];
  }, [product]);

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>(
    PERIOD_OPTIONS[0]
  );
  const [deliveryFrequency, setDeliveryFrequency] =
    useState<DeliveryFrequency>("주3회");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (periodOptions.length > 0) {
      const isValidPeriod = periodOptions.some(
        (opt) => opt.period === selectedPeriod
      );
      if (!isValidPeriod) {
        setSelectedPeriod(periodOptions[0].period as PeriodOption);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodOptions]);

  const selectedPrice = useMemo(() => {
    return (
      periodOptions.find((opt) => opt.period === selectedPeriod)?.price || 0
    );
  }, [selectedPeriod, periodOptions]);

  const dailyPrice = useMemo(() => {
    const weeks = parseInt(selectedPeriod.replace("주", ""));
    return Math.round(selectedPrice / (weeks * 7));
  }, [selectedPeriod, selectedPrice]);

  const weeks = parseInt(selectedPeriod.replace("주", ""));
  const schedules = selectedDate
    ? generateDeliverySchedules(selectedDate, weeks, deliveryFrequency)
    : [];
  const lastDeliveryDate =
    schedules.length > 0
      ? schedules[schedules.length - 1].originalDeliveryDate
      : null;
  const paymentAttempts = lastDeliveryDate
    ? generatePaymentAttempts(lastDeliveryDate)
    : [];

  const reset = () => {
    if (periodOptions.length > 0) {
      setSelectedPeriod(periodOptions[0].period as PeriodOption);
    }
    setDeliveryFrequency("주3회");
    setSelectedDate(null);
  };

  return {
    selectedPeriod,
    setSelectedPeriod,
    deliveryFrequency,
    setDeliveryFrequency,
    selectedDate,
    setSelectedDate,
    periodOptions,
    selectedPrice,
    dailyPrice,
    schedules,
    lastDeliveryDate,
    paymentAttempts,
    reset,
  };
}

export function useDeliveryCalendar(
  selectedDate: Date | null,
  schedules: DeliverySchedule[]
) {
  const calendarDays = useMemo(() => {
    if (!selectedDate) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayDayOfWeek = today.getDay();
    const daysToMonday = todayDayOfWeek === 0 ? -6 : 1 - todayDayOfWeek;

    const firstMonday = new Date(today);
    firstMonday.setDate(today.getDate() + daysToMonday);
    firstMonday.setHours(0, 0, 0, 0);

    let weeksToShow = 6;

    const lastDeliveryDate =
      schedules.length > 0
        ? schedules[schedules.length - 1].originalDeliveryDate
        : null;

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

    const calendarDaysArray: Date[] = [];
    const totalDays = weeksToShow * 7;
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(firstMonday);
      date.setDate(firstMonday.getDate() + i);
      calendarDaysArray.push(date);
    }

    return calendarDaysArray;
  }, [selectedDate, schedules]);

  const firstDayOfWeek = calendarDays.length > 0 ? calendarDays[0].getDay() : 0;

  const isDeliveryDate = (date: Date): boolean => {
    return schedules.some(
      (schedule) =>
        schedule.originalDeliveryDate.toDateString() === date.toDateString()
    );
  };

  const getDeliverySequence = (date: Date): number | null => {
    const schedule = schedules.find(
      (s) => s.originalDeliveryDate.toDateString() === date.toDateString()
    );
    return schedule ? schedule.sequence : null;
  };

  const isDateSelectable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < today) return false;
    if (targetDate.getDay() === 0) return false;

    return true;
  };

  const isFirstDeliveryDate = (date: Date): boolean => {
    if (schedules.length === 0) return false;
    return (
      schedules[0].originalDeliveryDate.toDateString() === date.toDateString()
    );
  };

  const isLastDeliveryDate = (date: Date): boolean => {
    if (schedules.length === 0) return false;
    const lastSchedule = schedules[schedules.length - 1];
    return (
      lastSchedule.originalDeliveryDate.toDateString() === date.toDateString()
    );
  };

  const isInDeliveryPeriod = (date: Date): boolean => {
    if (schedules.length === 0) return false;
    const firstDate = schedules[0].originalDeliveryDate;
    const lastDate = schedules[schedules.length - 1].originalDeliveryDate;
    return date >= firstDate && date <= lastDate;
  };

  return {
    calendarDays,
    firstDayOfWeek,
    isDeliveryDate,
    getDeliverySequence,
    isDateSelectable,
    isFirstDeliveryDate,
    isLastDeliveryDate,
    isInDeliveryPeriod,
  };
}

