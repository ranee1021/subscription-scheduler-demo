/**
 * API 클라이언트 - baseURL, auth, retry, timeout, normalize
 */

import type { ApiResponse } from "./types";
import { ApiError, normalizeError } from "./error";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

const DEFAULT_TIMEOUT = 10000; // 10초
const DEFAULT_RETRIES = 0;

/**
 * 타임아웃을 포함한 fetch 래퍼
 */
async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("요청 시간이 초과되었습니다.", "TIMEOUT", 408);
    }
    throw error;
  }
}

/**
 * 재시도 로직이 포함된 fetch
 */
async function fetchWithRetry(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { retries = DEFAULT_RETRIES, ...fetchOptions } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchWithTimeout(url, fetchOptions);
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        // 지수 백오프: 1초, 2초, 4초...
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        continue;
      }
      throw error;
    }
  }

  throw normalizeError(lastError);
}

/**
 * 인증 토큰 가져오기
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  // session storage나 cookie에서 토큰 가져오기
  const { getToken } = require("../auth/session");
  return getToken();
}

/**
 * 기본 API fetch 래퍼
 */
export async function apiFetch<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetchWithRetry(url, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      const error = result.error || `HTTP error! status: ${response.status}`;
      const code = result.code;
      throw new ApiError(error, code, response.status);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      } as ApiResponse<T>;
    }

    const normalized = normalizeError(error);
    return {
      success: false,
      error: normalized.message,
    } as ApiResponse<T>;
  }
}

