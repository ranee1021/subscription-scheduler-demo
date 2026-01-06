import { Suspense } from "react";
import { PageLoading } from "@/src/shared-ui";
import { ProductsContainer } from "@/src/domains/catalog/ui/ProductsContainer";

export default function ProductsPage() {
  return (
    <Suspense fallback={<PageLoading maxWidth="max-w-7xl" />}>
      <ProductsContainer />
    </Suspense>
  );
}

