-- 정기배송 스케줄링 시스템 데이터베이스 스키마 (PostgreSQL)

-- 상품 테이블
CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_created_at ON products(created_at);

-- 상품 기간 옵션 테이블
CREATE TABLE product_period_options (
    id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    period VARCHAR(10) NOT NULL CHECK (period IN ('1주', '2주', '4주')),
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (product_id, period)
);

CREATE INDEX idx_period_options_product_id ON product_period_options(product_id);

-- 주문 테이블
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    first_delivery_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED')),
    delivery_count INTEGER NOT NULL,
    delivery_frequency VARCHAR(10) NOT NULL CHECK (delivery_frequency IN ('주3회', '매일배송')),
    period_option VARCHAR(10) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_first_delivery_date ON orders(first_delivery_date);

ALTER TABLE orders ADD CONSTRAINT fk_orders_product_id 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

-- 배송 스케줄 테이블
CREATE TABLE delivery_schedules (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    sequence INTEGER NOT NULL,
    original_delivery_date DATE NOT NULL,
    production_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PRODUCED', 'DELIVERED', 'CANCELLED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    UNIQUE (order_id, sequence)
);

CREATE INDEX idx_delivery_schedules_order_id ON delivery_schedules(order_id);
CREATE INDEX idx_delivery_schedules_sequence ON delivery_schedules(order_id, sequence);
CREATE INDEX idx_delivery_schedules_delivery_date ON delivery_schedules(original_delivery_date);
CREATE INDEX idx_delivery_schedules_production_date ON delivery_schedules(production_date);

-- 결제 시도 테이블
CREATE TABLE payment_attempts (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    days_before INTEGER NOT NULL,
    attempt_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED')),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_payment_attempts_order_id ON payment_attempts(order_id);
CREATE INDEX idx_payment_attempts_attempt_date ON payment_attempts(attempt_date);
CREATE INDEX idx_payment_attempts_status ON payment_attempts(status);

-- updated_at 자동 업데이트 트리거 함수 (PostgreSQL)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_schedules_updated_at BEFORE UPDATE ON delivery_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_attempts_updated_at BEFORE UPDATE ON payment_attempts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

