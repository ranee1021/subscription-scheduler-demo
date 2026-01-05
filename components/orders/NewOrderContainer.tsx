"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/src/domain/product/types";
import type { Order } from "@/src/domain/order/types";
import { formatDateInput } from "@/src/utils/date";
import { useProductOrderForm } from "@/src/hooks/useProductOrderForm";
import { useDeliveryCalendar } from "@/src/hooks/useDeliveryCalendar";
import { NewOrderView } from "./NewOrderView";

type PeriodOption = "1주" | "2주" | "4주";
type Step = 1 | 2 | 3 | 4 | 5;

export function NewOrderContainer() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [orderParams, setOrderParams] = useState<{
    period?: PeriodOption;
    frequency?: any;
    firstDeliveryDate?: string;
  } | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams(window.location.search);
      const id = params.get("productId");
      const step = params.get("step");
      const period = params.get("period") as PeriodOption | null;
      const frequency = params.get("frequency");
      const firstDeliveryDate = params.get("firstDeliveryDate");

      setProductId(id);

      if (step === "5" && period && frequency && firstDeliveryDate) {
        setOrderParams({ period, frequency, firstDeliveryDate });
        setCurrentStep(5 as Step);
      } else if (!id) {
        router.push("/products");
        return;
      } else {
        router.push(`/products/${id}`);
        return;
      }

      try {
        let productData: Product | null = null;

        if (id) {
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          if (result.success && result.data) {
            productData = {
              ...result.data,
              createdAt: new Date(result.data.createdAt),
            };
          }
        }

        setProduct(productData);
      } catch (error) {
        console.error("상품 정보 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [router]);

  const orderForm = useProductOrderForm(product);
  const calendar = useDeliveryCalendar(orderForm.selectedDate, orderForm.schedules);

  useEffect(() => {
    if (orderParams) {
      if (orderParams.period) {
        orderForm.setSelectedPeriod(orderParams.period);
      }
      if (orderParams.frequency) {
        orderForm.setDeliveryFrequency(orderParams.frequency);
      }
      if (orderParams.firstDeliveryDate) {
        const date = new Date(orderParams.firstDeliveryDate);
        orderForm.setSelectedDate(date);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderParams]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 5) {
      if (productId && orderForm.selectedDate) {
        const params = new URLSearchParams({
          openBottomSheet: "true",
          step: "4",
          period: orderForm.selectedPeriod,
          frequency: orderForm.deliveryFrequency,
          firstDeliveryDate: formatDateInput(orderForm.selectedDate),
        });
        router.push(`/products/${productId}?${params.toString()}`);
      }
    } else if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleDateClick = (date: Date) => {
    if (calendar.isDateSelectable(date)) {
      orderForm.setSelectedDate(date);
    }
  };

  const handleCreateOrder = async () => {
    if (!orderForm.selectedDate || orderForm.schedules.length === 0) {
      alert("첫 배송일을 선택해주세요.");
      return;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      firstDeliveryDate: orderForm.selectedDate,
      status: "ACTIVE",
      deliveryCount: orderForm.schedules.length,
      deliveries: orderForm.schedules,
      createdAt: new Date(),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });

      const result = await response.json();

      if (result.success) {
        alert("주문이 완료되었습니다.");
        router.push(`/orders/${newOrder.id}`);
      } else {
        alert(`주문 생성 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("주문 생성 실패:", error);
      alert("주문 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <NewOrderView
      product={product}
      loading={loading}
      currentStep={currentStep}
      calendar={calendar}
      orderForm={orderForm}
      onDateClick={handleDateClick}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onCreateOrder={handleCreateOrder}
    />
  );
}
