import { Suspense } from "react";
import { ProductsContainer } from "@/components/products/ProductsContainer";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 px-4 py-8"><div className="mx-auto max-w-7xl"><div className="flex h-64 items-center justify-center text-sm text-gray-400">로딩 중...</div></div></div>}>
      <ProductsContainer />
    </Suspense>
  );
}
