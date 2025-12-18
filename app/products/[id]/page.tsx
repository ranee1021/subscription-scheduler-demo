"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "../../../src/domain/product/types";
import Link from "next/link";
import { DeliverySchedule, DeliveryFrequency } from "../../../src/domain/schedule/types";
import { generateDeliverySchedules } from "../../../src/domain/schedule/generateSchedule";
import { PaymentAttempt, generatePaymentAttempts } from "../../../src/domain/payment/generatePayment";

type PeriodOption = "1주" | "2주" | "4주";
type Step = 1 | 2 | 3 | 4;

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  
  // 주문 옵션 상태
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>("1주");
  const [deliveryFrequency, setDeliveryFrequency] = useState<DeliveryFrequency>("주3회");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        const response = await fetch(`/api/products/${productId}`);
        const result = await response.json();
        if (result.success) {
          // Date 객체 복원
          setProduct({
            ...result.data,
            createdAt: new Date(result.data.createdAt),
          });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("상품 정보 로드 실패:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // URL 파라미터 확인하여 바텀 시트 자동 열기
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const openBottomSheet = urlParams.get("openBottomSheet");
      const step = urlParams.get("step");
      const period = urlParams.get("period") as PeriodOption | null;
      const frequency = urlParams.get("frequency") as DeliveryFrequency | null;
      const firstDeliveryDate = urlParams.get("firstDeliveryDate");

      if (openBottomSheet === "true") {
        setIsBottomSheetOpen(true);
        
        // 스텝 설정
        if (step) {
          const stepNum = parseInt(step);
          if (stepNum >= 1 && stepNum <= 4) {
            setCurrentStep(stepNum as Step);
          }
        }

        // 주문 옵션 복원
        if (period) {
          setSelectedPeriod(period);
        }
        if (frequency) {
          setDeliveryFrequency(frequency);
        }
        if (firstDeliveryDate) {
          const date = new Date(firstDeliveryDate);
          setSelectedDate(date);
        }

        // URL에서 파라미터 제거 (히스토리 정리)
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("openBottomSheet");
        newUrl.searchParams.delete("step");
        newUrl.searchParams.delete("period");
        newUrl.searchParams.delete("frequency");
        newUrl.searchParams.delete("firstDeliveryDate");
        window.history.replaceState({}, "", newUrl.toString());
      }
    }
  }, [productId]);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("ko-KR");
  };

  // 기간 옵션 (상품에서 가져오기)
  const periodOptions = useMemo(() => {
    return product?.periodOptions || [];
  }, [product]);

  // 선택된 기간이 유효한지 확인하고 없으면 첫 번째 옵션으로 설정
  useEffect(() => {
    if (periodOptions.length > 0) {
      const isValidPeriod = periodOptions.some((opt) => opt.period === selectedPeriod);
      if (!isValidPeriod) {
        setSelectedPeriod(periodOptions[0].period);
      }
    }
  }, [periodOptions, selectedPeriod]);

  // 선택된 기간의 가격
  const selectedPrice = useMemo(() => {
    return periodOptions.find((opt) => opt.period === selectedPeriod)?.price || 0;
  }, [selectedPeriod, periodOptions]);

  // 1일 식단(2팩) 단가 계산
  const dailyPrice = useMemo(() => {
    const weeks = parseInt(selectedPeriod.replace("주", ""));
    return Math.round(selectedPrice / (weeks * 7));
  }, [selectedPeriod, selectedPrice]);

  // 날짜 포맷팅 (YYYY-MM-DD)
  const formatDateInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 날짜 포맷팅 (YYYY년 MM월 DD일)
  const formatDateKorean = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  // 날짜 비교 (년/월/일만)
  const isSameDate = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // 오늘 기준 6주차 날짜 배열 생성
  const getCalendarWeeks = (lastDeliveryDate: Date | null): Date[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayDayOfWeek = today.getDay();
    const daysToMonday = todayDayOfWeek === 0 ? -6 : 1 - todayDayOfWeek;
    
    const firstMonday = new Date(today);
    firstMonday.setDate(today.getDate() + daysToMonday);
    firstMonday.setHours(0, 0, 0, 0);
    
    let weeksToShow = 6;
    
    if (lastDeliveryDate) {
      const lastDeliveryDateOnly = new Date(lastDeliveryDate.getFullYear(), lastDeliveryDate.getMonth(), lastDeliveryDate.getDate());
      const lastDayOf6Weeks = new Date(firstMonday);
      lastDayOf6Weeks.setDate(firstMonday.getDate() + 41);
      
      if (lastDeliveryDateOnly > lastDayOf6Weeks) {
        const lastDeliveryDayOfWeek = lastDeliveryDateOnly.getDay();
        const daysToLastMonday = lastDeliveryDayOfWeek === 0 ? -6 : 1 - lastDeliveryDayOfWeek;
        const lastDeliveryMonday = new Date(lastDeliveryDateOnly);
        lastDeliveryMonday.setDate(lastDeliveryDateOnly.getDate() + daysToLastMonday);
        
        const daysDiff = Math.ceil((lastDeliveryMonday.getTime() - firstMonday.getTime()) / (1000 * 60 * 60 * 24));
        weeksToShow = Math.ceil(daysDiff / 7) + 1;
      }
    }
    
    const calendarDays: Date[] = [];
    const totalDays = weeksToShow * 7;
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(firstMonday);
      date.setDate(firstMonday.getDate() + i);
      calendarDays.push(date);
    }
    
    return calendarDays;
  };

  const weeks = parseInt(selectedPeriod.replace("주", ""));
  const schedules = selectedDate
    ? generateDeliverySchedules(selectedDate, weeks, deliveryFrequency)
    : [];
  const lastDeliveryDate =
    schedules.length > 0
      ? schedules[schedules.length - 1].originalDeliveryDate
      : null;
  const paymentAttempts = lastDeliveryDate
    ? generatePaymentAttempts(lastDeliveryDate)
    : [];

  const isDeliveryDate = (date: Date): boolean => {
    if (!selectedDate) return false;
    return schedules.some((schedule) =>
      isSameDate(schedule.originalDeliveryDate, date)
    );
  };

  const getDeliverySequence = (date: Date): number | null => {
    if (!selectedDate) return null;
    const schedule = schedules.find((s) =>
      isSameDate(s.originalDeliveryDate, date)
    );
    return schedule ? schedule.sequence : null;
  };

  const isDateSelectable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);
    minDate.setHours(0, 0, 0, 0);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 21);
    maxDate.setHours(23, 59, 59, 999);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getDay() === 0) return false;
    
    return checkDate >= minDate && checkDate <= maxDate;
  };

  const handleDateClick = (date: Date) => {
    if (isDateSelectable(date)) {
      setSelectedDate(date);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleOrderClick = () => {
    setIsBottomSheetOpen(true);
    setCurrentStep(1);
    // 초기화
    if (periodOptions.length > 0) {
      setSelectedPeriod(periodOptions[0].period);
    }
    setDeliveryFrequency("주3회");
    setSelectedDate(null);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setCurrentStep(1);
  };

  const handlePaymentClick = () => {
    // 주문 정보를 URL 파라미터로 전달하여 주문 페이지로 이동
    if (!selectedDate || schedules.length === 0) {
      alert("첫 배송일을 선택해주세요.");
      return;
    }

    const params = new URLSearchParams({
      productId: productId,
      step: "5",
      period: selectedPeriod,
      frequency: deliveryFrequency,
      firstDeliveryDate: formatDateInput(selectedDate),
    });

    router.push(`/orders/new?${params.toString()}`);
  };

  // 캘린더 렌더링
  const calendarDays = getCalendarWeeks(lastDeliveryDate);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const firstDayOfWeek = calendarDays.length > 0 ? calendarDays[0].getDay() : 0;
  
  const firstDeliveryDate = schedules.length > 0 ? schedules[0].originalDeliveryDate : null;
  const isFirstDeliveryDate = (date: Date): boolean => {
    return firstDeliveryDate ? isSameDate(date, firstDeliveryDate) : false;
  };
  const isLastDeliveryDate = (date: Date): boolean => {
    return lastDeliveryDate ? isSameDate(date, lastDeliveryDate) : false;
  };
  
  const isInDeliveryPeriod = (date: Date): boolean => {
    if (!firstDeliveryDate || !lastDeliveryDate) return false;
    
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const firstOnly = new Date(firstDeliveryDate.getFullYear(), firstDeliveryDate.getMonth(), firstDeliveryDate.getDate());
    const lastOnly = new Date(lastDeliveryDate.getFullYear(), lastDeliveryDate.getMonth(), lastDeliveryDate.getDate());
    
    return dateOnly >= firstOnly && dateOnly <= lastOnly;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            상품을 찾을 수 없습니다.
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/products"
              className="text-indigo-600 hover:text-indigo-700"
            >
              상품 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-sm text-gray-600 hover:text-gray-900"
          >
            ← 뒤로가기
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          {product.description && (
            <p className="mt-2 text-lg text-gray-600">{product.description}</p>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            이용기간 옵션
          </h2>
          <div className="space-y-3">
            {product.periodOptions.map((option) => (
              <div
                key={option.period}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <span className="text-base font-medium text-gray-700">
                  {option.period}
                </span>
                <span className="text-lg font-bold text-indigo-600">
                  {option.price.toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            상품 정보
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>상품 ID</span>
              <span className="font-medium text-gray-900">{product.id}</span>
            </div>
            <div className="flex justify-between">
              <span>등록일</span>
              <span className="font-medium text-gray-900">
                {formatDate(product.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* 주문하기 버튼 */}
        <div className="flex gap-3">
          <Link
            href="/products"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-base font-medium text-gray-700 transition hover:bg-gray-50"
          >
            목록으로
          </Link>
          <button
            onClick={handleOrderClick}
            className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-center text-base font-medium text-white transition hover:bg-indigo-700"
          >
            주문하기
          </button>
        </div>
      </div>

      {/* 바텀 시트 */}
      {isBottomSheetOpen && (
        <>
          {/* 오버레이 */}
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity"
            onClick={handleCloseBottomSheet}
          />
          
          {/* 바텀 시트 */}
          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-4xl rounded-t-2xl bg-white shadow-2xl transition-transform">
            {/* 드래그 핸들 */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1 w-12 rounded-full bg-gray-300" />
            </div>

            {/* 헤더 */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">주문 옵션 선택</h2>
                <button
                  onClick={handleCloseBottomSheet}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 스텝 인디케이터 */}
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
                          currentStep >= step ? "text-indigo-600" : "text-gray-500"
                        }`}
                      >
                        {step === 1 && "이용기간"}
                        {step === 2 && "배송주기"}
                        {step === 3 && "첫 배송일"}
                        {step === 4 && "요약"}
                      </span>
                    </div>
                    {step < 4 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 ${
                          currentStep > step ? "bg-indigo-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* 스텝별 컨텐츠 */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-6">
              {/* 1단계: 이용기간 선택 */}
              {currentStep === 1 && (
                <div>
                  <h3 className="mb-6 text-lg font-semibold text-gray-900">
                    이용기간을 선택해주세요
                  </h3>
                  <div className="mb-6">
                    <div className="grid grid-cols-3 gap-3">
                      {periodOptions.map((option) => (
                        <button
                          key={option.period}
                          type="button"
                          onClick={() => setSelectedPeriod(option.period)}
                          className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition ${
                            selectedPeriod === option.period
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <div>{option.period}</div>
                          <div className="mt-1 text-base">
                            {option.price.toLocaleString()}원
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                    <div>
                      <p className="text-xs text-gray-500">판매금액</p>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {selectedPrice.toLocaleString()}원
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">1일 식단(2팩) 단가</p>
                      <p className="mt-1 text-lg font-bold text-indigo-600">
                        {dailyPrice.toLocaleString()}원
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      다음
                    </button>
                  </div>
                </div>
              )}

              {/* 2단계: 배송 주기 선택 */}
              {currentStep === 2 && (
                <div>
                  <h3 className="mb-6 text-lg font-semibold text-gray-900">
                    배송 주기를 선택해주세요
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryFrequency("주3회")}
                      className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition ${
                        deliveryFrequency === "주3회"
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      주 3회
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryFrequency("매일배송")}
                      className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition ${
                        deliveryFrequency === "매일배송"
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      매일 배송(일요일 제외)
                    </button>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      이전
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      다음
                    </button>
                  </div>
                </div>
              )}

              {/* 3단계: 첫 배송일 선택 */}
              {currentStep === 3 && (
                <div>
                  <h3 className="mb-6 text-lg font-semibold text-gray-900">
                    첫 배송일을 선택하세요
                  </h3>

                  {/* Calendar */}
                  <div className="calendar">
                    {/* Week Days */}
                    <div className="mb-2 grid grid-cols-7 gap-1">
                      {weekDays.map((day) => (
                        <div
                          key={day}
                          className="py-2 text-center text-xs font-medium text-gray-500"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                      ))}
                      
                      {calendarDays.map((date, index) => {
                        const isSelected = selectedDate && isSameDate(selectedDate, date);
                        const isDelivery = isDeliveryDate(date);
                        const isToday = isSameDate(date, new Date());
                        const isSelectable = isDateSelectable(date);
                        const sequence = getDeliverySequence(date);
                        const isFirstDelivery = isFirstDeliveryDate(date);
                        const isLastDelivery = isLastDeliveryDate(date);
                        const inDeliveryPeriod = isInDeliveryPeriod(date);

                        let bgClass = "";
                        let cursorClass = "";
                        let borderClass = "";
                        
                        if (!isSelectable) {
                          bgClass = "text-gray-300";
                          cursorClass = "cursor-default";
                          borderClass = "";
                        } else if (isSelected) {
                          bgClass = "bg-indigo-600 text-white font-semibold";
                          cursorClass = "cursor-pointer";
                          borderClass = "";
                        } else if (isToday) {
                          bgClass = "bg-gray-100 text-gray-900 font-medium";
                          cursorClass = "cursor-pointer";
                          borderClass = "border border-dashed border-gray-300";
                        } else {
                          bgClass = "text-gray-700";
                          cursorClass = "cursor-pointer";
                          borderClass = "border border-dashed border-gray-300";
                        }

                        return (
                          <div key={index} className="relative">
                            {inDeliveryPeriod && (
                              <div className="absolute inset-0 bg-indigo-50/30 rounded-lg pointer-events-none" />
                            )}
                            
                            <button
                              type="button"
                              onClick={() => handleDateClick(date)}
                              disabled={!isSelectable}
                              className={`relative aspect-square w-full rounded-lg text-sm transition ${bgClass} ${cursorClass} ${borderClass} disabled:hover:bg-transparent disabled:opacity-60`}
                            >
                              <div>{date.getDate()}</div>
                              {isDelivery && sequence && (
                                <div className="absolute top-0.5 right-0.5 text-[10px] font-bold bg-indigo-200 text-indigo-800 rounded px-1">
                                  {sequence}차
                                </div>
                              )}
                            </button>
                            {isFirstDelivery && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10">
                                <div className="bg-indigo-600 text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                  식단 시작일
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-indigo-600"></div>
                              </div>
                            )}
                            {isLastDelivery && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10">
                                <div className="bg-indigo-600 text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                  식단 마지막 배송일
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-indigo-600"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-indigo-600" />
                        <span>선택된 첫 배송일</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded border border-dashed border-gray-300" />
                        <span>선택 가능 날짜</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-indigo-50/30 border border-indigo-200" />
                        <span>정기배송 기간</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      이전
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!selectedDate}
                      className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      다음
                    </button>
                  </div>
                </div>
              )}

              {/* 4단계: 배송 스케줄 및 결제 금액 요약 */}
              {currentStep === 4 && (
                <div>
                  <h3 className="mb-6 text-lg font-semibold text-gray-900">
                    배송 스케줄 및 결제 금액 요약
                  </h3>

                  {!selectedDate ? (
                    <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                      첫 배송일을 선택해주세요.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* 주문 요약 */}
                      <div className="rounded-lg bg-indigo-50 p-4">
                        <p className="text-sm font-medium text-indigo-900">
                          주문 요약
                        </p>
                        <p className="mt-1 text-sm text-indigo-700">
                          첫 배송일: {formatDateKorean(selectedDate)}
                        </p>
                        <p className="mt-1 text-sm text-indigo-700">
                          이용기간: {selectedPeriod} ({schedules.length}회 배송)
                        </p>
                        <p className="mt-1 text-sm text-indigo-700">
                          배송 주기: {deliveryFrequency}
                        </p>
                        <p className="mt-2 text-lg font-bold text-indigo-700">
                          주문 금액: {selectedPrice.toLocaleString()}원
                        </p>
                      </div>

                      {/* 마지막 배송예정일 표시 */}
                      {lastDeliveryDate && (
                        <div className="rounded-lg bg-gray-50 p-4">
                          <p className="text-sm font-medium text-gray-900">
                            마지막 배송예정일
                          </p>
                          <p className="mt-1 text-lg font-bold text-gray-700">
                            {formatDateKorean(lastDeliveryDate)}
                          </p>
                        </div>
                      )}

                      {/* 결제 시도일 */}
                      {paymentAttempts.length > 0 && (
                        <div>
                          <h4 className="mb-3 text-sm font-semibold text-gray-700">
                            결제 시도일 (마지막 배송예정일 기준)
                          </h4>
                          <div className="space-y-2">
                            {paymentAttempts.map((attempt) => (
                              <div
                                key={attempt.daysBefore}
                                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                              >
                                <span className="text-sm font-medium text-gray-700">
                                  D-{attempt.daysBefore}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {formatDateKorean(attempt.attemptDate)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 배송 스케줄 테이블 */}
                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-gray-700">
                          배송 스케줄 (총 {schedules.length}회)
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                  회차
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                  배송예정일
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                  생산기준일
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {schedules.map((schedule) => (
                                <tr
                                  key={schedule.sequence}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                                    {schedule.sequence}회차
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                    {formatDateKorean(schedule.originalDeliveryDate)}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                    {formatDateKorean(schedule.productionDate)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* 결제하기 버튼 */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handlePaymentClick}
                          disabled={!selectedDate || schedules.length === 0}
                          className={`w-full rounded-lg px-4 py-3 text-base font-semibold text-white transition ${
                            !selectedDate || schedules.length === 0
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          }`}
                        >
                          결제하기
                        </button>
                      </div>

                      {/* 네비게이션 버튼 */}
                      <div className="mt-4 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          이전
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

