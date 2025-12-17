"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "../../../src/domain/product/types";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        const response = await fetch(`/api/products/${productId}`);
        const result = await response.json();
        if (result.success) {
          // Date 객체 복원
          setProduct({
            ...result.data,
            createdAt: new Date(result.data.createdAt),
          });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("상품 정보 로드 실패:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("ko-KR");
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            상품을 찾을 수 없습니다.
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/products"
              className="text-indigo-600 hover:text-indigo-700"
            >
              상품 목록으로 돌아가기
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
          <button
            onClick={() => router.back()}
            className="mb-4 text-sm text-gray-600 hover:text-gray-900"
          >
            ← 뒤로가기
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          {product.description && (
            <p className="mt-2 text-lg text-gray-600">{product.description}</p>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            이용기간 옵션
          </h2>
          <div className="space-y-3">
            {product.periodOptions.map((option) => (
              <div
                key={option.period}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <span className="text-base font-medium text-gray-700">
                  {option.period}
                </span>
                <span className="text-lg font-bold text-indigo-600">
                  {option.price.toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            상품 정보
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>상품 ID</span>
              <span className="font-medium text-gray-900">{product.id}</span>
            </div>
            <div className="flex justify-between">
              <span>등록일</span>
              <span className="font-medium text-gray-900">
                {formatDate(product.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* 주문하기 버튼 */}
        <div className="flex gap-3">
          <Link
            href="/products"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-base font-medium text-gray-700 transition hover:bg-gray-50"
          >
            목록으로
          </Link>
          <Link
            href={`/orders/new?productId=${product.id}`}
            className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-center text-base font-medium text-white transition hover:bg-indigo-700"
          >
            주문하기
          </Link>
        </div>
      </div>
    </div>
  );
}

