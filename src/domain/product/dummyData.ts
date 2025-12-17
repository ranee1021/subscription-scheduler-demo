import { Product } from "./types";

/**
 * 상품 목록 더미 데이터
 * 실제 API 연동 전까지 사용되는 샘플 데이터입니다.
 */
export const dummyProducts: Product[] = [
  {
    id: "product-1",
    name: "첫걸음 준비기",
    description: "초기 식단 정기배송 상품",
    periodOptions: [
    { period: "1주", price: 50000 },
    { period: "2주", price: 95000 },
    { period: "4주", price: 180000 },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "product-2",
    name: "옴뇸뇸 중기",
    description: "중기 식단 정기배송 상품",
    periodOptions: [
      { period: "1주", price: 65940 },
      { period: "2주", price: 120080 },
      { period: "4주", price: 244720 },
    ],
    createdAt: new Date("2024-01-01"),
  },
];


