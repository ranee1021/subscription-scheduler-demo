# 데이터베이스 스키마

이 디렉토리에는 정기배송 스케줄링 시스템의 데이터베이스 스키마가 포함되어 있습니다.

## 파일 구조

- `schema.sql`: MySQL/MariaDB용 전체 스키마 파일
- `schema.sqlite.sql`: SQLite용 스키마 파일
- `schema.postgresql.sql`: PostgreSQL용 스키마 파일
- `ERD.md`: 엔티티 관계 다이어그램 (Mermaid 형식)

## 테이블 구조

### 1. products (상품)
- 상품 기본 정보를 저장합니다.
- 주요 필드: id, name, description, created_at

### 2. product_period_options (상품 기간 옵션)
- 각 상품의 이용기간 옵션(1주, 2주, 4주)과 가격을 저장합니다.
- products 테이블과 1:N 관계

### 3. orders (주문)
- 주문 정보를 저장합니다.
- 주요 필드: id, product_id, first_delivery_date, status, delivery_count, delivery_frequency
- products 테이블과 N:1 관계

### 4. delivery_schedules (배송 스케줄)
- 각 주문의 배송 스케줄을 저장합니다.
- 주요 필드: order_id, sequence, original_delivery_date, production_date, status
- orders 테이블과 N:1 관계

### 5. payment_attempts (결제 시도)
- 결제 시도 정보를 저장합니다.
- 주요 필드: order_id, days_before, attempt_date, status, amount
- orders 테이블과 N:1 관계

## 사용 방법

### MySQL/MariaDB
```bash
mysql -u username -p database_name < schema.sql
```

### PostgreSQL
```bash
psql -U username -d database_name -f schema.postgresql.sql
```

### SQLite
```bash
sqlite3 database.db < schema.sqlite.sql
```

## 인덱스

성능 최적화를 위해 다음 인덱스가 생성됩니다:
- products: created_at
- orders: product_id, status, created_at, first_delivery_date
- delivery_schedules: order_id, sequence, original_delivery_date, production_date
- payment_attempts: order_id, attempt_date, status

## 외래 키 제약 조건

- `product_period_options.product_id` → `products.id` (CASCADE DELETE)
- `orders.product_id` → `products.id` (RESTRICT DELETE)
- `delivery_schedules.order_id` → `orders.id` (CASCADE DELETE)
- `payment_attempts.order_id` → `orders.id` (CASCADE DELETE)

