import { NextResponse } from "next/server";
import { serverProducts } from "../data";

/**
 * GET /api/products/[id]
 * 상품 상세 조회
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Next.js 16에서는 params가 Promise일 수 있음
    const resolvedParams = await Promise.resolve(params);
    const product = serverProducts.find((p) => p.id === resolvedParams.id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "상품을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("상품 정보 로드 실패:", error);
    return NextResponse.json(
      {
        success: false,
        error: "상품 정보를 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

