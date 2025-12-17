"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Order } from "../../../src/domain/order/types";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const result = await response.json();
        if (result.success) {
          // Date 객체 복원
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/orders"
            className="mb-4 inline-block text-sm text-gray-600 hover:text-gray-900"
          >
            ← 주문 목록
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">주문 상세</h1>
        </div>

        {/* 주문 정보 */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            주문 정보
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500">주문 ID</p>
              <p className="mt-1 text-base font-semibold text-gray-900">
                {order.id}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">상태</p>
              <p className="mt-1">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {order.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">첫 배송일</p>
              <p className="mt-1 text-base text-gray-900">
                {formatDate(order.firstDeliveryDate)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">배송 횟수</p>
              <p className="mt-1 text-base text-gray-900">
                총 {order.deliveryCount}회
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">주문 생성일</p>
              <p className="mt-1 text-base text-gray-900">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* 배송 스케줄 */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            배송 스케줄 (총 {order.deliveries.length}회)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    회차
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    배송예정일
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    생산기준일
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {order.deliveries.map((delivery) => (
                  <tr
                    key={delivery.sequence}
                    className="hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {delivery.sequence}회차
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {formatDate(delivery.originalDeliveryDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {formatDate(delivery.productionDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Link
            href="/orders"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-base font-medium text-gray-700 transition hover:bg-gray-50"
          >
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
