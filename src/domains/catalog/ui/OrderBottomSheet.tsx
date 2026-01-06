"use client";

import React from "react";
import { OrderStep1 } from "./OrderStep1";
import { OrderStep2 } from "./OrderStep2";
import { OrderStep3 } from "./OrderStep3";
import { OrderStep4 } from "./OrderStep4";
import type { useDeliveryCalendar, useProductOrderForm } from "../../subscription/usecases";

interface OrderBottomSheetProps {
  isOpen: boolean;
  isVisible: boolean;
  currentStep: 1 | 2 | 3 | 4;
  calendar: ReturnType<typeof useDeliveryCalendar>;
  orderForm: ReturnType<typeof useProductOrderForm>;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onDateClick: (date: Date) => void;
  onPaymentClick: () => void;
}

export function OrderBottomSheet({
  isOpen,
  isVisible,
  currentStep,
  calendar,
  orderForm,
  onClose,
  onNext,
  onPrevious,
  onDateClick,
  onPaymentClick,
}: OrderBottomSheetProps) {
  if (!isVisible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto max-w-4xl rounded-t-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">주문 옵션 선택</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      currentStep >= step
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStep >= step
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step === 1 && "기간"}
                    {step === 2 && "배송"}
                    {step === 3 && "날짜"}
                    {step === 4 && "확인"}
                  </span>
                </div>
                {step < 4 && (
                  <div
                    className={`mx-4 h-0.5 flex-1 ${
                      currentStep > step ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-6">
          {currentStep === 1 && (
            <OrderStep1
              periodOptions={orderForm.periodOptions}
              selectedPeriod={orderForm.selectedPeriod}
              selectedPrice={orderForm.selectedPrice}
              dailyPrice={orderForm.dailyPrice}
              onPeriodChange={orderForm.setSelectedPeriod}
              onNext={onNext}
              showPrevious={currentStep > 1}
              onPrevious={onPrevious}
            />
          )}
          {currentStep === 2 && (
            <OrderStep2
              deliveryFrequency={orderForm.deliveryFrequency}
              onFrequencyChange={orderForm.setDeliveryFrequency}
              onNext={onNext}
              showPrevious={currentStep > 1}
              onPrevious={onPrevious}
            />
          )}
          {currentStep === 3 && (
            <OrderStep3
              calendar={calendar}
              selectedDate={orderForm.selectedDate}
              onDateClick={onDateClick}
              onNext={onNext}
              showPrevious={currentStep > 1}
              onPrevious={onPrevious}
            />
          )}
          {currentStep === 4 && (
            <OrderStep4
              orderForm={orderForm}
              onPaymentClick={onPaymentClick}
              showPrevious={currentStep > 1}
              onPrevious={onPrevious}
            />
          )}
        </div>
      </div>
    </>
  );
}

