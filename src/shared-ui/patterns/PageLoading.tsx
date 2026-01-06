"use client";

import { LoadingSpinner } from "./LoadingSpinner";

interface PageLoadingProps {
  maxWidth?: string;
  message?: string;
}

export function PageLoading({ maxWidth = "max-w-7xl", message }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className={`mx-auto ${maxWidth}`}>
        <LoadingSpinner message={message} />
      </div>
    </div>
  );
}

