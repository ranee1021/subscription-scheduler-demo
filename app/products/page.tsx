"use client";

import React, { useState, useEffect } from "react";
import { Product } from "../../src/domain/product/types";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("상품 API 응답:", result);
        if (result.success && result.data) {
          // Date 객체 복원
          const productsWithDates = result.data.map((product: any) => ({
            ...product,
            createdAt: new Date(product.createdAt),
          }));
          setProducts(productsWithDates);
        } else {
          console.error("상품 목록 응답 실패:", result);
        }
      } catch (error) {
        console.error("상품 목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">상품 목록</h1>
          <p className="mt-1 text-sm text-gray-500">
            정기배송 상품을 선택하여 주문을 생성하세요.
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            로딩 중...
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            등록된 상품이 없습니다.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("ko-KR");
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <h2 className="mb-2 text-xl font-bold text-gray-900">{product.name}</h2>
      
      {product.description && (
        <p className="mb-4 text-sm text-gray-600">{product.description}</p>
      )}

      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-gray-500">이용기간 옵션</p>
        <div className="space-y-2">
          {product.periodOptions.map((option) => (
            <div
              key={option.period}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
            >
              <span className="text-sm font-medium text-gray-700">
                {option.period}
              </span>
              <span className="text-sm font-bold text-indigo-600">
                {option.price.toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-xs text-gray-500">
          등록일: {formatDate(product.createdAt)}
        </span>
      </div>

      {/* 버튼 영역 */}
      <div className="mt-4">
        <Link
          href={`/products/${product.id}`}
          className="block w-full rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          자세히보기
        </Link>
      </div>
    </div>
  );
}

