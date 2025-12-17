import { Product } from "./types";
import { dummyProducts } from "./dummyData";

/**
 * 메모리 기반 상품 저장소
 * 나중에 API/DB로 교체할 수 있도록 인터페이스를 유지합니다.
 */
class ProductStore {
  private products: Product[] = [];

  constructor() {
    // 초기 더미 데이터 설정
    this.initializeDummyData();
  }

  /**
   * 더미 데이터 초기화
   */
  private initializeDummyData(): void {
    this.products = [...dummyProducts];
  }

  /**
   * 모든 상품을 조회합니다.
   * @returns 상품 배열
   */
  getAllProducts(): Product[] {
    return [...this.products];
  }

  /**
   * 특정 ID의 상품을 조회합니다.
   * @param id 상품 ID
   * @returns 상품 객체 또는 undefined
   */
  getProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  /**
   * 새 상품을 추가합니다. (관리자 기능)
   * @param product 추가할 상품 객체
   */
  addProduct(product: Product): void {
    this.products.push(product);
  }
}

// 싱글톤 인스턴스 export
export const productStore = new ProductStore();

