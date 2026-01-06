"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductImage, Price, Badge, Button } from "@/src/shared-ui";
import type { Product } from "../contracts";
import { generateMonthlyMealPlan } from "../../subscription/lib/dummyData";
import { MealPlanCalendarSection } from "./MealPlanCalendarSection";
import { OrderBottomSheet } from "./OrderBottomSheet";
import type { useProductOrderForm, useDeliveryCalendar } from "../../subscription/usecases";

interface ProductDetailViewProps {
  product: Product | null;
  loading: boolean;
  orderForm: ReturnType<typeof useProductOrderForm>;
  onOrderClick: () => void;
  isBottomSheetOpen: boolean;
  isBottomSheetVisible: boolean;
  currentStep: 1 | 2 | 3 | 4;
  calendar: ReturnType<typeof useDeliveryCalendar>;
  onDateClick: (date: Date) => void;
  onCloseBottomSheet: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ProductDetailView({
  product,
  loading,
  orderForm,
  onOrderClick,
  isBottomSheetOpen,
  isBottomSheetVisible,
  currentStep,
  calendar,
  onDateClick,
  onCloseBottomSheet,
  onNext,
  onPrevious,
}: ProductDetailViewProps) {
  const router = useRouter();

  if (loading || !product) {
    return <div>로딩 중...</div>;
  }

  const isMealPackage = product.kind === "식단";
  const listKind = isMealPackage ? "식단" : "단품";

  const mealPlan = isMealPackage && product.mealStageId
    ? generateMonthlyMealPlan(product.mealStageId, 2025, 12)
    : null;

  const handlePaymentClick = () => {
    if (!orderForm.selectedDate || orderForm.schedules.length === 0) {
      alert("첫 배송일을 선택해주세요.");
      return;
    }

    const params = new URLSearchParams({
      productId: product.id,
      step: "5",
      period: orderForm.selectedPeriod,
      frequency: orderForm.deliveryFrequency,
      firstDeliveryDate: orderForm.selectedDate.toISOString().split("T")[0],
    });

    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="mb-2">
            <button
              onClick={() => router.back()}
              className="mb-4 text-sm text-gray-600 hover:text-gray-900"
            >
              ← 뒤로가기
            </button>

            <div className="mb-4 overflow-hidden rounded-xl bg-gray-100">
              <div className="relative aspect-square w-full">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            {product.description && (
              <p className="mt-2 text-lg text-gray-600">{product.description}</p>
            )}
          </div>

          {isMealPackage && mealPlan && product.mealStageId && (
            <MealPlanCalendarSection
              mealPlan={mealPlan}
              mealStageId={product.mealStageId}
            />
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {isMealPackage ? "이용기간 옵션" : "판매가"}
              </h2>
              <Badge variant={isMealPackage ? "info" : "success"}>
                {isMealPackage ? "식단 정기배송" : "단품"}
              </Badge>
            </div>
            <div className="space-y-3">
              {product.periodOptions.map((option) => (
                <div
                  key={option.period}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  {isMealPackage && (
                    <span className="text-base font-medium text-gray-700">
                      {option.period}
                    </span>
                  )}
                  <Price amount={option.price} size="lg" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">상품 정보</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>상품 ID</span>
                <span className="font-medium text-gray-900">{product.id}</span>
              </div>
            </div>
          </section>

          <div className="flex gap-3">
            <Link
              href={`/products?kind=${encodeURIComponent(listKind)}`}
              className="flex-1"
            >
              <Button variant="outline" className="w-full">
                목록으로
              </Button>
            </Link>
            <Button variant="primary" onClick={onOrderClick} className="flex-1">
              주문하기
            </Button>
          </div>
        </div>
      </div>

      {isBottomSheetVisible && (
        <OrderBottomSheet
          isOpen={isBottomSheetOpen}
          isVisible={isBottomSheetVisible}
          currentStep={currentStep}
          calendar={calendar}
          orderForm={orderForm}
          onClose={onCloseBottomSheet}
          onNext={onNext}
          onPrevious={onPrevious}
          onDateClick={onDateClick}
          onPaymentClick={handlePaymentClick}
        />
      )}
    </>
  );
}

