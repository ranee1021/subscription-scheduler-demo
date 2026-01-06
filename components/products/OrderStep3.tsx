"use client";

import { StepNavigation } from "@/components/common";
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

      <StepNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        showPrevious={true}
        nextDisabled={!orderForm.selectedDate}
      />
    </div>
  );
}

