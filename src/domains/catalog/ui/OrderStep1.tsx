"use client";

import { StepNavigation, Price } from "@/src/shared-ui";
import type { PeriodOption } from "../../subscription/constants";

interface OrderStep1Props {
  periodOptions: Array<{ period: string; price: number }>;
  selectedPeriod: PeriodOption;
  selectedPrice: number;
  dailyPrice: number;
  onPeriodChange: (period: PeriodOption) => void;
  onNext: () => void;
  showPrevious?: boolean;
  onPrevious?: () => void;
}

export function OrderStep1({
  periodOptions,
  selectedPeriod,
  selectedPrice,
  dailyPrice,
  onPeriodChange,
  onNext,
  showPrevious = false,
  onPrevious,
}: OrderStep1Props) {
  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        이용기간을 선택해주세요
      </h3>
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-3">
          {periodOptions.map((option) => (
            <button
              key={option.period}
              type="button"
              onClick={() => onPeriodChange(option.period as PeriodOption)}
              className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition ${
                selectedPeriod === option.period
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <div>{option.period}</div>
              <div className="mt-1">
                <Price amount={option.price} size="md" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
        <div>
          <p className="text-xs text-gray-500">판매금액</p>
          <div className="mt-1">
            <Price amount={selectedPrice} size="lg" />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500">1일 식단(2팩) 단가</p>
          <div className="mt-1">
            <Price amount={dailyPrice} size="lg" className="text-indigo-600" />
          </div>
        </div>
      </div>

      <StepNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        showPrevious={showPrevious}
      />
    </div>
  );
}

