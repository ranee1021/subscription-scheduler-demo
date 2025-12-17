"use client";

import React from "react";
import { productStore } from "../../src/domain/product/productStore";
import { Product } from "../../src/domain/product/types";
import Link from "next/link";

export default function ProductsPage() {
  const products = productStore.getAllProducts();

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
        {products.length === 0 ? (
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
    <Link href={`/orders/new?productId=${product.id}`}>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md cursor-pointer">
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
          <span className="text-sm font-medium text-indigo-600">
            주문하기 →
          </span>
        </div>
      </div>
    </Link>
  );
}

