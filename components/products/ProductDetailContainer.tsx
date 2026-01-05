"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useProduct } from "@/src/hooks/useProduct";
import { useProductOrderForm } from "@/src/hooks/useProductOrderForm";
import { useDeliveryCalendar } from "@/src/hooks/useDeliveryCalendar";
import { formatDateInput } from "@/src/utils/date";
import { ProductDetailView } from "./ProductDetailView";
import { OrderBottomSheet } from "./OrderBottomSheet";

type PeriodOption = "1주" | "2주" | "4주";

export function ProductDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = params.id as string;

  const { product, loading } = useProduct(productId);
  const orderForm = useProductOrderForm(product);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const calendar = useDeliveryCalendar(orderForm.selectedDate, orderForm.schedules);

  useEffect(() => {
    if (!isBottomSheetOpen && isBottomSheetVisible) {
      const timeout = setTimeout(() => {
        setIsBottomSheetVisible(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isBottomSheetOpen, isBottomSheetVisible]);

  const handleOrderClick = () => {
    if (!product) return;

    if (product.kind === "단품") {
      const defaultPeriod = (product.periodOptions[0]?.period || "1주") as PeriodOption;
      const defaultFrequency = "주3회" as const;

      const today = new Date();
      const first = new Date(today);
      first.setDate(today.getDate() + 2);
      first.setHours(0, 0, 0, 0);
      if (first.getDay() === 0) {
        first.setDate(first.getDate() + 1);
      }

      const params = new URLSearchParams({
        productId: productId,
        step: "5",
        period: defaultPeriod,
        frequency: defaultFrequency,
        firstDeliveryDate: formatDateInput(first),
      });

      router.push(`/orders/new?${params.toString()}`);
      return;
    }

    setIsBottomSheetVisible(true);
    setIsBottomSheetOpen(false);
    setCurrentStep(1);
    orderForm.reset();

    setTimeout(() => {
      setIsBottomSheetOpen(true);
    }, 0);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleDateClick = (date: Date) => {
    if (calendar.isDateSelectable(date)) {
      orderForm.setSelectedDate(date);
    }
  };

  const handlePaymentClick = () => {
    if (!orderForm.selectedDate || orderForm.schedules.length === 0) {
      alert("첫 배송일을 선택해주세요.");
      return;
    }

    const params = new URLSearchParams({
      productId: productId,
      step: "5",
      period: orderForm.selectedPeriod,
      frequency: orderForm.deliveryFrequency,
      firstDeliveryDate: formatDateInput(orderForm.selectedDate),
    });

    router.push(`/orders/new?${params.toString()}`);
  };

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

  if (!product) {
    const originKind = searchParams.get("kind");
    const fallbackKind =
      originKind === "식단" || originKind === "단품" ? originKind : "식단";

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            상품을 찾을 수 없습니다.
          </div>
          <div className="mt-4 text-center">
            <Link
              href={`/products?kind=${encodeURIComponent(fallbackKind)}`}
              className="text-indigo-600 hover:text-indigo-700"
            >
              상품 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isMealPackage = product.kind === "식단";

  return (
    <>
      <ProductDetailView product={product} onOrderClick={handleOrderClick} />
      {isMealPackage && (
        <OrderBottomSheet
          isOpen={isBottomSheetOpen}
          isVisible={isBottomSheetVisible}
          currentStep={currentStep}
          calendar={calendar}
          orderForm={orderForm}
          onClose={handleCloseBottomSheet}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onDateClick={handleDateClick}
          onPaymentClick={handlePaymentClick}
        />
      )}
    </>
  );
}

