import React from "react";
import Link from "next/link";

const dummyOrders = [
  {
    id: "ORD-20250001",
    firstDeliveryDate: "2025-01-10",
    status: "ACTIVE",
  },
  {
    id: "ORD-20250002",
    firstDeliveryDate: "2025-01-17",
    status: "ACTIVE",
  },
  {
    id: "ORD-20250003",
    firstDeliveryDate: "2025-01-24",
    status: "ACTIVE",
  },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header */}
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            정기배송 주문
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            현재 활성화된 정기배송 주문 목록입니다.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          새 주문 만들기
        </button>
      </div>

      {/* Orders Grid */}
      <div className="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dummyOrders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  주문 ID
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {order.status}
                </span>
              </div>
              <p className="truncate text-sm font-semibold text-gray-900">
                {order.id}
              </p>

              <div className="pt-1">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  첫 배송일
                </span>
                <p className="mt-1 text-sm text-gray-700">
                  {order.firstDeliveryDate}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                상세보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


