import { useState, useEffect, useMemo } from "react";
import type { Product } from "@/src/domain/product/types";
import type { DeliveryFrequency } from "@/src/domain/schedule/types";
import { generateDeliverySchedules } from "@/src/domain/schedule/generateSchedule";
import { generatePaymentAttempts } from "@/src/domain/payment/generatePayment";
import { PERIOD_OPTIONS, type PeriodOption } from "@/src/constants/order";

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

