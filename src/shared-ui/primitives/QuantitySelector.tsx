"use client";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      if (newValue < min) {
        onChange(min);
      } else if (newValue > max) {
        onChange(max);
      } else {
        onChange(newValue);
      }
    }
  };

  return (
    <div className={`inline-flex items-center border border-gray-300 rounded-lg ${className || ""}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="수량 감소"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className="w-12 border-0 text-center text-sm focus:outline-none disabled:bg-gray-50"
        aria-label="수량"
      />
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="수량 증가"
      >
        +
      </button>
    </div>
  );
}

