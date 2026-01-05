"use client";

import { useParams } from "next/navigation";
import { OrderDetailContainer } from "@/components/orders/OrderDetailContainer";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  return <OrderDetailContainer orderId={orderId} />;
}
