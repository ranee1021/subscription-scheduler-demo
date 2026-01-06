/**
 * Catalog 도메인 쿼리 (React Query/SWR 훅)
 */

"use client";

import React, { useState, useEffect } from "react";
import { getProducts, getProduct } from "./service";
import type { Product } from "./contracts";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const restoredRef = React.useRef(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("상품 목록을 불러오는데 실패했습니다."));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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

  return { products, loading, error };
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProduct(productId);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("상품을 불러오는데 실패했습니다."));
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  return { product, loading, error };
}
