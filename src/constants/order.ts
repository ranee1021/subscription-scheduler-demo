export const PERIOD_OPTIONS = ["1주", "2주", "4주"] as const;
export type PeriodOption = typeof PERIOD_OPTIONS[number];

export const DELIVERY_FREQUENCIES = ["주3회", "매일배송"] as const;
export type DeliveryFrequency = typeof DELIVERY_FREQUENCIES[number];

export const DELIVERY_FREQUENCY_LABELS: Record<DeliveryFrequency, string> = {
  "주3회": "주 3회",
  "매일배송": "매일 배송(일요일 제외)",
};

