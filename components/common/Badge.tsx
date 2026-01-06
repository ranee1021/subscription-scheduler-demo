"use client";

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

