"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProduct } from "../../catalog/queries";
import { useProductOrderForm, useDeliveryCalendar } from "../../subscription/usecases";
import { createOrder } from "../service";
import { formatDateInput } from "@/src/shared-ui/lib/format";
import { useToast } from "@/src/shared-ui/primitives/Toast";
import type { Order } from "../contracts";

export function NewOrderContainer() {
  const router = useRouter();
  const { showToast } = useToast();
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("productId");
    setProductId(id);
  }, []);

  const { product } = useProduct(productId || "");
  const orderForm = useProductOrderForm(product);
  const calendar = useDeliveryCalendar(orderForm.selectedDate, orderForm.schedules);

  const handleCreateOrder = async () => {
    if (!orderForm.selectedDate || orderForm.schedules.length === 0) {
      showToast("첫 배송일을 선택해주세요.", "error");
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
      await createOrder(newOrder);
      showToast("주문이 완료되었습니다.", "success");
      router.push(`/orders/${newOrder.id}`);
    } catch (error) {
      showToast("주문 생성 중 오류가 발생했습니다.", "error");
    }
  };

  // 실제 UI는 별도 NewOrderView 컴포넌트로 분리 필요
  return (
    <div>
      <button onClick={handleCreateOrder}>주문 생성</button>
    </div>
  );
}

