/**
 * 환경 변수 설정
 */

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

