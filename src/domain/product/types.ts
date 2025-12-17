export interface Product {
  id: string;
  name: string;
  description?: string;
  periodOptions: PeriodOption[];
  createdAt: Date;
}

export interface PeriodOption {
  period: "1주" | "2주" | "4주";
  price: number;
}

