import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// API Routes 전용 타입 정의 (서버 전용)
interface Order {
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

const ORDERS_FILE_PATH = path.join(process.cwd(), "data", "orders.json");

// 주문 목록 로드
function loadOrders(): Order[] {
  try {
    if (!fs.existsSync(ORDERS_FILE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(ORDERS_FILE_PATH, "utf-8");
    const orders = JSON.parse(data);
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
 * GET /api/orders/[id]
 * 주문 상세 조회
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Next.js 16에서는 params가 Promise일 수 있음
    const resolvedParams = await Promise.resolve(params);
    const orders = loadOrders();
    const order = orders.find((o) => o.id === resolvedParams.id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "주문을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    // Date 객체를 ISO 문자열로 변환하여 직렬화
    const orderData = {
      ...order,
      firstDeliveryDate: order.firstDeliveryDate.toISOString(),
      createdAt: order.createdAt.toISOString(),
      deliveries: order.deliveries.map((delivery) => ({
        ...delivery,
        originalDeliveryDate: delivery.originalDeliveryDate.toISOString(),
        productionDate: delivery.productionDate.toISOString(),
      })),
    };

    return NextResponse.json({
      success: true,
      data: orderData,
    });
  } catch (error) {
    console.error("주문 정보 로드 실패:", error);
    return NextResponse.json(
      {
        success: false,
        error: "주문 정보를 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

