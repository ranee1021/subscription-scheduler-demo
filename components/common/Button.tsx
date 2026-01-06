"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export function Button({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = "rounded-lg px-6 py-2 text-sm font-medium transition";
  
  const variantClasses = {
    primary: disabled
      ? "bg-gray-300 text-white cursor-not-allowed"
      : "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: disabled
      ? "bg-gray-300 text-white cursor-not-allowed"
      : "bg-gray-600 text-white hover:bg-gray-700",
    outline: disabled
      ? "border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

