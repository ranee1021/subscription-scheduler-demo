"use client";

import React, { useState, useMemo } from "react";

interface DeliverySchedule {
  sequence: number;
  originalDeliveryDate: Date;
  productionDate: Date;
}

interface PaymentAttempt {
  daysBefore: number;
  attemptDate: Date;
}

type PeriodOption = "1주" | "2주" | "4주";
type DeliveryFrequency = "주3회" | "매일배송";

interface PeriodPrice {
  period: PeriodOption;
  price: number;
}

const PERIOD_OPTIONS: PeriodPrice[] = [
  { period: "1주", price: 65940 },
  { period: "2주", price: 120080 },
  { period: "4주", price: 244720 },
];

export default function NewOrderPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>("1주");
  const [deliveryFrequency, setDeliveryFrequency] = useState<DeliveryFrequency>("주3회");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 선택된 기간의 가격
  const selectedPrice = useMemo(() => {
    return PERIOD_OPTIONS.find((opt) => opt.period === selectedPeriod)?.price || 0;
  }, [selectedPeriod]);

  // 1일 식단(2팩) 단가 계산
  const dailyPrice = useMemo(() => {
    const weeks = parseInt(selectedPeriod.replace("주", ""));
    return Math.round(selectedPrice / (weeks * 7));
  }, [selectedPeriod, selectedPrice]);

  // 배송 스케줄 생성
  const generateDeliverySchedules = (
    startDate: Date,
    weeks: number,
    frequency: DeliveryFrequency
  ): DeliverySchedule[] => {
    const schedules: DeliverySchedule[] = [];
    const firstDate = new Date(startDate);
    let sequence = 1;

    if (frequency === "주3회") {
      // 주 3회 배송: 첫 배송일의 요일에 따라 패턴 결정
      // 1주 = 3회, 2주 = 6회, 4주 = 12회
      const totalDeliveries = weeks * 3;
      const firstDayOfWeek = firstDate.getDay();
      
      // 각 요일별 다음 배송일 패턴 정의
      // [1차는 첫 배송일, 2차와 3차의 상대적 날짜 오프셋]
      let patternOffsets: number[];
      
      switch (firstDayOfWeek) {
        case 1: // 월: 월-수-금 (같은 주)
          patternOffsets = [0, 2, 4]; // 월(0), 수(+2), 금(+4)
          break;
        case 2: // 화: 화-목-토 (같은 주)
          patternOffsets = [0, 2, 4]; // 화(0), 목(+2), 토(+4)
          break;
        case 3: // 수: 수-금-월(차주)
          patternOffsets = [0, 2, 5]; // 수(0), 금(+2), 다음주 월(+5)
          break;
        case 4: // 목: 목-토-화(차주)
          patternOffsets = [0, 2, 5]; // 목(0), 토(+2), 다음주 화(+5)
          break;
        case 5: // 금: 금-월(차주)-수(차주)
          patternOffsets = [0, 3, 5]; // 금(0), 다음주 월(+3), 다음주 수(+5)
          break;
        case 6: // 토: 토-화(차주)-목(차주)
          patternOffsets = [0, 3, 5]; // 토(0), 다음주 화(+3), 다음주 목(+5)
          break;
        default: // 일요일은 선택 불가
          patternOffsets = [0, 2, 4];
      }
      
      // 첫 배송일 추가 (1차)
      const firstProductionDate = new Date(firstDate);
      firstProductionDate.setDate(firstDate.getDate() - 1);
      schedules.push({
        sequence: sequence++,
        originalDeliveryDate: new Date(firstDate),
        productionDate: firstProductionDate,
      });
      
      // 2차와 3차 생성
      for (let i = 1; i < 3 && schedules.length < totalDeliveries; i++) {
        const deliveryDate = new Date(firstDate);
        deliveryDate.setDate(firstDate.getDate() + patternOffsets[i]);
        
        const productionDate = new Date(deliveryDate);
        productionDate.setDate(deliveryDate.getDate() - 1);
        
        schedules.push({
          sequence: sequence++,
          originalDeliveryDate: deliveryDate,
          productionDate: productionDate,
        });
      }
      
      // 나머지 주차들 생성 (2주, 4주인 경우)
      if (weeks > 1) {
        // 다음 주부터 시작
        const nextWeekStartDate = new Date(firstDate);
        nextWeekStartDate.setDate(firstDate.getDate() + 7);
        
        // 다음 주의 패턴 시작 요일 결정
        let nextWeekPatternStart: number;
        if (firstDayOfWeek === 1 || firstDayOfWeek === 3 || firstDayOfWeek === 5) {
          // 월-수-금 패턴
          nextWeekPatternStart = 1; // 월요일
        } else {
          // 화-목-토 패턴
          nextWeekPatternStart = 2; // 화요일
        }
        
        // 다음 주의 시작 날짜 계산
        const nextWeekStart = new Date(nextWeekStartDate);
        const nextWeekStartDayOfWeek = nextWeekStart.getDay();
        let daysToNextWeekStart = nextWeekStartDayOfWeek - nextWeekPatternStart;
        if (daysToNextWeekStart < 0) daysToNextWeekStart += 7;
        nextWeekStart.setDate(nextWeekStartDate.getDate() - daysToNextWeekStart);
        
        // 나머지 주차들 생성
        for (let week = 1; week < weeks; week++) {
          const weekPatternOffsets = nextWeekPatternStart === 1 ? [0, 2, 4] : [0, 2, 4]; // 월-수-금 또는 화-목-토
          
          weekPatternOffsets.forEach((offset) => {
            if (schedules.length >= totalDeliveries) {
              return;
            }
            
            const deliveryDate = new Date(nextWeekStart);
            deliveryDate.setDate(nextWeekStart.getDate() + (week - 1) * 7 + offset);
            
            const productionDate = new Date(deliveryDate);
            productionDate.setDate(deliveryDate.getDate() - 1);
            
            schedules.push({
              sequence: sequence++,
              originalDeliveryDate: deliveryDate,
              productionDate: productionDate,
            });
          });
        }
      }
    } else {
      // 매일 배송 (일요일 제외)
      const totalDays = weeks * 7;
      for (let day = 0; day < totalDays; day++) {
        const deliveryDate = new Date(firstDate);
        deliveryDate.setDate(firstDate.getDate() + day);
        
        // 일요일(0)은 제외
        if (deliveryDate.getDay() !== 0) {
          const productionDate = new Date(deliveryDate);
          productionDate.setDate(deliveryDate.getDate() - 1);
          
          schedules.push({
            sequence: sequence++,
            originalDeliveryDate: deliveryDate,
            productionDate: productionDate,
          });
        }
      }
    }

    return schedules;
  };

  // 결제 시도일 생성 (마지막 배송예정일 기준 D-7, D-6, D-5, D-4)
  const generatePaymentAttempts = (
    lastDeliveryDate: Date
  ): PaymentAttempt[] => {
    const attempts: PaymentAttempt[] = [];
    for (let daysBefore = 7; daysBefore >= 4; daysBefore--) {
      const attemptDate = new Date(lastDeliveryDate);
      attemptDate.setDate(lastDeliveryDate.getDate() - daysBefore);
      attempts.push({
        daysBefore,
        attemptDate,
      });
    }
    return attempts;
  };

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
          <div className="mb-6">
            <p className="text-xl font-bold text-gray-900">옴뇸뇸 중기</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이용기간 선택
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PERIOD_OPTIONS.map((option) => (
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

                  return (
                    <div key={index} className="relative">
                      <button
                        type="button"
                        onClick={() => handleDateClick(date)}
                        disabled={!isSelectable}
                        className={`aspect-square w-full rounded-lg text-sm transition ${
                          !isSelectable
                            ? "text-gray-300 cursor-not-allowed"
                            : isSelected
                            ? "bg-indigo-600 text-white font-semibold"
                            : isDelivery
                            ? "bg-indigo-100 text-indigo-700 font-medium"
                            : isToday
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
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
                  <div className="h-4 w-4 rounded bg-indigo-100" />
                  <span>배송 예정일</span>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

