"use client";

import Link from "next/link";
import { formatDate, formatDateTime } from "@/src/shared-ui/lib/format";
import { LoadingSpinner, EmptyState } from "@/src/shared-ui";
import type { Order } from "../contracts";

interface OrdersViewProps {
  orders: Order[];
  loading: boolean;
}

export function OrdersView({ orders, loading }: OrdersViewProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="주문 내역이 없습니다."
        description="새로운 주문을 생성하면 여기에 표시됩니다."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">주문 내역</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    주문 #{order.id.slice(-8)}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    첫 배송일: {formatDate(order.firstDeliveryDate)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    배송 횟수: {order.deliveryCount}회
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(order.createdAt)}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

