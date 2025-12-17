-- 정기배송 스케줄링 시스템 데이터베이스 스키마 (SQLite)

-- 상품 테이블
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_products_created_at ON products(created_at);

-- 상품 기간 옵션 테이블
CREATE TABLE product_period_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    period TEXT NOT NULL CHECK (period IN ('1주', '2주', '4주')),
    price REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (product_id, period)
);

CREATE INDEX idx_period_options_product_id ON product_period_options(product_id);

-- 주문 테이블
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    first_delivery_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED')),
    delivery_count INTEGER NOT NULL,
    delivery_frequency TEXT NOT NULL CHECK (delivery_frequency IN ('주3회', '매일배송')),
    period_option TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_first_delivery_date ON orders(first_delivery_date);

-- 배송 스케줄 테이블
CREATE TABLE delivery_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    sequence INTEGER NOT NULL,
    original_delivery_date TEXT NOT NULL,
    production_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PRODUCED', 'DELIVERED', 'CANCELLED')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    UNIQUE (order_id, sequence)
);

CREATE INDEX idx_delivery_schedules_order_id ON delivery_schedules(order_id);
CREATE INDEX idx_delivery_schedules_sequence ON delivery_schedules(order_id, sequence);
CREATE INDEX idx_delivery_schedules_delivery_date ON delivery_schedules(original_delivery_date);
CREATE INDEX idx_delivery_schedules_production_date ON delivery_schedules(production_date);

-- 결제 시도 테이블
CREATE TABLE payment_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    days_before INTEGER NOT NULL,
    attempt_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED')),
    payment_method TEXT,
    transaction_id TEXT,
    amount REAL NOT NULL,
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_payment_attempts_order_id ON payment_attempts(order_id);
CREATE INDEX idx_payment_attempts_attempt_date ON payment_attempts(attempt_date);
CREATE INDEX idx_payment_attempts_status ON payment_attempts(status);

