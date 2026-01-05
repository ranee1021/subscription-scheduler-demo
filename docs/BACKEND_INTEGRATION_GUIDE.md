# 백엔드 연동 가이드

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [아키텍처 철학](#아키텍처-철학)
3. [프로젝트 구조](#프로젝트-구조)
4. [도메인 모델](#도메인-모델)
5. [API 스펙](#api-스펙)
6. [비즈니스 로직](#비즈니스-로직)
7. [데이터 흐름](#데이터-흐름)
8. [백엔드 연동 가이드](#백엔드-연동-가이드)
9. [참고사항](#참고사항)

---

## 프로젝트 개요

### 프로젝트명
정기배송 스케줄링 시스템 (Subscription Scheduler Demo)

### 기술 스택
- **프레임워크**: Next.js 16.0.10 (App Router)
- **언어**: TypeScript 5
- **UI**: React 19.2.1, Tailwind CSS 4
- **상태 관리**: React Hooks (useState, useEffect, useMemo)
- **빌드 도구**: Turbopack

### 주요 기능
1. **상품 관리**: 식단 정기배송 상품 및 단품 상품 조회
2. **주문 생성**: 다단계 주문 프로세스 (기간 선택 → 배송 주기 → 배송일 선택 → 결제)
3. **배송 스케줄 관리**: 주문 기간과 배송 주기에 따른 자동 스케줄 생성
4. **식단표 조회**: 월별 식단표 캘린더 조회
5. **주문 관리**: 주문 목록 조회 및 상세 조회

---

## 아키텍처 철학

### 1. 관심사의 분리 (Separation of Concerns)

프로젝트는 **Container/View 패턴**과 **Custom Hooks 패턴**을 결합하여 관심사를 명확히 분리합니다.

#### 구조
```
page.tsx (라우트)
  └─ Container (로직 및 상태 관리)
      └─ View (순수 UI 컴포넌트)
```

#### 역할 분담

**`page.tsx`**
- Next.js 라우트 엔트리 포인트
- Container 컴포넌트만 렌더링 (3-7줄)
- Suspense boundary로 감싸서 `useSearchParams` 사용 시 필수

**`Container.tsx`**
- 비즈니스 로직 및 상태 관리
- Custom Hooks 통합
- View 컴포넌트에 props 전달
- 이벤트 핸들러 정의

**`View.tsx`**
- 순수 UI 컴포넌트 (Presentational Component)
- props를 통해서만 데이터와 핸들러를 받음
- 비즈니스 로직 없음

**`hooks/`**
- 재사용 가능한 비즈니스 로직
- 상태 관리 및 사이드 이펙트 처리
- API 호출 로직

**`domain/`**
- 도메인 모델 타입 정의
- 도메인 비즈니스 로직 (스케줄 생성, 결제 시도일 생성 등)

### 2. 타입 안정성

TypeScript를 활용하여 모든 데이터 구조를 타입으로 정의합니다. 백엔드 API 응답도 이 타입 정의를 준수해야 합니다.

### 3. 클라이언트 사이드 렌더링 (CSR)

현재는 클라이언트 사이드에서 데이터를 fetch하여 렌더링합니다. 백엔드 연동 시에도 동일한 패턴을 유지합니다.

### 4. 에러 처리

모든 API 호출은 try-catch로 감싸며, 사용자에게 적절한 에러 메시지를 표시합니다.

---

## 프로젝트 구조

```
aistudy/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (현재는 더미 데이터)
│   │   ├── products/
│   │   ├── orders/
│   │   └── meal-plans/
│   ├── products/                 # 상품 관련 페이지
│   │   ├── page.tsx              # 상품 목록
│   │   └── [id]/page.tsx         # 상품 상세
│   ├── orders/                   # 주문 관련 페이지
│   │   ├── page.tsx              # 주문 목록
│   │   ├── [id]/page.tsx         # 주문 상세
│   │   └── new/page.tsx          # 새 주문 생성
│   └── meal-plan/page.tsx        # 식단표 캘린더
│
├── components/                   # React 컴포넌트
│   ├── products/
│   │   ├── ProductsContainer.tsx
│   │   ├── ProductsView.tsx
│   │   ├── ProductDetailContainer.tsx
│   │   ├── ProductDetailView.tsx
│   │   ├── OrderStep1-4.tsx      # 주문 단계별 컴포넌트
│   │   └── DeliveryCalendar.tsx
│   ├── orders/
│   │   ├── OrdersContainer.tsx
│   │   ├── OrdersView.tsx
│   │   ├── OrderDetailContainer.tsx
│   │   ├── OrderDetailView.tsx
│   │   ├── NewOrderContainer.tsx
│   │   └── NewOrderView.tsx
│   └── meal-plan/
│       ├── MealPlanContainer.tsx
│       └── MealPlanView.tsx
│
├── src/
│   ├── domain/                   # 도메인 모델 및 비즈니스 로직
│   │   ├── product/types.ts      # Product 타입 정의
│   │   ├── order/types.ts        # Order 타입 정의
│   │   ├── schedule/
│   │   │   ├── types.ts          # DeliverySchedule 타입
│   │   │   └── generateSchedule.ts  # 배송 스케줄 생성 로직
│   │   ├── payment/
│   │   │   └── generatePayment.ts   # 결제 시도일 생성 로직
│   │   └── meal/types.ts         # MealPlan 타입 정의
│   │
│   ├── hooks/                    # Custom Hooks
│   │   ├── useProducts.ts        # 상품 목록 조회
│   │   ├── useProduct.ts         # 상품 상세 조회
│   │   ├── useOrders.ts          # 주문 목록 조회
│   │   ├── useOrder.ts           # 주문 상세 조회
│   │   ├── useProductOrderForm.ts # 주문 폼 상태 관리
│   │   ├── useDeliveryCalendar.ts # 배송 캘린더 로직
│   │   ├── useMealPlan.ts        # 식단표 조회
│   │   └── useMealPlanCalendar.ts # 식단표 캘린더 로직
│   │
│   └── utils/
│       └── date.ts               # 날짜 유틸리티 함수
│
└── database/                     # 데이터베이스 스키마
    ├── schema.sql                # MySQL/MariaDB 스키마
    ├── schema.postgresql.sql     # PostgreSQL 스키마
    ├── schema.sqlite.sql         # SQLite 스키마
    ├── ERD.md                    # 엔티티 관계 다이어그램
    └── README.md                  # 스키마 설명
```

---

## 도메인 모델

### 1. Product (상품)

```typescript
export type ProductKind = "식단" | "단품";

export interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;              // 상품 대표 이미지 URL
  kind: ProductKind;              // "식단" 또는 "단품"
  mealStageId?: MealStageId;      // 식단 상품인 경우: "초기" | "중기"
  periodOptions: PeriodOption[];  // 이용 기간 옵션
  createdAt: Date;
}

export interface PeriodOption {
  period: "1주" | "2주" | "4주";
  price: number;                  // 원 단위
}
```

**특징:**
- `kind`가 "식단"인 경우 `mealStageId`가 필수
- `periodOptions`는 최소 1개 이상 필요
- `imageUrl`은 선택 사항 (없으면 기본 이미지 표시)

### 2. Order (주문)

```typescript
export interface Order {
  id: string;                     // 고유 주문 ID
  firstDeliveryDate: Date;        // 첫 배송일
  status: "ACTIVE";               // 현재는 "ACTIVE"만 사용
  deliveryCount: number;          // 총 배송 횟수
  deliveries: DeliverySchedule[]; // 배송 스케줄 배열
  createdAt: Date;               // 주문 생성일
}
```

**특징:**
- `deliveryCount`는 `deliveries.length`와 일치해야 함
- `deliveries`는 `sequence` 순서로 정렬되어야 함

### 3. DeliverySchedule (배송 스케줄)

```typescript
export interface DeliverySchedule {
  sequence: number;               // 배송 회차 (1부터 시작)
  originalDeliveryDate: Date;     // 원래 배송 예정일
  productionDate: Date;           // 생산 기준일 (배송일 -1일)
}

export type DeliveryFrequency = "주3회" | "매일배송";
```

**특징:**
- `productionDate`는 항상 `originalDeliveryDate`의 하루 전
- `sequence`는 1부터 시작하여 순차적으로 증가
- "주3회" 배송: 월/수/금 또는 화/목/토 세트 중 하나
- "매일배송": 일요일 제외 매일 배송

### 4. PaymentAttempt (결제 시도)

```typescript
export interface PaymentAttempt {
  daysBefore: number;             // 마지막 배송일 기준 D-7, D-6, D-5, D-4
  attemptDate: Date;             // 결제 시도일
}
```

**특징:**
- 마지막 배송일 기준 D-7, D-6, D-5, D-4에 4번 시도
- `daysBefore`는 7, 6, 5, 4 순서

### 5. MealPlan (식단표)

```typescript
export type MealStageId = "초기" | "중기";

export interface MonthlyMealPlan {
  year: number;                   // 연도 (예: 2025)
  month: number;                   // 월 (1-12)
  stageId: MealStageId;           // "초기" 또는 "중기"
  days: DailyMeal[];              // 일별 식단 정보
}

export interface DailyMeal {
  date: string;                   // ISO 날짜 문자열 (예: "2025-12-01")
  menus: string[];                // 해당 날짜의 메뉴 배열
}
```

**특징:**
- `days` 배열은 해당 월의 모든 날짜를 포함해야 함
- `date`는 ISO 형식 문자열 (YYYY-MM-DD)
- `menus`는 빈 배열일 수 있음 (해당 날짜에 식단이 없는 경우)

---

## API 스펙

### 공통 응답 형식

모든 API는 다음 형식을 따릅니다:

**성공 응답:**
```json
{
  "success": true,
  "data": { ... }
}
```

**실패 응답:**
```json
{
  "success": false,
  "error": "에러 메시지"
}
```

### 1. 상품 목록 조회

**엔드포인트:** `GET /api/products`

**응답:**
```json
{
  "success": true,
  "data": [
    {
      "id": "product-1",
      "name": "초기",
      "description": "초기 식단 정기배송 상품",
      "kind": "식단",
      "mealStageId": "초기",
      "imageUrl": "/products/product-1.jpg",
      "periodOptions": [
        { "period": "1주", "price": 50000 },
        { "period": "2주", "price": 95000 },
        { "period": "4주", "price": 180000 }
      ],
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

**주의사항:**
- `createdAt`은 ISO 8601 형식 문자열
- `periodOptions`는 최소 1개 이상 필요
- `imageUrl`이 없으면 `null` 또는 빈 문자열 가능

### 2. 상품 상세 조회

**엔드포인트:** `GET /api/products/[id]`

**응답:**
```json
{
  "success": true,
  "data": {
    "id": "product-1",
    "name": "초기",
    "description": "초기 식단 정기배송 상품",
    "kind": "식단",
    "mealStageId": "초기",
    "imageUrl": "/products/product-1.jpg",
    "periodOptions": [
      { "period": "1주", "price": 50000 },
      { "period": "2주", "price": 95000 },
      { "period": "4주", "price": 180000 }
    ],
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**에러 응답 (상품 없음):**
```json
{
  "success": false,
  "error": "상품을 찾을 수 없습니다."
}
```

### 3. 주문 목록 조회

**엔드포인트:** `GET /api/orders`

**응답:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order-123",
      "firstDeliveryDate": "2025-12-15T00:00:00.000Z",
      "status": "ACTIVE",
      "deliveryCount": 12,
      "deliveries": [
        {
          "sequence": 1,
          "originalDeliveryDate": "2025-12-15T00:00:00.000Z",
          "productionDate": "2025-12-14T00:00:00.000Z"
        },
        {
          "sequence": 2,
          "originalDeliveryDate": "2025-12-17T00:00:00.000Z",
          "productionDate": "2025-12-16T00:00:00.000Z"
        }
      ],
      "createdAt": "2025-12-01T00:00:00.000Z"
    }
  ]
}
```

**주의사항:**
- 모든 날짜는 ISO 8601 형식 문자열
- `deliveries`는 `sequence` 순서로 정렬되어야 함
- `deliveryCount`는 `deliveries.length`와 일치해야 함

### 4. 주문 상세 조회

**엔드포인트:** `GET /api/orders/[id]`

**응답:**
```json
{
  "success": true,
  "data": {
    "id": "order-123",
    "firstDeliveryDate": "2025-12-15T00:00:00.000Z",
    "status": "ACTIVE",
    "deliveryCount": 12,
    "deliveries": [ ... ],
    "createdAt": "2025-12-01T00:00:00.000Z"
  }
}
```

**에러 응답 (주문 없음):**
```json
{
  "success": false,
  "error": "주문을 찾을 수 없습니다."
}
```

### 5. 주문 생성

**엔드포인트:** `POST /api/orders`

**요청 본문:**
```json
{
  "id": "order-123",  // 선택 사항 (없으면 서버에서 생성)
  "firstDeliveryDate": "2025-12-15T00:00:00.000Z",
  "status": "ACTIVE",
  "deliveryCount": 12,
  "deliveries": [
    {
      "sequence": 1,
      "originalDeliveryDate": "2025-12-15T00:00:00.000Z",
      "productionDate": "2025-12-14T00:00:00.000Z"
    }
  ],
  "createdAt": "2025-12-01T00:00:00.000Z"  // 선택 사항
}
```

**성공 응답:**
```json
{
  "success": true,
  "data": {
    "id": "order-123",
    "firstDeliveryDate": "2025-12-15T00:00:00.000Z",
    "status": "ACTIVE",
    "deliveryCount": 12,
    "deliveries": [ ... ],
    "createdAt": "2025-12-01T00:00:00.000Z"
  }
}
```

**에러 응답:**
```json
{
  "success": false,
  "error": "이미 존재하는 주문 ID입니다."
}
```

### 6. 식단표 조회

**엔드포인트:** `GET /api/meal-plans?year=2025&month=12&stageId=초기`

**쿼리 파라미터:**
- `year`: 숫자 (예: 2025) - 기본값: 2025
- `month`: 숫자 (1-12) - 기본값: 12
- `stageId`: "초기" | "중기" - 기본값: "초기"

**응답:**
```json
{
  "success": true,
  "data": {
    "year": 2025,
    "month": 12,
    "stageId": "초기",
    "days": [
      {
        "date": "2025-12-01",
        "menus": ["메뉴1", "메뉴2"]
      },
      {
        "date": "2025-12-02",
        "menus": ["메뉴3", "메뉴4"]
      }
    ]
  }
}
```

**주의사항:**
- `days` 배열은 해당 월의 모든 날짜를 포함해야 함
- `date`는 ISO 형식 문자열 (YYYY-MM-DD)
- `menus`는 빈 배열일 수 있음

---

## 비즈니스 로직

### 1. 배송 스케줄 생성

**위치:** `src/domain/schedule/generateSchedule.ts`

**함수:** `generateDeliverySchedules(startDate, weeks, frequency)`

**로직:**

#### "주3회" 배송
- 첫 배송일의 요일에 따라 요일 세트 결정:
  - 월(1), 수(3), 금(5) → 월/수/금 세트
  - 화(2), 목(4), 토(6) → 화/목/토 세트
- 1주 = 3회, 2주 = 6회, 4주 = 12회
- 첫 배송일부터 하루씩 증가시키면서 선택된 요일 세트에 해당하는 날짜만 순차적으로 채택

#### "매일배송"
- 일요일(0) 제외 매일 배송
- 1주 = 6회, 2주 = 12회, 4주 = 24회

**생산일 계산:**
- `productionDate = originalDeliveryDate - 1일`

**예시:**
```typescript
// 첫 배송일: 2025-12-15 (월요일)
// 기간: 2주
// 주기: 주3회
// 결과: 월/수/금 세트로 6회 배송
// - 2025-12-15 (월), 2025-12-17 (수), 2025-12-19 (금)
// - 2025-12-22 (월), 2025-12-24 (수), 2025-12-26 (금)
```

### 2. 결제 시도일 생성

**위치:** `src/domain/payment/generatePayment.ts`

**함수:** `generatePaymentAttempts(lastDeliveryDate)`

**로직:**
- 마지막 배송일 기준 D-7, D-6, D-5, D-4에 4번 시도
- `daysBefore`는 7, 6, 5, 4 순서

**예시:**
```typescript
// 마지막 배송일: 2025-12-26
// 결과:
// - D-7: 2025-12-19
// - D-6: 2025-12-20
// - D-5: 2025-12-21
// - D-4: 2025-12-22
```

### 3. 주문 폼 상태 관리

**위치:** `src/hooks/useProductOrderForm.ts`

**상태:**
- `selectedPeriod`: "1주" | "2주" | "4주"
- `deliveryFrequency`: "주3회" | "매일배송"
- `selectedDate`: 첫 배송일 (Date | null)

**계산된 값:**
- `selectedPrice`: 선택된 기간 옵션의 가격
- `dailyPrice`: 1일 단가 (selectedPrice / (weeks * 7))
- `schedules`: `generateDeliverySchedules`로 생성된 배송 스케줄
- `lastDeliveryDate`: 마지막 배송일
- `paymentAttempts`: `generatePaymentAttempts`로 생성된 결제 시도일

---

## 데이터 흐름

### 1. 상품 목록 조회

```
사용자 → ProductsPage
  → ProductsContainer
    → useProducts()
      → fetch('/api/products')
        → API Route (app/api/products/route.ts)
          → 백엔드 API (향후)
            → 응답 반환
              → ProductsView 렌더링
```

### 2. 주문 생성

```
사용자 → ProductDetailPage
  → 주문 버튼 클릭
    → OrderBottomSheet 열림
      → 단계별 입력 (기간 → 주기 → 날짜 → 확인)
        → NewOrderPage
          → NewOrderContainer
            → handleCreateOrder()
              → POST /api/orders
                → API Route (app/api/orders/route.ts)
                  → 백엔드 API (향후)
                    → 주문 생성
                      → 주문 상세 페이지로 리다이렉트
```

### 3. 배송 스케줄 생성

```
주문 폼에서 첫 배송일 선택
  → useProductOrderForm
    → generateDeliverySchedules(selectedDate, weeks, frequency)
      → DeliverySchedule[] 생성
        → DeliveryCalendar에 표시
          → 사용자가 확인 후 주문 생성
```

---

## 백엔드 연동 가이드

### 1. API Routes 교체

현재 `app/api/` 디렉토리의 API Routes는 더미 데이터를 반환합니다. 백엔드 연동 시 이 파일들을 수정하여 실제 백엔드 API를 호출하도록 변경합니다.

**예시: `app/api/products/route.ts`**

```typescript
// 현재 (더미 데이터)
import { serverProducts } from "./data";
export async function GET() {
  return NextResponse.json({
    success: true,
    data: serverProducts,
  });
}

// 백엔드 연동 후
export async function GET() {
  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('상품 목록 조회 실패');
    }
    
    const data = await response.json();
    
    // 백엔드 응답을 프론트엔드 타입에 맞게 변환
    return NextResponse.json({
      success: true,
      data: data.map(transformProduct),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "상품 목록을 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
```

### 2. 환경 변수 설정

`.env.local` 파일에 백엔드 API URL과 인증 정보를 설정합니다:

```env
BACKEND_API_URL=https://api.example.com
API_KEY=your-api-key-here
```

### 3. 타입 변환 함수

백엔드 응답 형식이 프론트엔드 타입과 다를 경우 변환 함수를 작성합니다:

```typescript
// app/api/products/transform.ts
import type { Product } from "@/src/domain/product/types";

export function transformProduct(backendProduct: any): Product {
  return {
    id: backendProduct.id,
    name: backendProduct.name,
    description: backendProduct.description,
    imageUrl: backendProduct.image_url, // snake_case → camelCase
    kind: backendProduct.kind,
    mealStageId: backendProduct.meal_stage_id,
    periodOptions: backendProduct.period_options.map((opt: any) => ({
      period: opt.period,
      price: opt.price,
    })),
    createdAt: new Date(backendProduct.created_at),
  };
}
```

### 4. 에러 처리

백엔드 API 에러를 프론트엔드 형식에 맞게 변환합니다:

```typescript
try {
  const response = await fetch(...);
  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json(
      {
        success: false,
        error: error.message || "요청 처리에 실패했습니다.",
      },
      { status: response.status }
    );
  }
  // ...
} catch (error) {
  return NextResponse.json(
    {
      success: false,
      error: "서버와의 통신에 실패했습니다.",
    },
    { status: 500 }
  );
}
```

### 5. 인증 처리

백엔드 API가 인증을 요구하는 경우, API Route에서 인증 토큰을 처리합니다:

```typescript
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return NextResponse.json(
      { success: false, error: "인증이 필요합니다." },
      { status: 401 }
    );
  }
  
  // 백엔드 API 호출 시 토큰 전달
  const response = await fetch(`${process.env.BACKEND_API_URL}/products`, {
    headers: {
      'Authorization': authHeader,
    },
  });
  // ...
}
```

### 6. 데이터베이스 스키마 참고

`database/` 디렉토리에 데이터베이스 스키마가 정의되어 있습니다. 백엔드 개발 시 이 스키마를 참고하여 테이블 구조를 설계합니다.

**주요 테이블:**
- `products`: 상품 정보
- `product_period_options`: 상품 기간 옵션
- `orders`: 주문 정보
- `delivery_schedules`: 배송 스케줄
- `payment_attempts`: 결제 시도

자세한 내용은 `database/ERD.md`와 `database/README.md`를 참고하세요.

---

## 참고사항

### 1. 날짜 처리

- 모든 날짜는 ISO 8601 형식 문자열로 전송/수신
- 프론트엔드에서 `Date` 객체로 변환하여 사용
- 타임존은 UTC 기준

### 2. 가격 처리

- 모든 가격은 원 단위 정수
- 소수점 없음

### 3. ID 형식

- 상품 ID: `product-{number}` 또는 UUID
- 주문 ID: `order-{timestamp}-{random}` 또는 UUID

### 4. 상태 값

- 주문 상태: 현재는 "ACTIVE"만 사용 (향후 확장 가능)
- 배송 주기: "주3회" | "매일배송"
- 상품 유형: "식단" | "단품"
- 식단 단계: "초기" | "중기"

### 5. 배송 스케줄 생성 규칙

- "주3회" 배송: 첫 배송일의 요일에 따라 요일 세트 자동 결정
- "매일배송": 일요일 제외 매일 배송
- 생산일은 항상 배송일의 하루 전

### 6. 결제 시도일 규칙

- 마지막 배송일 기준 D-7, D-6, D-5, D-4에 4번 시도
- `daysBefore`는 7, 6, 5, 4 순서

### 7. 식단표 데이터

- 월별 식단표는 해당 월의 모든 날짜를 포함해야 함
- 메뉴가 없는 날짜는 `menus: []`로 표시

### 8. 에러 메시지

- 사용자 친화적인 한글 메시지 사용
- 기술적인 에러는 콘솔에만 출력

---

## 문의사항

백엔드 연동 관련 문의사항이 있으시면 프론트엔드 개발팀에 문의해 주세요.

