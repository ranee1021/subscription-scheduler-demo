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

// 주문 데이터 파일 초기화
function ensureOrdersFile() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE_PATH)) {
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify([]));
  }
}

// 주문 목록 로드
function loadOrders(): Order[] {
  ensureOrdersFile();
  try {
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

// 주문 목록 저장
function saveOrders(orders: Order[]): void {
  ensureOrdersFile();
  try {
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error("주문 목록 저장 실패:", error);
  }
}

/**
 * GET /api/orders
 * 주문 목록 조회
 */
export async function GET() {
  try {
    const orders = loadOrders();
    // Date 객체를 ISO 문자열로 변환하여 직렬화
    const ordersData = orders.map((order) => ({
      ...order,
      firstDeliveryDate: order.firstDeliveryDate.toISOString(),
      createdAt: order.createdAt.toISOString(),
      deliveries: order.deliveries.map((delivery) => ({
        ...delivery,
        originalDeliveryDate: delivery.originalDeliveryDate.toISOString(),
        productionDate: delivery.productionDate.toISOString(),
      })),
    }));

    return NextResponse.json({
      success: true,
      data: ordersData,
    });
  } catch (error) {
    console.error("주문 목록 로드 실패:", error);
    return NextResponse.json(
      {
        success: false,
        error: "주문 목록을 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * 주문 생성
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order: Order = {
      id: body.id || `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      firstDeliveryDate: new Date(body.firstDeliveryDate),
      status: body.status || "ACTIVE",
      deliveryCount: body.deliveryCount,
      deliveries: body.deliveries.map((d: any) => ({
        sequence: d.sequence,
        originalDeliveryDate: new Date(d.originalDeliveryDate),
        productionDate: new Date(d.productionDate),
      })),
      createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
    };

    const orders = loadOrders();
    
    // 중복 ID 체크
    const existingOrder = orders.find((o) => o.id === order.id);
    if (existingOrder) {
      return NextResponse.json(
        {
          success: false,
          error: "이미 존재하는 주문 ID입니다.",
        },
        { status: 400 }
      );
    }

    orders.push(order);
    saveOrders(orders);

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("주문 생성 실패:", error);
    return NextResponse.json(
      {
        success: false,
        error: "주문 생성에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

