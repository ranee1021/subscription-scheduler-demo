import { useState, useEffect } from "react";
import type { Order } from "@/src/domain/order/types";

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const result = await response.json();
        if (result.success) {
          setOrder({
            ...result.data,
            firstDeliveryDate: new Date(result.data.firstDeliveryDate),
            createdAt: new Date(result.data.createdAt),
            deliveries: result.data.deliveries.map((delivery: any) => ({
              ...delivery,
              originalDeliveryDate: new Date(delivery.originalDeliveryDate),
              productionDate: new Date(delivery.productionDate),
            })),
          });
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error("주문 정보 로드 실패:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading };
}

