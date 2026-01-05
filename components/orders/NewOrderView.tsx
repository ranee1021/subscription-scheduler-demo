"use client";

import type { Product } from "@/src/domain/product/types";
import { OrderStep1 } from "@/components/products/OrderStep1";
import { OrderStep2 } from "@/components/products/OrderStep2";
import { OrderStep3 } from "@/components/products/OrderStep3";
import { OrderStep4 } from "@/components/products/OrderStep4";
import { OrderStep5 } from "./OrderStep5";
import { DeliveryCalendar } from "@/components/products/DeliveryCalendar";
import type { useDeliveryCalendar } from "@/src/hooks/useDeliveryCalendar";
import type { useProductOrderForm } from "@/src/hooks/useProductOrderForm";

type Step = 1 | 2 | 3 | 4 | 5;

interface NewOrderViewProps {
  product: Product | null;
  loading: boolean;
  currentStep: Step;
  calendar: ReturnType<typeof useDeliveryCalendar>;
  orderForm: ReturnType<typeof useProductOrderForm>;
  onDateClick: (date: Date) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCreateOrder: () => void;
}

export function NewOrderView({
  product,
  loading,
  currentStep,
  calendar,
  orderForm,
  onDateClick,
  onNext,
  onPrevious,
  onCreateOrder,
}: NewOrderViewProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">주문서 작성</h1>
        </div>

        {product && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">상품 정보</h2>
            <p className="text-xl font-bold text-gray-900">{product.name}</p>
            {product.description && (
              <p className="mt-1 text-sm text-gray-600">{product.description}</p>
            )}
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {currentStep === 1 && (
            <OrderStep1
              periodOptions={orderForm.periodOptions}
              selectedPeriod={orderForm.selectedPeriod}
              selectedPrice={orderForm.selectedPrice}
              dailyPrice={orderForm.dailyPrice}
              onPeriodChange={orderForm.setSelectedPeriod}
              onNext={onNext}
            />
          )}

          {currentStep === 2 && (
            <OrderStep2
              deliveryFrequency={orderForm.deliveryFrequency}
              onFrequencyChange={orderForm.setDeliveryFrequency}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          )}

          {currentStep === 3 && (
            <OrderStep3
              calendar={calendar}
              orderForm={orderForm}
              onDateClick={onDateClick}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          )}

          {currentStep === 4 && (
            <OrderStep4
              orderForm={orderForm}
              onPrevious={onPrevious}
              onPaymentClick={onNext}
            />
          )}

          {currentStep === 5 && (
            <OrderStep5
              product={product}
              orderForm={orderForm}
              onPrevious={onPrevious}
              onCreateOrder={onCreateOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}

