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
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
      // 주 3회 배송: 첫 배송일이 월요일이면 월-수-금, 화요일이면 화-목-토
      const firstDayOfWeek = firstDate.getDay();
      
      let pattern: number[]; // 요일 오프셋 (0=일요일, 1=월요일, ...)
      if (firstDayOfWeek === 1) {
        // 월요일: 월-수-금 (0, 2, 4)
        pattern = [0, 2, 4];
      } else if (firstDayOfWeek === 2) {
        // 화요일: 화-목-토 (0, 2, 4)
        pattern = [0, 2, 4];
      } else {
        // 다른 요일인 경우 (이론적으로는 발생하지 않아야 함)
        // 기본값으로 월-수-금 패턴 사용
        pattern = [0, 2, 4];
      }

      // 선택된 주수만큼 주 3회 배송
      for (let week = 0; week < weeks; week++) {
        pattern.forEach((offset) => {
          const deliveryDate = new Date(firstDate);
          deliveryDate.setDate(firstDate.getDate() + week * 7 + offset);
          const productionDate = new Date(deliveryDate);
          productionDate.setDate(deliveryDate.getDate() - 1);
          
          schedules.push({
            sequence: sequence++,
            originalDeliveryDate: deliveryDate,
            productionDate: productionDate,
          });
        });
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

  // 캘린더 관련 함수들
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
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

  // 날짜 선택 가능 여부 확인 (오늘부터 2일 뒤부터, 일요일 제외, 주 3회는 월/화만)
  const isDateSelectable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);
    minDate.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // 일요일(0)은 선택 불가
    if (checkDate.getDay() === 0) return false;
    
    // 주 3회 배송의 경우 월요일(1) 또는 화요일(2)만 선택 가능
    if (deliveryFrequency === "주3회") {
      const dayOfWeek = checkDate.getDay();
      if (dayOfWeek !== 1 && dayOfWeek !== 2) return false;
    }
    
    // 오늘부터 2일 뒤부터 선택 가능
    return checkDate >= minDate;
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    // 선택 가능한 날짜인지 확인
    if (isDateSelectable(newDate)) {
      setSelectedDate(newDate);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
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
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

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
              {/* Calendar Header */}
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goToPreviousMonth}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                </h3>
                <button
                  type="button"
                  onClick={goToNextMonth}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

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
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {days.map((day) => {
                  const date = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  );
                  const isSelected = selectedDate && isSameDate(selectedDate, date);
                  const isDelivery = isDeliveryDate(date);
                  const isToday = isSameDate(date, new Date());
                  const isSelectable = isDateSelectable(date);
                  const sequence = getDeliverySequence(date);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDateClick(day)}
                      disabled={!isSelectable}
                      className={`aspect-square rounded-lg text-sm transition relative ${
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
                      <div>{day}</div>
                      {isDelivery && sequence && (
                        <div className="absolute top-0.5 right-0.5 text-[10px] font-bold bg-indigo-200 text-indigo-800 rounded px-1">
                          {sequence}차
                        </div>
                      )}
                    </button>
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

