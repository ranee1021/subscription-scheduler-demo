import { DeliverySchedule, DeliveryFrequency } from "./types";

/**
 * 배송 스케줄을 생성합니다.
 * 
 * @param startDate 첫 배송일
 * @param weeks 이용 기간 (주 단위)
 * @param frequency 배송 주기 ("주3회" 또는 "매일배송")
 * @returns 배송 스케줄 배열
 */
export function generateDeliverySchedules(
  startDate: Date,
  weeks: number,
  frequency: DeliveryFrequency
): DeliverySchedule[] {
  const schedules: DeliverySchedule[] = [];
  const firstDate = new Date(startDate);
  let sequence = 1;

  if (frequency === "주3회") {
    // 주 3회 배송: 첫 배송일의 요일에 따라 패턴 결정
    // 1주 = 3회, 2주 = 6회, 4주 = 12회
    const totalDeliveries = weeks * 3;
    const firstDayOfWeek = firstDate.getDay();
    
    // 첫 배송일의 요일을 기준으로 요일 세트 결정
    // 월(1), 수(3), 금(5) → 월/수/금 세트
    // 화(2), 목(4), 토(6) → 화/목/토 세트
    const allowedDays: number[] = 
      firstDayOfWeek === 1 || firstDayOfWeek === 3 || firstDayOfWeek === 5
        ? [1, 3, 5] // 월/수/금 세트
        : [2, 4, 6]; // 화/목/토 세트
    
    // 첫 배송일부터 하루씩 증가시키면서 선택된 요일 세트에 해당하는 날짜만 순차적으로 채택
    let currentDate = new Date(firstDate);
    currentDate.setHours(0, 0, 0, 0);
    
    // 이미 추가된 날짜를 추적하여 중복 방지
    const addedDates = new Set<string>();
    
    while (schedules.length < totalDeliveries) {
      const dayOfWeek = currentDate.getDay();
      
      // 선택된 요일 세트에 해당하는 날짜인지 확인
      if (allowedDays.includes(dayOfWeek)) {
        // 날짜 문자열로 변환하여 중복 확인
        const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
        
        // 중복되지 않은 경우에만 추가
        if (!addedDates.has(dateKey)) {
          addedDates.add(dateKey);
          
          const productionDate = new Date(currentDate);
          productionDate.setDate(currentDate.getDate() - 1);
          
          schedules.push({
            sequence: sequence++,
            originalDeliveryDate: new Date(currentDate),
            productionDate: productionDate,
          });
        }
      }
      
      // 다음 날로 이동
      currentDate.setDate(currentDate.getDate() + 1);
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
}

