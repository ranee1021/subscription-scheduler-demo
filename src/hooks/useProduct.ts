import { useState, useEffect } from "react";
import type { Product } from "@/src/domain/product/types";

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const response = await fetch(`/api/products/${productId}`);
        const result = await response.json();
        if (result.success) {
          setProduct({
            ...result.data,
            createdAt: new Date(result.data.createdAt),
          });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("상품 정보 로드 실패:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading };
}

