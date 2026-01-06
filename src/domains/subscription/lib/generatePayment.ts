import type { PaymentAttempt } from "../contracts";

/**
 * 결제 시도일을 생성합니다.
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

