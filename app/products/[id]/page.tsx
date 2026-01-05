import { Suspense } from "react";
import { ProductDetailContainer } from "@/components/products/ProductDetailContainer";

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 px-4 py-8"><div className="mx-auto max-w-4xl"><div className="flex h-64 items-center justify-center text-sm text-gray-400">로딩 중...</div></div></div>}>
      <ProductDetailContainer />
    </Suspense>
  );
}
