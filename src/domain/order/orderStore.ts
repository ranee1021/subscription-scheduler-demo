import { Order } from "./types";

const STORAGE_KEY = "orders";

/**
 * localStorage 기반 주문 저장소 (브라우저 세션 동안 유지)
 * 나중에 API/DB로 교체할 수 있도록 인터페이스를 유지합니다.
 */
class OrderStore {
  /**
   * localStorage에서 주문 목록을 로드합니다.
   */
  private loadOrders(): Order[] {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      const orders = JSON.parse(stored);
      // Date 객체 복원
      return orders.map((order: any) => ({
        ...order,
        firstDeliveryDate: new Date(order.firstDeliveryDate),
        createdAt: new Date(order.createdAt),
        deliveries: order.deliveries.map((delivery: any) => ({
          ...delivery,
          originalDeliveryDate: new Date(delivery.originalDeliveryDate),
          productionDate: new Date(delivery.productionDate),
        })),
      }));
    } catch (error) {
      console.error("주문 목록 로드 실패:", error);
      return [];
    }
  }

  /**
   * localStorage에 주문 목록을 저장합니다.
   */
  private saveOrders(orders: Order[]): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("주문 목록 저장 실패:", error);
    }
  }

  /**
   * 새 주문을 생성합니다.
   * @param order 생성할 주문 객체
   */
  createOrder(order: Order): void {
    const orders = this.loadOrders();
    
    // 중복 ID 체크
    const existingOrder = orders.find(o => o.id === order.id);
    if (existingOrder) {
      console.warn(`주문 ID ${order.id}가 이미 존재합니다. 건너뜁니다.`);
      return;
    }
    
    orders.push(order);
    this.saveOrders(orders);
    console.log(`주문 생성됨: ${order.id}, 총 주문 수: ${orders.length}`);
  }

  /**
   * 모든 주문을 조회합니다.
   * @returns 주문 배열
   */
  getAllOrders(): Order[] {
    const orders = this.loadOrders();
    console.log(`주문 조회: 총 ${orders.length}개`);
    return [...orders];
  }

  /**
   * 특정 ID의 주문을 조회합니다.
   * @param id 주문 ID
   * @returns 주문 객체 또는 undefined
   */
  getOrderById(id: string): Order | undefined {
    const orders = this.loadOrders();
    return orders.find((order) => order.id === id);
  }
}

// 싱글톤 인스턴스 export
export const orderStore = new OrderStore();


