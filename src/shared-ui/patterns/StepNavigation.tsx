"use client";

import { Button } from "../primitives/Button";

interface StepNavigationProps {
  onPrevious?: () => void;
  onNext: () => void;
  showPrevious?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  previousLabel?: string;
}

export function StepNavigation({
  onPrevious,
  onNext,
  showPrevious = false,
  nextDisabled = false,
  nextLabel = "다음",
  previousLabel = "이전",
}: StepNavigationProps) {
  return (
    <div className="mt-8 flex justify-end gap-3">
      {showPrevious && onPrevious && (
        <Button variant="outline" onClick={onPrevious}>
          {previousLabel}
        </Button>
      )}
      <Button variant="primary" onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </Button>
    </div>
  );
}

