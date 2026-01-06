/**
 * API 공통 타입 정의
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: Pagination;
}

