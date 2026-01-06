# 공통 구조 분석 및 개선 제안

## 현재 상태 분석

### ✅ 잘 분리되어 있는 공통 요소

#### 1. 공통 유틸리티 (`src/utils/`)
- **`date.ts`**: 날짜 관련 유틸리티 함수들
  - `formatDate`, `formatDateTime`, `formatDateKorean`, `formatDateInput`
  - `getMonthLabel`, `getMonthMeta`, `splitDate`, `isSameDate`
  - 여러 컴포넌트에서 재사용 중 ✅

#### 2. 도메인 로직 (`src/domain/`)
- **`schedule/generateSchedule.ts`**: 배송 스케줄 생성 로직
- **`payment/generatePayment.ts`**: 결제 시도일 생성 로직
- **타입 정의**: `types.ts` 파일들로 타입 중앙 관리 ✅

#### 3. 커스텀 훅 (`src/hooks/`)
- 재사용 가능한 비즈니스 로직 훅들
- `useProducts`, `useProduct`, `useOrders`, `useOrder` 등 ✅

---

### ⚠️ 개선이 필요한 공통 요소

#### 1. 공통 컴포넌트 부재

**문제점:**
- 버튼 스타일이 여러 컴포넌트에 중복됨
- "이전/다음" 버튼이 OrderStep1, OrderStep2, OrderStep3, OrderStep4, OrderStep5에 반복
- 로딩 컴포넌트가 Suspense fallback에 중복

**중복 코드 예시:**

```tsx
// OrderStep1.tsx, OrderStep2.tsx, OrderStep3.tsx 등에서 반복
<button
  type="button"
  onClick={onPrevious}
  className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
>
  이전
</button>
<button
  type="button"
  onClick={onNext}
  className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
>
  다음
</button>
```

```tsx
// app/products/page.tsx, app/products/[id]/page.tsx에서 중복
<Suspense fallback={
  <div className="min-h-screen bg-gray-50 px-4 py-8">
    <div className="mx-auto max-w-7xl">
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        로딩 중...
      </div>
    </div>
  </div>
}>
```

#### 2. 공통 상수 부재

**문제점:**
- "주3회", "매일배송", "1주", "2주", "4주" 같은 값들이 여러 곳에 하드코딩
- 타입 안정성은 있지만, 값 자체가 중복

**중복 예시:**
- `components/products/OrderStep1.tsx`: `"1주" | "2주" | "4주"`
- `components/products/OrderStep2.tsx`: `"주3회" | "매일배송"`
- `components/products/ProductDetailContainer.tsx`: 동일한 값들 반복

#### 3. 공통 스타일 클래스 중복

**문제점:**
- Tailwind 클래스명이 여러 컴포넌트에 반복
- 버튼 스타일, 카드 스타일 등이 중복

---

## 개선 제안

### 1. 공통 컴포넌트 생성

#### `components/common/Button.tsx`
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export function Button({ variant = "primary", ...props }: ButtonProps) {
  const baseClasses = "rounded-lg px-6 py-2 text-sm font-medium transition";
  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${props.className || ""}`}
      {...props}
    >
      {props.children}
    </button>
  );
}
```

#### `components/common/LoadingSpinner.tsx`
```typescript
export function LoadingSpinner({ message = "로딩 중..." }: { message?: string }) {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-sm text-gray-400">{message}</div>
    </div>
  );
}
```

#### `components/common/PageLoading.tsx`
```typescript
export function PageLoading({ maxWidth = "max-w-7xl" }: { maxWidth?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className={`mx-auto ${maxWidth}`}>
        <LoadingSpinner />
      </div>
    </div>
  );
}
```

#### `components/common/StepNavigation.tsx`
```typescript
interface StepNavigationProps {
  onPrevious?: () => void;
  onNext: () => void;
  showPrevious?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
}

export function StepNavigation({
  onPrevious,
  onNext,
  showPrevious = false,
  nextDisabled = false,
  nextLabel = "다음",
}: StepNavigationProps) {
  return (
    <div className="mt-8 flex justify-end gap-3">
      {showPrevious && onPrevious && (
        <Button variant="outline" onClick={onPrevious}>
          이전
        </Button>
      )}
      <Button
        variant="primary"
        onClick={onNext}
        disabled={nextDisabled}
      >
        {nextLabel}
      </Button>
    </div>
  );
}
```

### 2. 공통 상수 생성

#### `src/constants/order.ts`
```typescript
export const PERIOD_OPTIONS = ["1주", "2주", "4주"] as const;
export type PeriodOption = typeof PERIOD_OPTIONS[number];

export const DELIVERY_FREQUENCIES = ["주3회", "매일배송"] as const;
export type DeliveryFrequency = typeof DELIVERY_FREQUENCIES[number];

export const DELIVERY_FREQUENCY_LABELS: Record<DeliveryFrequency, string> = {
  "주3회": "주 3회",
  "매일배송": "매일 배송(일요일 제외)",
};
```

### 3. 공통 스타일 유틸리티

#### `src/utils/styles.ts`
```typescript
export const buttonStyles = {
  primary: "rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700",
  secondary: "rounded-lg bg-gray-600 px-6 py-2 text-sm font-medium text-white hover:bg-gray-700",
  outline: "rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50",
  disabled: "rounded-lg bg-gray-300 px-6 py-2 text-sm font-medium text-white cursor-not-allowed",
};

export const cardStyles = {
  default: "rounded-lg border border-gray-200 bg-white p-4",
  highlighted: "rounded-lg bg-indigo-50 p-4",
  muted: "rounded-lg bg-gray-50 p-4",
};
```

---

## 권장 디렉토리 구조

```
src/
├── constants/          # 공통 상수
│   ├── order.ts
│   └── index.ts
│
components/
├── common/            # 공통 컴포넌트
│   ├── Button.tsx
│   ├── LoadingSpinner.tsx
│   ├── PageLoading.tsx
│   ├── StepNavigation.tsx
│   └── index.ts
│
src/
└── utils/
    ├── date.ts        # 기존
    └── styles.ts      # 새로 추가
```

---

## 개선 효과

### 1. 코드 중복 제거
- 버튼 스타일 중복 제거 → 약 50줄 이상 감소
- 로딩 컴포넌트 중복 제거 → 약 20줄 감소

### 2. 유지보수성 향상
- 버튼 스타일 변경 시 한 곳만 수정
- 공통 상수 변경 시 타입 안정성 보장

### 3. 일관성 확보
- 모든 페이지에서 동일한 버튼 스타일 사용
- 로딩 상태 표시 일관성 확보

### 4. 재사용성 향상
- 새로운 페이지/컴포넌트에서 공통 컴포넌트 즉시 사용 가능

---

## 마이그레이션 계획

### Phase 1: 공통 컴포넌트 생성
1. `components/common/` 디렉토리 생성
2. `Button`, `LoadingSpinner`, `PageLoading`, `StepNavigation` 컴포넌트 생성

### Phase 2: 공통 상수 생성
1. `src/constants/` 디렉토리 생성
2. `order.ts`에 상수 정의

### Phase 3: 기존 코드 마이그레이션
1. OrderStep 컴포넌트들에서 공통 컴포넌트 사용
2. Suspense fallback을 `PageLoading`으로 교체
3. 하드코딩된 상수들을 `constants`에서 import

### Phase 4: 문서화
1. 공통 컴포넌트 사용 가이드 작성
2. 스타일 가이드 작성

---

## 결론

현재 프로젝트는 **도메인 로직과 유틸리티는 잘 분리**되어 있지만, **UI 컴포넌트와 상수 측면에서 개선 여지**가 있습니다.

**우선순위:**
1. 🔴 **높음**: 공통 버튼 컴포넌트 (가장 많이 중복됨)
2. 🟡 **중간**: 공통 상수 (타입 안정성 향상)
3. 🟢 **낮음**: 공통 스타일 유틸리티 (선택적)

위 개선사항을 적용하면 코드 품질과 유지보수성이 크게 향상될 것입니다.

