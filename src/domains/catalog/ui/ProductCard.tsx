"use client";

import Link from "next/link";
import { ProductImage, Price, Badge } from "@/src/shared-ui";
import type { Product } from "../contracts";

interface ProductCardProps {
  product: Product;
  activeKind: "식단" | "단품";
}

export function ProductCard({ product, activeKind }: ProductCardProps) {
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

