"use client";

type PeriodOption = "1주" | "2주" | "4주";

interface OrderStep1Props {
  periodOptions: Array<{ period: string; price: number }>;
  selectedPeriod: PeriodOption;
  selectedPrice: number;
  dailyPrice: number;
  onPeriodChange: (period: PeriodOption) => void;
  onNext: () => void;
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
              <div className="mt-1 text-base">
                {option.price.toLocaleString()}원
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
        <div>
          <p className="text-xs text-gray-500">판매금액</p>
          <p className="mt-1 text-lg font-bold text-gray-900">
            {selectedPrice.toLocaleString()}원
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">1일 식단(2팩) 단가</p>
          <p className="mt-1 text-lg font-bold text-indigo-600">
            {dailyPrice.toLocaleString()}원
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        {showPrevious && onPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            이전
          </button>
        )}
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

