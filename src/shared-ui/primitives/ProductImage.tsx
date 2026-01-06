"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  src: string | undefined;
  alt: string;
  fallback?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

export function ProductImage({
  src,
  alt,
  fallback = "/window.svg",
  className,
  fill,
  width,
  height,
  sizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
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
          sizes={sizes}
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
        sizes={sizes}
      />
    </div>
  );
}

