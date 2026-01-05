import { useState, useEffect, useRef } from "react";
import type { Product } from "@/src/domain/product/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("상품 API 응답:", result);
        if (result.success && result.data) {
          const productsWithDates = result.data.map((product: any) => ({
            ...product,
            createdAt: new Date(product.createdAt),
          }));
          setProducts(productsWithDates);
        } else {
          console.error("상품 목록 응답 실패:", result);
        }
      } catch (error) {
        console.error("상품 목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const restoredRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (loading) return;
    if (restoredRef.current) return;

    const stored = window.sessionStorage.getItem("productsScrollY");
    if (stored) {
      const y = Number(stored);
      if (!Number.isNaN(y)) {
        window.scrollTo(0, y);
      }
      window.sessionStorage.removeItem("productsScrollY");
    }

    restoredRef.current = true;
  }, [loading]);

  return { products, loading };
}

