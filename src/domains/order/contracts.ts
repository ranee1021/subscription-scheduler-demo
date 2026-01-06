/**
 * Order 도메인 계약 (타입 정의)
 */

import type { DeliverySchedule } from "../subscription/contracts";

export interface Order {
  id: string;
  firstDeliveryDate: Date;
  status: "ACTIVE";
  deliveryCount: number;
  deliveries: DeliverySchedule[];
  createdAt: Date;
}

