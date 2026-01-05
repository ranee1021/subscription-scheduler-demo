"use client";

import { DeliveryCalendar } from "./DeliveryCalendar";
import type { useDeliveryCalendar } from "@/src/hooks/useDeliveryCalendar";
import type { useProductOrderForm } from "@/src/hooks/useProductOrderForm";

interface OrderStep3Props {
  calendar: ReturnType<typeof useDeliveryCalendar>;
  orderForm: ReturnType<typeof useProductOrderForm>;
  onDateClick: (date: Date) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function OrderStep3({
  calendar,
  orderForm,
  onDateClick,
  onPrevious,
  onNext,
}: OrderStep3Props) {
  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        첫 배송일을 선택하세요
      </h3>

      <DeliveryCalendar
        calendar={calendar}
        selectedDate={orderForm.selectedDate}
        onDateClick={onDateClick}
      />

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onPrevious}
          className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!orderForm.selectedDate}
          className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}

