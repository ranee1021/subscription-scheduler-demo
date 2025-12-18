// API Routes 전용 타입 정의 (서버 전용)
export interface Order {
  id: string;
  firstDeliveryDate: Date;
  status: "ACTIVE";
  deliveryCount: number;
  deliveries: Array<{
    sequence: number;
    originalDeliveryDate: Date;
    productionDate: Date;
  }>;
  createdAt: Date;
}

// 메모리 기반 주문 저장소 (서버리스 환경 대응)
// 주의: 서버리스 함수는 상태를 유지하지 않으므로, 실제 배포 시에는 DB나 KV 스토어 사용 권장
let ordersMemory: Order[] = [];

// 주문 목록 로드 (메모리에서)
export function loadOrders(): Order[] {
  return ordersMemory.map((order) => ({
    ...order,
    firstDeliveryDate: new Date(order.firstDeliveryDate),
    createdAt: new Date(order.createdAt),
    deliveries: order.deliveries.map((delivery) => ({
      ...delivery,
      originalDeliveryDate: new Date(delivery.originalDeliveryDate),
      productionDate: new Date(delivery.productionDate),
    })),
  }));
}

// 주문 목록 저장 (메모리에)
export function saveOrders(orders: Order[]): void {
  ordersMemory = orders;
}

