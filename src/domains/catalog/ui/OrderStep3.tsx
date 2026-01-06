"use client";

import { StepNavigation } from "@/src/shared-ui";
import { DeliveryCalendar } from "./DeliveryCalendar";
import type { useDeliveryCalendar, useProductOrderForm } from "../../subscription/usecases";

interface OrderStep3Props {
  calendar: ReturnType<typeof useDeliveryCalendar>;
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onPrevious: () => void;
  onNext: () => void;
  showPrevious?: boolean;
}

export function OrderStep3({
  calendar,
  selectedDate,
  onDateClick,
  onPrevious,
  onNext,
  showPrevious = true,
}: OrderStep3Props) {
  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        첫 배송일을 선택하세요
      </h3>

      <DeliveryCalendar
        calendar={calendar}
        selectedDate={selectedDate}
        onDateClick={onDateClick}
      />

      <StepNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        showPrevious={showPrevious}
        nextDisabled={!selectedDate}
      />
    </div>
  );
}

