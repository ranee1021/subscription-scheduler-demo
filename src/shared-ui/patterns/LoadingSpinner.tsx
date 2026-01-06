"use client";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "로딩 중..." }: LoadingSpinnerProps) {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-sm text-gray-400">{message}</div>
    </div>
  );
}

