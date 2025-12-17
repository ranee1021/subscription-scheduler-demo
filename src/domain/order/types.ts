import { DeliverySchedule } from "../schedule/types";

export interface Order {
  id: string;
  firstDeliveryDate: Date;
  status: "ACTIVE";
  deliveryCount: number;
  deliveries: DeliverySchedule[];
  createdAt: Date;
}


