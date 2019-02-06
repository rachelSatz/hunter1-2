export class MonthlyTransferBlock {
  id: number;
  first_name: string;
  last_name: string;
  personal_id: string;
  deposit_type: string;
  employer_product_code: number;
  employer_product_name: string;
  employer_product_type: string;
  product_code: number;
  // payment_month: string;
  salary: number;
  salary_month: string;
  deposit_status: string;
  sum_compensation: number;
  sum_employee_benefits: number;
  sum_employer_benefits: number;
  sum_ipi_employer: number;
  amount: number;
}


export enum DepositType {
  Regular = 'שוטף',
  Singular = 'חד פעמי',
  Convalescence = 'דמי הבראה',
  Differences = 'הפרשים',
  Overtime= 'שעות נוספות',
}



export enum DepositStatus {
  Wage_Worker = 'שכיר',
  Self_Employeed = 'עצמאי',
  Share_Holder = 'בעל מניות'
}


