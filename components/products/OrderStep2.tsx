"use client";

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
          주 3회
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
          매일 배송(일요일 제외)
        </button>
      </div>

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
          className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          다음
        </button>
      </div>
    </div>
  );
}

