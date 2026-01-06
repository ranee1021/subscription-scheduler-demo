/**
 * 공통 포맷팅 함수들
 */

// 날짜 포맷팅
export function getMonthLabel(year: number, month: number) {
  return `${year}년 ${month}월`;
}

export function getMonthMeta(year: number, month: number, daysInMonth?: number) {
  const firstDay = new Date(year, month - 1, 1);
  const firstWeekday = firstDay.getDay();
  const actualDaysInMonth = daysInMonth ?? new Date(year, month, 0).getDate();
  return { firstWeekday, daysInMonth: actualDaysInMonth };
}

export function splitDate(date: string) {
  const [y, m, d] = date.split("-").map((v) => Number(v));
  return { year: y, month: m, day: d };
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("ko-KR");
}

export function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDateKorean(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

export function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// 가격 포맷팅
export function formatPrice(price: number): string {
  return `${price.toLocaleString()}원`;
}

export function formatPriceWithoutUnit(price: number): string {
  return price.toLocaleString();
}

export function calculateDiscountRate(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

