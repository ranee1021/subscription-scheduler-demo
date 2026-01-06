"use client";

import { StepNavigation } from "@/components/common";
import { DELIVERY_FREQUENCY_LABELS } from "@/src/constants/order";
import type { DeliveryFrequency } from "@/src/domain/schedule/types";

interface OrderStep2Props {
  deliveryFrequency: DeliveryFrequency;
  onFrequencyChange: (frequency: DeliveryFrequency) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function OrderStep2({
  deliveryFrequency,
  onFrequencyChange,
  onPrevious,
  onNext,
}: OrderStep2Props) {
  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        배송 주기를 선택해주세요
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onFrequencyChange("주3회")}
          className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition ${
            deliveryFrequency === "주3회"
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          }`}
        >
          {DELIVERY_FREQUENCY_LABELS["주3회"]}
        </button>
        <button
          type="button"
          onClick={() => onFrequencyChange("매일배송")}
          className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition ${
            deliveryFrequency === "매일배송"
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          }`}
        >
          {DELIVERY_FREQUENCY_LABELS["매일배송"]}
        </button>
      </div>

      <StepNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        showPrevious={true}
      />
    </div>
  );
}

