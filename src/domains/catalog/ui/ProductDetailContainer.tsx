"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useProduct } from "../queries";
import { useProductOrderForm, useDeliveryCalendar } from "../../subscription/usecases";
import { formatDateInput } from "@/src/shared-ui/lib/format";
import type { PeriodOption } from "../../subscription/constants";
import { ProductDetailView } from "./ProductDetailView";
import { OrderBottomSheet } from "./OrderBottomSheet";

export function ProductDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = params.id as string;

  const { product, loading } = useProduct(productId);
  const orderForm = useProductOrderForm(product);
  const calendar = useDeliveryCalendar(orderForm.selectedDate, orderForm.schedules);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

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

      router.push(`/checkout?${params.toString()}`);
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

  return (
    <ProductDetailView
      product={product}
      loading={loading}
      orderForm={orderForm}
      onOrderClick={handleOrderClick}
      isBottomSheetOpen={isBottomSheetOpen}
      isBottomSheetVisible={isBottomSheetVisible}
      currentStep={currentStep}
      calendar={calendar}
      onDateClick={handleDateClick}
      onCloseBottomSheet={handleCloseBottomSheet}
      onNext={handleNext}
      onPrevious={handlePrevious}
    />
  );
}

