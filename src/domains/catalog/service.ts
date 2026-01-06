/**
 * Catalog 도메인 서비스 (API 호출)
 */

import { apiFetch } from "@/src/core/api/client";
import type { Product } from "./contracts";

export async function getProducts(): Promise<Product[]> {
  const response = await apiFetch<Product[]>("/api/products");
  
  if (!response.success || !response.data) {
    throw new Error(response.error || "상품 목록을 불러오는데 실패했습니다.");
  }
  
  return response.data.map((product: any) => ({
    ...product,
    createdAt: new Date(product.createdAt),
  }));
}

export async function getProduct(productId: string): Promise<Product> {
  const response = await apiFetch<Product>(`/api/products/${productId}`);
  
  if (!response.success || !response.data) {
    throw new Error(response.error || "상품을 찾을 수 없습니다.");
  }
  
  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt),
  };
}

