"use client";

import { LoadingSpinner, EmptyState } from "@/src/shared-ui";
import { ProductCard } from "./ProductCard";
import type { Product } from "../contracts";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  activeKind: "식단" | "단품";
}

export function ProductList({ products, loading, activeKind }: ProductListProps) {
  const filteredProducts = products.filter(
    (product) => product.kind === activeKind
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (filteredProducts.length === 0) {
    return (
      <EmptyState
        title={
          activeKind === "식단"
            ? "등록된 식단 상품이 없습니다."
            : "등록된 단품 상품이 없습니다."
        }
        description="새로운 상품이 등록되면 여기에 표시됩니다."
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} activeKind={activeKind} />
      ))}
    </div>
  );
}

