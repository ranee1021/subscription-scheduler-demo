/**
 * 서버 전용 상품 데이터
 * API Routes에서만 사용됩니다.
 */
export const serverProducts = [
  {
    id: "product-1",
    name: "첫걸음 준비기",
    description: "초기 식단 정기배송 상품",
    periodOptions: [
      { period: "1주", price: 50000 },
      { period: "2주", price: 95000 },
      { period: "4주", price: 180000 },
    ],
    createdAt: "2024-01-15T00:00:00.000Z",
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
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

