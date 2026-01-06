"use client";

import { formatPrice, calculateDiscountRate } from "../lib/format";

interface PriceProps {
  amount: number;
  originalAmount?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showDiscountRate?: boolean;
}

export function Price({
  amount,
  originalAmount,
  size = "md",
  className,
  showDiscountRate = true,
}: PriceProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const hasDiscount = originalAmount && originalAmount > amount;

  return (
    <div className={className}>
      {hasDiscount ? (
        <div className="flex items-center gap-2">
          <span className={`${sizeClasses[size]} font-bold text-gray-900`}>
            {formatPrice(amount)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {formatPrice(originalAmount!)}
          </span>
          {showDiscountRate && (
            <span className="text-xs font-semibold text-red-600">
              {calculateDiscountRate(originalAmount!, amount)}%
            </span>
          )}
        </div>
      ) : (
        <span className={`${sizeClasses[size]} font-bold text-gray-900`}>
          {formatPrice(amount)}
        </span>
      )}
    </div>
  );
}

