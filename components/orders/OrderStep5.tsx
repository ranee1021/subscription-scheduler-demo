"use client";

import type { Product } from "@/src/domain/product/types";
import type { useProductOrderForm } from "@/src/hooks/useProductOrderForm";
import { formatDateKorean } from "@/src/utils/date";

interface OrderStep5Props {
  product: Product | null;
  orderForm: ReturnType<typeof useProductOrderForm>;
  onPrevious: () => void;
  onCreateOrder: () => void;
}

export function OrderStep5({
  product,
  orderForm,
  onPrevious,
  onCreateOrder,
}: OrderStep5Props) {
  const { selectedDate, selectedPeriod, deliveryFrequency, selectedPrice, schedules } = orderForm;

  return (
    <div>
      <div className="space-y-6">
        {selectedDate && (
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">주문 정보</p>
            <p className="text-sm text-gray-700">상품: {product?.name}</p>
            <p className="text-sm text-gray-700">
              이용기간: {selectedPeriod} ({schedules.length}회 배송)
            </p>
            <p className="text-sm text-gray-700">배송 주기: {deliveryFrequency}</p>
            <p className="text-sm text-gray-700">
              첫 배송일: {formatDateKorean(selectedDate)}
            </p>
            <p className="mt-2 text-base font-bold text-gray-900">
              결제 금액: {selectedPrice.toLocaleString()}원
            </p>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-4">
            결제 정보 입력 영역 (추후 구현)
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCreateOrder}
            disabled={!selectedDate || schedules.length === 0}
            className={`w-full rounded-lg px-4 py-3 text-base font-semibold text-white transition ${
              !selectedDate || schedules.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            주문 완료
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
    </div>
  );
}

