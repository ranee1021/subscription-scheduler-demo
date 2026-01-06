/**
 * Order 도메인 서비스 (API 호출)
 */

import { apiFetch } from "@/src/core/api/client";
import type { Order } from "./contracts";

export async function getOrders(): Promise<Order[]> {
  const response = await apiFetch<Order[]>("/api/orders");
  
  if (!response.success || !response.data) {
    throw new Error(response.error || "주문 목록을 불러오는데 실패했습니다.");
  }
  
  return response.data.map((order: any) => ({
    ...order,
    firstDeliveryDate: new Date(order.firstDeliveryDate),
    createdAt: new Date(order.createdAt),
    deliveries: order.deliveries.map((delivery: any) => ({
      ...delivery,
      originalDeliveryDate: new Date(delivery.originalDeliveryDate),
      productionDate: new Date(delivery.productionDate),
    })),
  }));
}

export async function getOrder(orderId: string): Promise<Order> {
  const response = await apiFetch<Order>(`/api/orders/${orderId}`);
  
  if (!response.success || !response.data) {
    throw new Error(response.error || "주문을 찾을 수 없습니다.");
  }
  
  return {
    ...response.data,
    firstDeliveryDate: new Date(response.data.firstDeliveryDate),
    createdAt: new Date(response.data.createdAt),
    deliveries: response.data.deliveries.map((delivery: any) => ({
      ...delivery,
      originalDeliveryDate: new Date(delivery.originalDeliveryDate),
      productionDate: new Date(delivery.productionDate),
    })),
  };
}

export async function createOrder(order: Order): Promise<Order> {
  const response = await apiFetch<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      ...order,
      firstDeliveryDate: order.firstDeliveryDate.toISOString(),
      createdAt: order.createdAt.toISOString(),
      deliveries: order.deliveries.map((d) => ({
        ...d,
        originalDeliveryDate: d.originalDeliveryDate.toISOString(),
        productionDate: d.productionDate.toISOString(),
      })),
    }),
  });
  
  if (!response.success || !response.data) {
    throw new Error(response.error || "주문 생성에 실패했습니다.");
  }
  
  return {
    ...response.data,
    firstDeliveryDate: new Date(response.data.firstDeliveryDate),
    createdAt: new Date(response.data.createdAt),
    deliveries: response.data.deliveries.map((delivery: any) => ({
      ...delivery,
      originalDeliveryDate: new Date(delivery.originalDeliveryDate),
      productionDate: new Date(delivery.productionDate),
    })),
  };
}

