import { useState, useEffect } from "react";
import type { Order } from "@/src/domain/order/types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const result = await response.json();
        if (result.success) {
          const ordersWithDates = result.data.map((order: any) => ({
            ...order,
            firstDeliveryDate: new Date(order.firstDeliveryDate),
            createdAt: new Date(order.createdAt),
            deliveries: order.deliveries.map((delivery: any) => ({
              ...delivery,
              originalDeliveryDate: new Date(delivery.originalDeliveryDate),
              productionDate: new Date(delivery.productionDate),
            })),
          }));
          setOrders(ordersWithDates);
        }
      } catch (error) {
        console.error("주문 목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();

    const handleFocus = () => {
      loadOrders();
    };

    const handleLocationChange = () => {
      loadOrders();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("popstate", handleLocationChange);

    const interval = setInterval(loadOrders, 2000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("popstate", handleLocationChange);
      clearInterval(interval);
    };
  }, []);

  return { orders, loading };
}

