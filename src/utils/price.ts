/**
 * 가격 포맷팅 유틸리티 함수
 */

/**
 * 가격을 원화 형식으로 포맷팅합니다.
 * @param price 가격 (숫자)
 * @returns 포맷팅된 가격 문자열 (예: "50,000원")
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString()}원`;
}

/**
 * 가격을 천단위 콤마만 포함한 문자열로 포맷팅합니다.
 * @param price 가격 (숫자)
 * @returns 포맷팅된 가격 문자열 (예: "50,000")
 */
export function formatPriceWithoutUnit(price: number): string {
  return price.toLocaleString();
}

/**
 * 할인율을 계산합니다.
 * @param originalPrice 정가
 * @param discountedPrice 할인가
 * @returns 할인율 (0-100)
 */
export function calculateDiscountRate(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

