"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductImage, Price, Badge, EmptyState, LoadingSpinner } from "@/components/common";
import type { Product } from "@/src/domain/product/types";

interface ProductsViewProps {
  products: Product[];
  loading: boolean;
  activeKind: "식단" | "단품";
  onKindChange: (kind: "식단" | "단품") => void;
}

export function ProductsView({
  products,
  loading,
  activeKind,
  onKindChange,
}: ProductsViewProps) {
  const filteredProducts = products.filter(
    (product) => product.kind === activeKind
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">상품 목록</h1>
              <p className="mt-1 text-sm text-gray-500">
                정기배송 식단과 단품 상품을 선택해 주문을 생성하세요.
              </p>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => onKindChange("식단")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeKind === "식단"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                식단
              </button>
              <button
                type="button"
                onClick={() => onKindChange("단품")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeKind === "단품"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                단품
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title={
              activeKind === "식단"
                ? "등록된 식단 상품이 없습니다."
                : "등록된 단품 상품이 없습니다."
            }
            description="새로운 상품이 등록되면 여기에 표시됩니다."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} activeKind={activeKind} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  activeKind: "식단" | "단품";
}

function ProductCard({ product, activeKind }: ProductCardProps) {
  const isMealPackage = product.kind === "식단";

  const handleClick = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(
      "productsScrollY",
      String(window.scrollY ?? 0)
    );
  };

  return (
    <Link
      href={`/products/${product.id}?kind=${encodeURIComponent(activeKind)}`}
      onClick={handleClick}
      className="block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-gray-100">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          <Badge variant={isMealPackage ? "info" : "success"}>
            {isMealPackage ? "식단 정기배송" : "단품"}
          </Badge>
        </div>

        {product.description && (
          <p className="mb-4 text-sm text-gray-600">{product.description}</p>
        )}

        <div className="mb-2">
          <p className="mb-2 text-xs font-medium text-gray-500">
            {isMealPackage ? "이용기간 옵션" : "판매가"}
          </p>
          <div className="space-y-2">
            {product.periodOptions.map((option) => (
              <div
                key={option.period}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
              >
                {isMealPackage && (
                  <span className="text-sm font-medium text-gray-700">
                    {option.period}
                  </span>
                )}
                <Price amount={option.price} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

