export interface PaymentAttempt {
  daysBefore: number;
  attemptDate: Date;
}

/**
 * 결제 시도일을 생성합니다.
 * 마지막 배송예정일 기준 D-7, D-6, D-5, D-4에 해당하는 날짜를 생성합니다.
 * 
 * @param lastDeliveryDate 마지막 배송예정일
 * @returns 결제 시도일 배열 (D-7부터 D-4까지)
 */
export function generatePaymentAttempts(
  lastDeliveryDate: Date
): PaymentAttempt[] {
  const attempts: PaymentAttempt[] = [];
  for (let daysBefore = 7; daysBefore >= 4; daysBefore--) {
    const attemptDate = new Date(lastDeliveryDate);
    attemptDate.setDate(lastDeliveryDate.getDate() - daysBefore);
    attempts.push({
      daysBefore,
      attemptDate,
    });
  }
  return attempts;
}

