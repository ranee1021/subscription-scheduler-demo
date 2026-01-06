"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "../queries";
import { ProductsView } from "./ProductsView";

export function ProductsContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKindParam = searchParams.get("kind");
  const { products, loading } = useProducts();

  const [activeKind, setActiveKind] = useState<"식단" | "단품">(
    initialKindParam === "식단" || initialKindParam === "단품"
      ? (initialKindParam as "식단" | "단품")
      : "식단"
  );

  const handleKindChange = (kind: "식단" | "단품") => {
    setActiveKind(kind);

    const params = new URLSearchParams(searchParams.toString());
    params.set("kind", kind);

    const queryString = params.toString();
    router.replace(queryString ? `/products?${queryString}` : "/products");
  };

  return (
    <ProductsView
      products={products}
      loading={loading}
      activeKind={activeKind}
      onKindChange={handleKindChange}
    />
  );
}

