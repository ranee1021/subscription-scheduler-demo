import { NextResponse } from "next/server";
import { serverProducts } from "./data";

/**
 * GET /api/products
 * 상품 목록 조회
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: serverProducts,
    });
  } catch (error) {
    console.error("상품 목록 로드 실패:", error);
    return NextResponse.json(
      {
        success: false,
        error: "상품 목록을 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

