import type { DeliverySchedule, DeliveryFrequency } from "../contracts";

/**
 * 배송 스케줄을 생성합니다.
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
    const totalDeliveries = weeks * 3;
    const firstDayOfWeek = firstDate.getDay();
    
    const allowedDays: number[] = 
      firstDayOfWeek === 1 || firstDayOfWeek === 3 || firstDayOfWeek === 5
        ? [1, 3, 5]
        : [2, 4, 6];
    
    let currentDate = new Date(firstDate);
    currentDate.setHours(0, 0, 0, 0);
    
    const addedDates = new Set<string>();
    
    while (schedules.length < totalDeliveries) {
      const dayOfWeek = currentDate.getDay();
      
      if (allowedDays.includes(dayOfWeek)) {
        const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
        
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
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } else {
    const totalDays = weeks * 7;
    for (let day = 0; day < totalDays; day++) {
      const deliveryDate = new Date(firstDate);
      deliveryDate.setDate(firstDate.getDate() + day);
      
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

