export interface DeliverySchedule {
  sequence: number;
  originalDeliveryDate: Date;
  productionDate: Date;
}

export type DeliveryFrequency = "주3회" | "매일배송";

