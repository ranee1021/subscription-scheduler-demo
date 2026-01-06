/**
 * Order 도메인 쿼리 (React Query/SWR 훅)
 */

"use client";

import { useState, useEffect } from "react";
import { getOrders, getOrder } from "./service";
import type { Order } from "./contracts";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("주문 목록을 불러오는데 실패했습니다."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const handleFocus = () => {
      loadOrders();
    };

    const handlePopState = () => {
      loadOrders();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("popstate", handlePopState);

    const interval = setInterval(loadOrders, 2000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("popstate", handlePopState);
      clearInterval(interval);
    };
  }, []);

  return { orders, loading, error, refetch: loadOrders };
}

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("주문을 불러오는데 실패했습니다."));
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  return { order, loading, error };
}
