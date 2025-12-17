"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DeliverySchedule, DeliveryFrequency } from "../../../src/domain/schedule/types";
import { generateDeliverySchedules } from "../../../src/domain/schedule/generateSchedule";
import { PaymentAttempt, generatePaymentAttempts } from "../../../src/domain/payment/generatePayment";
import { Order } from "../../../src/domain/order/types";
import { Product } from "../../../src/domain/product/types";

type PeriodOption = "1주" | "2주" | "4주";

export default function NewOrderPage() {
  const router = useRouter();
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 클라이언트 사이드에서 URL 파라미터 읽기 및 상품 정보 로드
  useEffect(() => {
    const loadProduct = async () => {
      if (typeof window === "undefined") return;
      
      const params = new URLSearchParams(window.location.search);
      const id = params.get("productId");
      setProductId(id);
      
      try {
        let productData: Product | null = null;
        
        if (id) {
          // 특정 상품 조회
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          console.log("상품 상세 API 응답:", result);
          if (result.success && result.data) {
            productData = {
              ...result.data,
              createdAt: new Date(result.data.createdAt),
            };
          }
        } else {
          // 첫 번째 상품 조회
          const response = await fetch("/api/products");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          console.log("상품 목록 API 응답:", result);
          if (result.success && result.data && result.data.length > 0) {
            productData = {
              ...result.data[0],
              createdAt: new Date(result.data[0].createdAt),
            };
          }
        }
        
        setProduct(productData);
      } catch (error) {
        console.error("상품 정보 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
    
    // 주기적으로 URL 파라미터 확인 (다른 페이지에서 돌아올 때)
    const interval = setInterval(() => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("productId");
        if (id !== productId) {
          loadProduct();
        }
      }
    }, 500);
    
    return () => {
      clearInterval(interval);
    };
  }, [productId]);

  // 기간 옵션 (상품에서 가져오기)
  const periodOptions = useMemo(() => {
    return product?.periodOptions || [];
  }, [product]);

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>(
    periodOptions.length > 0 ? periodOptions[0].period : "1주"
  );
  const [deliveryFrequency, setDeliveryFrequency] = useState<DeliveryFrequency>("주3회");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

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
  const formatDate = (date: Date): string => {
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

  // 오늘 기준 6주차 날짜 배열 생성 (마지막 배송일이 6주차 안에 없으면 추가 주차 표시)
  const getCalendarWeeks = (lastDeliveryDate: Date | null): Date[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 오늘이 포함된 주의 월요일 찾기
    const todayDayOfWeek = today.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
    const daysToMonday = todayDayOfWeek === 0 ? -6 : 1 - todayDayOfWeek; // 일요일이면 -6, 아니면 월요일까지의 차이
    
    const firstMonday = new Date(today);
    firstMonday.setDate(today.getDate() + daysToMonday);
    firstMonday.setHours(0, 0, 0, 0);
    
    // 기본 6주치 날짜 생성 (42일 = 6주 * 7일)
    let weeksToShow = 6;
    
    // 마지막 배송일이 6주차 안에 없으면 추가 주차 계산
    if (lastDeliveryDate) {
      const lastDeliveryDateOnly = new Date(lastDeliveryDate.getFullYear(), lastDeliveryDate.getMonth(), lastDeliveryDate.getDate());
      const lastDayOf6Weeks = new Date(firstMonday);
      lastDayOf6Weeks.setDate(firstMonday.getDate() + 41); // 6주차의 마지막 날 (42일째, 인덱스 41)
      
      // 마지막 배송일이 6주차를 넘어가면 추가 주차 계산
      if (lastDeliveryDateOnly > lastDayOf6Weeks) {
        // 마지막 배송일이 포함된 주의 월요일 찾기
        const lastDeliveryDayOfWeek = lastDeliveryDateOnly.getDay();
        const daysToLastMonday = lastDeliveryDayOfWeek === 0 ? -6 : 1 - lastDeliveryDayOfWeek;
        const lastDeliveryMonday = new Date(lastDeliveryDateOnly);
        lastDeliveryMonday.setDate(lastDeliveryDateOnly.getDate() + daysToLastMonday);
        
        // 필요한 주차 수 계산
        const daysDiff = Math.ceil((lastDeliveryMonday.getTime() - firstMonday.getTime()) / (1000 * 60 * 60 * 24));
        weeksToShow = Math.ceil(daysDiff / 7) + 1; // +1은 마지막 주차 포함
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

  const isDeliveryDate = (date: Date): boolean => {
    if (!selectedDate) return false;
    const weeks = parseInt(selectedPeriod.replace("주", ""));
    const schedules = generateDeliverySchedules(selectedDate, weeks, deliveryFrequency);
    return schedules.some((schedule) =>
      isSameDate(schedule.originalDeliveryDate, date)
    );
  };

  // 배송일의 차수(sequence) 가져오기
  const getDeliverySequence = (date: Date): number | null => {
    if (!selectedDate) return null;
    const weeks = parseInt(selectedPeriod.replace("주", ""));
    const schedules = generateDeliverySchedules(selectedDate, weeks, deliveryFrequency);
    const schedule = schedules.find((s) =>
      isSameDate(s.originalDeliveryDate, date)
    );
    return schedule ? schedule.sequence : null;
  };

  // 날짜 선택 가능 여부 확인 (오늘부터 2일 뒤부터, 이번주 포함 2주차까지만, 일요일 제외)
  const isDateSelectable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);
    minDate.setHours(0, 0, 0, 0);
    
    // 이번주 포함 2주차까지 (총 3주차) = 오늘부터 21일 후까지
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 21);
    maxDate.setHours(23, 59, 59, 999);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // 일요일(0)은 선택 불가
    if (checkDate.getDay() === 0) return false;
    
    // 오늘부터 2일 뒤부터, 이번주 포함 2주차까지만 선택 가능
    return checkDate >= minDate && checkDate <= maxDate;
  };

  const handleDateClick = (date: Date) => {
    // 선택 가능한 날짜인지 확인
    if (isDateSelectable(date)) {
      setSelectedDate(date);
    }
  };

  // 주문 생성 핸들러
  const handleCreateOrder = async () => {
    if (!selectedDate || schedules.length === 0) {
      alert("첫 배송일을 선택해주세요.");
      return;
    }

    // Order 객체 생성
    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      firstDeliveryDate: selectedDate,
      status: "ACTIVE",
      deliveryCount: schedules.length,
      deliveries: schedules,
      createdAt: new Date(),
    };

    try {
      // API를 통해 주문 저장
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });

      const result = await response.json();

      if (result.success) {
        // 생성된 주문 ID 저장
        setCreatedOrderId(newOrder.id);
        
        // 상태 초기화 (다음 주문을 위해)
        setSelectedDate(null);
        
        // 주문 완료 알럿 표시 후 주문 상세 페이지로 리다이렉트
        alert("주문이 완료되었습니다.");
        router.push(`/orders/${newOrder.id}`);
      } else {
        alert(`주문 생성 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("주문 생성 실패:", error);
      alert("주문 생성 중 오류가 발생했습니다.");
    }
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

  // 캘린더 렌더링
  const calendarDays = getCalendarWeeks(lastDeliveryDate);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  
  // 첫 번째 날짜의 요일 확인 (0=일요일, 1=월요일, ..., 6=토요일)
  const firstDayOfWeek = calendarDays.length > 0 ? calendarDays[0].getDay() : 0;
  
  // 첫 배송일과 마지막 배송일 확인
  const firstDeliveryDate = schedules.length > 0 ? schedules[0].originalDeliveryDate : null;
  const isFirstDeliveryDate = (date: Date): boolean => {
    return firstDeliveryDate ? isSameDate(date, firstDeliveryDate) : false;
  };
  const isLastDeliveryDate = (date: Date): boolean => {
    return lastDeliveryDate ? isSameDate(date, lastDeliveryDate) : false;
  };
  
  // 배송 기간 내 날짜인지 확인 (첫 배송일 ~ 마지막 배송일)
  const isInDeliveryPeriod = (date: Date): boolean => {
    if (!firstDeliveryDate || !lastDeliveryDate) return false;
    
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const firstOnly = new Date(firstDeliveryDate.getFullYear(), firstDeliveryDate.getMonth(), firstDeliveryDate.getDate());
    const lastOnly = new Date(lastDeliveryDate.getFullYear(), lastDeliveryDate.getMonth(), lastDeliveryDate.getDate());
    
    return dateOnly >= firstOnly && dateOnly <= lastOnly;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">새 주문 만들기</h1>
          <p className="mt-1 text-sm text-gray-500">
            상품과 이용기간을 선택하고 첫 배송일을 캘린더에서 선택하세요.
          </p>
        </div>

        {/* 상품 정보 및 이용기간 선택 */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            상품 정보
          </h2>
          {product ? (
            <>
              <div className="mb-6">
                <p className="text-xl font-bold text-gray-900">{product.name}</p>
                {product.description && (
                  <p className="mt-1 text-sm text-gray-600">{product.description}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이용기간 선택
                </label>
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
            </>
          ) : (
            <div className="mb-6 text-center text-gray-400">
              상품 정보를 불러올 수 없습니다.
            </div>
          )}

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

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배송 주기 선택
            </label>
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
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Calendar Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              첫 배송일 선택
            </h2>

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
                {/* 첫 번째 날짜 앞의 빈 셀들 (일요일부터 첫 번째 날짜까지) */}
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

                  // 배경색 및 스타일 결정 (우선순위: 선택된 날짜 > 오늘 > 기본)
                  // 배송예정일은 배경 없이 차수 레이블만 표시
                  let bgClass = "";
                  let cursorClass = "";
                  let borderClass = "";
                  
                  if (!isSelectable) {
                    // 선택 불가 날짜: 연한 회색 텍스트, hover 없음, default 커서, 낮은 대비, 점선 없음
                    bgClass = "text-gray-300";
                    cursorClass = "cursor-default";
                    borderClass = "";
                  } else if (isSelected) {
                    // 첫 배송일 선택 (최우선): 점선 테두리 없음
                    bgClass = "bg-indigo-600 text-white font-semibold";
                    cursorClass = "cursor-pointer";
                    borderClass = "";
                  } else if (isToday) {
                    // 오늘: 점선 테두리 적용
                    bgClass = "bg-gray-100 text-gray-900 font-medium";
                    cursorClass = "cursor-pointer";
                    borderClass = "border border-dashed border-gray-300";
                  } else {
                    // 선택 가능한 날짜: 기본 텍스트 색상, 항상 보이는 점선 테두리, pointer 커서
                    bgClass = "text-gray-700";
                    cursorClass = "cursor-pointer";
                    borderClass = "border border-dashed border-gray-300";
                  }

                  return (
                    <div key={index} className="relative">
                      {/* 배송 기간 배경 (가장 아래 레벨) */}
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
                            식단 종료일
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
          </div>

          {/* Right: Schedule Preview Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              배송 스케줄 및 결제 미리보기
            </h2>

            {!selectedDate ? (
              <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                첫 배송일을 선택하면 미리보기가 표시됩니다.
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
                    <h3 className="mb-3 text-sm font-semibold text-gray-700">
                      결제 시도일 (마지막 배송예정일 기준)
                    </h3>
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
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">
                    배송 스케줄 (총 {schedules.length}회)
                  </h3>
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

                {/* 주문 생성 버튼 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCreateOrder}
                    disabled={!selectedDate || schedules.length === 0}
                    className={`w-full rounded-lg px-4 py-3 text-base font-semibold text-white transition ${
                      !selectedDate || schedules.length === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    주문 생성
                  </button>
                  
                  {/* 주문 생성 성공 메시지 */}
                  {createdOrderId && (
                    <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">
                      <p className="text-sm font-medium text-green-800">
                        주문이 생성되었습니다!
                      </p>
                      <p className="mt-1 text-xs text-green-700">
                        주문 ID: {createdOrderId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

