"use client";

import { useOrders } from "../queries";
import { OrdersView } from "./OrdersView";

export function OrdersContainer() {
  const { orders, loading } = useOrders();

  return <OrdersView orders={orders} loading={loading} />;
}

