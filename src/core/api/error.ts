/**
 * API 에러 모델 및 매핑
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

/**
 * 에러 코드를 사용자 친화적인 메시지로 매핑
 */
export const ERROR_MESSAGES: Record<string, string> = {
  PRODUCT_NOT_FOUND: "상품을 찾을 수 없습니다.",
  ORDER_NOT_FOUND: "주문을 찾을 수 없습니다.",
  INVALID_INPUT: "입력값이 올바르지 않습니다.",
  UNAUTHORIZED: "인증이 필요합니다.",
  FORBIDDEN: "권한이 없습니다.",
  INTERNAL_ERROR: "서버 오류가 발생했습니다.",
};

/**
 * 에러 응답을 ApiError로 변환
 */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("알 수 없는 오류가 발생했습니다.");
}

/**
 * 에러 코드로부터 사용자 메시지 가져오기
 */
export function getErrorMessage(code?: string, defaultMessage?: string): string {
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }
  return defaultMessage || "오류가 발생했습니다.";
}

