import { NextResponse } from "next/server";
import { Order, loadOrders, saveOrders } from "./store";

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

