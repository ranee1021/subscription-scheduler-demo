import { Suspense } from "react";
import { PageLoading } from "@/src/shared-ui";
import { ProductDetailContainer } from "@/src/domains/catalog/ui/ProductDetailContainer";

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<PageLoading maxWidth="max-w-4xl" />}>
      <ProductDetailContainer />
    </Suspense>
  );
}

