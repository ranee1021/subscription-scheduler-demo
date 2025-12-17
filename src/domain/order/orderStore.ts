import { Order } from "./types";

/**
 * 메모리 기반 주문 저장소
 * 나중에 API/DB로 교체할 수 있도록 인터페이스를 유지합니다.
 */
class OrderStore {
  private orders: Order[] = [];

  /**
   * 새 주문을 생성합니다.
   * @param order 생성할 주문 객체
   */
  createOrder(order: Order): void {
    this.orders.push(order);
  }

  /**
   * 모든 주문을 조회합니다.
   * @returns 주문 배열
   */
  getAllOrders(): Order[] {
    return [...this.orders];
  }

  /**
   * 특정 ID의 주문을 조회합니다.
   * @param id 주문 ID
   * @returns 주문 객체 또는 undefined
   */
  getOrderById(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }
}

// 싱글톤 인스턴스 export
export const orderStore = new OrderStore();

