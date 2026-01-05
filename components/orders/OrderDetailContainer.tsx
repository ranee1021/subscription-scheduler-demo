"use client";

import Link from "next/link";
import { useOrder } from "@/src/hooks/useOrder";
import { OrderDetailView } from "./OrderDetailView";

interface OrderDetailContainerProps {
  orderId: string;
}

export function OrderDetailContainer({ orderId }: OrderDetailContainerProps) {
  const { order, loading } = useOrder(orderId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            주문을 찾을 수 없습니다.
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/orders"
              className="text-indigo-600 hover:text-indigo-700"
            >
              주문 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <OrderDetailView order={order} />;
}

