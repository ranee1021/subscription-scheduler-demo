# 커머스용 공통 컴포넌트 제안

## 현재 상태 분석

### ✅ 이미 구현된 공통 요소
- Button, LoadingSpinner, PageLoading, StepNavigation
- 날짜 유틸리티 함수들
- 도메인 로직 분리

### ⚠️ 개선이 필요한 부분
1. **가격 포맷팅**: `toLocaleString() + "원"`이 여러 곳에 중복
2. **에러 처리**: `alert()` 사용 (커머스에 부적합)
3. **이미지 처리**: placeholder, 에러 처리 없음
4. **빈 상태**: 하드코딩된 텍스트
5. **배지/태그**: 인라인 스타일로 구현
6. **모달/다이얼로그**: 범용 모달 컴포넌트 없음

---

## 커머스 필수 공통 컴포넌트

### 1. 가격 포맷팅 유틸리티 및 컴포넌트

**필요성**: 가격 표시가 여러 곳에 중복되고, 할인가/정가 표시가 필요할 수 있음

**구현 제안:**

```typescript
// src/utils/price.ts
export function formatPrice(price: number): string {
  return `${price.toLocaleString()}원`;
}

export function formatPriceWithoutUnit(price: number): string {
  return price.toLocaleString();
}

// components/common/Price.tsx
interface PriceProps {
  amount: number;
  originalAmount?: number; // 정가 (할인가 표시용)
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Price({ amount, originalAmount, size = "md", className }: PriceProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={className}>
      {originalAmount && originalAmount > amount ? (
        <div className="flex items-center gap-2">
          <span className={`${sizeClasses[size]} font-bold text-gray-900`}>
            {formatPrice(amount)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {formatPrice(originalAmount)}
          </span>
          <span className="text-xs font-semibold text-red-600">
            {Math.round(((originalAmount - amount) / originalAmount) * 100)}%
          </span>
        </div>
      ) : (
        <span className={`${sizeClasses[size]} font-bold text-gray-900`}>
          {formatPrice(amount)}
        </span>
      )}
    </div>
  );
}
```

**사용 예시:**
```tsx
<Price amount={50000} />
<Price amount={40000} originalAmount={50000} /> // 할인가 표시
```

---

### 2. 에러/알림 컴포넌트

**필요성**: `alert()`는 UX가 좋지 않음. 토스트나 모달 형태의 알림이 필요

**구현 제안:**

```typescript
// components/common/Toast.tsx
interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const typeClasses = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  };

  return (
    <div className={`fixed bottom-4 right-4 rounded-lg border px-4 py-3 shadow-lg ${typeClasses[type]}`}>
      <div className="flex items-center gap-2">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-2 text-lg font-bold">×</button>
        )}
      </div>
    </div>
  );
}

// hooks/useToast.ts
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastProps["type"] } | null>(null);

  const showToast = (message: string, type: ToastProps["type"] = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return { toast, showToast };
}
```

**사용 예시:**
```tsx
const { showToast } = useToast();
showToast("주문이 완료되었습니다.", "success");
showToast("주문 생성에 실패했습니다.", "error");
```

---

### 3. 이미지 컴포넌트 (에러 처리 포함)

**필요성**: 이미지 로딩 실패 시 placeholder 표시, lazy loading 최적화

**구현 제안:**

```typescript
// components/common/ProductImage.tsx
interface ProductImageProps {
  src: string | undefined;
  alt: string;
  fallback?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function ProductImage({
  src,
  alt,
  fallback = "/window.svg",
  className,
  fill,
  width,
  height,
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (fill) {
    return (
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600" />
          </div>
        )}
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={className}
          onError={handleError}
          onLoad={handleLoad}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600" />
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}
```

---

### 4. 빈 상태 (Empty State) 컴포넌트

**필요성**: 상품이 없을 때, 주문이 없을 때 등 일관된 빈 상태 표시

**구현 제안:**

```typescript
// components/common/EmptyState.tsx
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

**사용 예시:**
```tsx
{products.length === 0 && (
  <EmptyState
    title="등록된 상품이 없습니다"
    description="새로운 상품을 등록해보세요"
    action={{ label: "상품 등록", onClick: () => router.push("/products/new") }}
  />
)}
```

---

### 5. 배지/태그 컴포넌트

**필요성**: 상품 유형, 할인율, 신상품 등 배지 표시가 여러 곳에 필요

**구현 제안:**

```typescript
// components/common/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-yellow-50 text-yellow-700",
    error: "bg-red-50 text-red-700",
    info: "bg-indigo-50 text-indigo-700",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${className || ""}`}
    >
      {children}
    </span>
  );
}
```

**사용 예시:**
```tsx
<Badge variant="info">식단 정기배송</Badge>
<Badge variant="success">신상품</Badge>
<Badge variant="error">품절</Badge>
```

---

### 6. 모달/다이얼로그 컴포넌트

**필요성**: 확인 다이얼로그, 정보 표시 등 범용 모달 필요

**구현 제안:**

```typescript
// components/common/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative z-10 w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl`}>
        {title && (
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

// components/common/ConfirmDialog.tsx
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="mb-6 text-sm text-gray-600">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === "danger" ? "secondary" : "primary"}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
```

**사용 예시:**
```tsx
const [showConfirm, setShowConfirm] = useState(false);

<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={() => handleDelete()}
  title="주문 삭제"
  message="정말로 이 주문을 삭제하시겠습니까?"
  variant="danger"
/>
```

---

### 7. 수량 선택기 (Quantity Selector)

**필요성**: 장바구니, 주문 시 수량 선택이 필요할 수 있음

**구현 제안:**

```typescript
// components/common/QuantitySelector.tsx
interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="inline-flex items-center border border-gray-300 rounded-lg">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value, 10);
          if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            onChange(newValue);
          }
        }}
        min={min}
        max={max}
        disabled={disabled}
        className="w-12 border-0 text-center text-sm focus:outline-none disabled:bg-gray-50"
      />
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}
```

---

### 8. 폼 입력 컴포넌트

**필요성**: 주문 시 배송지 입력, 결제 정보 입력 등 폼이 필요할 수 있음

**구현 제안:**

```typescript
// components/common/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 focus:border-indigo-500"
        } ${className || ""}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

// components/common/Select.tsx
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 focus:border-indigo-500"
        } ${className || ""}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

---

## 우선순위

### 🔴 높음 (즉시 필요)
1. **가격 포맷팅 유틸리티** - 현재 중복이 많음
2. **에러/알림 컴포넌트** - `alert()` 대체 필요
3. **빈 상태 컴포넌트** - 일관성 확보

### 🟡 중간 (향후 필요)
4. **이미지 컴포넌트** - 에러 처리 개선
5. **배지 컴포넌트** - 재사용성 향상
6. **모달 컴포넌트** - 범용 모달 필요 시

### 🟢 낮음 (선택적)
7. **수량 선택기** - 장바구니 기능 추가 시
8. **폼 입력 컴포넌트** - 배송지/결제 정보 입력 시

---

## 구현 시 고려사항

1. **접근성**: ARIA 속성, 키보드 네비게이션 지원
2. **반응형**: 모바일/태블릿/데스크톱 대응
3. **다국어**: i18n 지원 (향후 확장)
4. **테마**: 다크모드 지원 (선택적)
5. **성능**: 이미지 lazy loading, 코드 스플리팅

---

## 결론

커머스 기준으로 **가격 포맷팅, 에러 처리, 빈 상태** 컴포넌트는 즉시 구현하는 것을 권장합니다. 나머지는 기능 확장 시점에 추가하면 됩니다.

