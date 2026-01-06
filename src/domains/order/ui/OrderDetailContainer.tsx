"use client";

import { useOrder } from "../queries";
import { OrderDetailView } from "./OrderDetailView";

interface OrderDetailContainerProps {
  orderId: string;
}

export function OrderDetailContainer({ orderId }: OrderDetailContainerProps) {
  const { order, loading } = useOrder(orderId);

  return <OrderDetailView order={order} loading={loading} />;
}

