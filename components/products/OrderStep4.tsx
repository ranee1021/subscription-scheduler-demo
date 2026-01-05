"use client";

import { formatDateKorean } from "@/src/utils/date";
import type { useProductOrderForm } from "@/src/hooks/useProductOrderForm";

interface OrderStep4Props {
  orderForm: ReturnType<typeof useProductOrderForm>;
  onPrevious: () => void;
  onPaymentClick: () => void;
}

export function OrderStep4({
  orderForm,
  onPrevious,
  onPaymentClick,
}: OrderStep4Props) {
  const {
    selectedDate,
    selectedPeriod,
    deliveryFrequency,
    selectedPrice,
    schedules,
    lastDeliveryDate,
    paymentAttempts,
  } = orderForm;

  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        배송 스케줄 및 결제 금액 요약
      </h3>

      {!selectedDate ? (
        <div className="flex h-64 items-center justify-center text-sm text-gray-400">
          첫 배송일을 선택해주세요.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg bg-indigo-50 p-4">
            <p className="text-sm font-medium text-indigo-900">주문 요약</p>
            <p className="mt-1 text-sm text-indigo-700">
              첫 배송일: {formatDateKorean(selectedDate)}
            </p>
            <p className="mt-1 text-sm text-indigo-700">
              이용기간: {selectedPeriod} ({schedules.length}회 배송)
            </p>
            <p className="mt-1 text-sm text-indigo-700">
              배송 주기: {deliveryFrequency}
            </p>
            <p className="mt-2 text-lg font-bold text-indigo-700">
              주문 금액: {selectedPrice.toLocaleString()}원
            </p>
          </div>

          {lastDeliveryDate && (
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">
                마지막 배송예정일
              </p>
              <p className="mt-1 text-lg font-bold text-gray-700">
                {formatDateKorean(lastDeliveryDate)}
              </p>
            </div>
          )}

          {paymentAttempts.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-700">
                결제 시도일 (마지막 배송예정일 기준)
              </h4>
              <div className="space-y-2">
                {paymentAttempts.map((attempt) => (
                  <div
                    key={attempt.daysBefore}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      D-{attempt.daysBefore}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatDateKorean(attempt.attemptDate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-700">
              배송 스케줄 (총 {schedules.length}회)
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      회차
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      배송예정일
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      생산기준일
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {schedules.map((schedule) => (
                    <tr key={schedule.sequence} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                        {schedule.sequence}회차
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {formatDateKorean(schedule.originalDeliveryDate)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {formatDateKorean(schedule.productionDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={onPaymentClick}
              disabled={!selectedDate || schedules.length === 0}
              className={`w-full rounded-lg px-4 py-3 text-base font-semibold text-white transition ${
                !selectedDate || schedules.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              결제하기
            </button>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onPrevious}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              이전
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

