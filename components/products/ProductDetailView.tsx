"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductImage, Price, Badge, Button } from "@/components/common";
import type { Product } from "@/src/domain/product/types";
import { generateMonthlyMealPlan } from "@/src/domain/meal/dummyData";
import { MealPlanCalendarSection } from "./MealPlanCalendarSection";

interface ProductDetailViewProps {
  product: Product;
  onOrderClick: () => void;
}

export function ProductDetailView({
  product,
  onOrderClick,
}: ProductDetailViewProps) {
  const router = useRouter();
  const isMealPackage = product.kind === "식단";
  const listKind = isMealPackage ? "식단" : "단품";

  const mealPlan = isMealPackage && product.mealStageId
    ? generateMonthlyMealPlan(product.mealStageId, 2025, 12)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="mb-2">
          <button
            onClick={() => router.back()}
            className="mb-4 text-sm text-gray-600 hover:text-gray-900"
          >
            ← 뒤로가기
          </button>

          <div className="mb-4 overflow-hidden rounded-xl bg-gray-100">
            <div className="relative aspect-square w-full">
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          {product.description && (
            <p className="mt-2 text-lg text-gray-600">{product.description}</p>
          )}
        </div>

        {isMealPackage && mealPlan && product.mealStageId && (
          <MealPlanCalendarSection
            mealPlan={mealPlan}
            mealStageId={product.mealStageId}
          />
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {isMealPackage ? "이용기간 옵션" : "판매가"}
            </h2>
            <Badge variant={isMealPackage ? "info" : "success"}>
              {isMealPackage ? "식단 정기배송" : "단품"}
            </Badge>
          </div>
          <div className="space-y-3">
            {product.periodOptions.map((option) => (
              <div
                key={option.period}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
              >
                {isMealPackage && (
                  <span className="text-base font-medium text-gray-700">
                    {option.period}
                  </span>
                )}
                <Price amount={option.price} size="lg" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">상품 정보</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>상품 ID</span>
              <span className="font-medium text-gray-900">{product.id}</span>
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <Link
            href={`/products?kind=${encodeURIComponent(listKind)}`}
            className="flex-1"
          >
            <Button variant="outline" className="w-full">
              목록으로
            </Button>
          </Link>
          <Button variant="primary" onClick={onOrderClick} className="flex-1">
            주문하기
          </Button>
        </div>
      </div>
    </div>
  );
}

