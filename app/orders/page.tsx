"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { orderStore } from "../../src/domain/order/orderStore";
import { Order } from "../../src/domain/order/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // 컴포넌트 마운트 시 주문 목록 로드
    const loadOrders = () => {
      setOrders(orderStore.getAllOrders());
    };
    
    loadOrders();
    
    // 페이지 포커스 시 주문 목록 갱신 (다른 페이지에서 돌아올 때)
    const handleFocus = () => {
      loadOrders();
    };
    
    // URL 변경 감지 (리다이렉트 시 갱신)
    const handleLocationChange = () => {
      loadOrders();
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('popstate', handleLocationChange);
    
    // 주기적으로 주문 목록 갱신 (다른 탭에서 주문 생성 시 대비)
    const interval = setInterval(loadOrders, 1000);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('popstate', handleLocationChange);
      clearInterval(interval);
    };
  }, []);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("ko-KR");
  };

  const formatDateTime = (date: Date): string => {
    return new Date(date).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

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

        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          메인홈으로
        </Link>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
          <p className="text-sm text-gray-400">등록된 주문이 없습니다.</p>
          <Link
            href="/orders/new"
            className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            새 주문 만들기 →
          </Link>
        </div>
      ) : (
        <div className="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
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
                    {formatDate(order.firstDeliveryDate)}
                  </p>
                </div>

                <div className="pt-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    배송 횟수
                  </span>
                  <p className="mt-1 text-sm text-gray-700">
                    총 {order.deliveryCount}회
                  </p>
                </div>

                <div className="pt-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    주문 생성일
                  </span>
                  <p className="mt-1 text-sm text-gray-700">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <span className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">
                  상세보기 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


