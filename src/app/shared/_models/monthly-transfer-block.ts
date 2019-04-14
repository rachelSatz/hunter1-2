import { TransferClause } from './transfer_clause.model';

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
  employee_status: string;
  // payment_month: string;
  inquiries: Object[];
  transfer_clause: TransferClause[];
  salary: number;
  salary_month: string;
  deposit_status: string;
  sum_compensation: number;
  sum_employee_benefits: number;
  sum_employer_benefits: number;
  sum_ipi_employer: number;
  amount: number;
  checked: false;
}


export enum DepositType {
  regular = 'שוטף',
  singular = 'חד פעמי',
  convalescence = 'דמי הבראה',
  differences = 'הפרשים',
  overtime= 'שעות נוספות',
}

export enum EmployeeStatus {
  monthly = 'חודשי/רגיל',
  daily = ' שעתי/יומי',
  lacks_payment = 'היעדר שכר',
  seasonal  = 'עונתי',
  contract_ended = 'עזיבת עבודה',
  unpaid_lOA = 'חופשה ללא תשלום',
  death = 'פטירה',
  provident_fund_changed = ' עובד החל להפקיד בקופה אחרת',
  department_changed = 'מעבר ממשרד למשרד',
  retired = 'פרישה לפנסיה',
  other = 'אחר',
  new_employee = 'עובד חדש'
}




export enum DepositStatus {
  wage_worker = 'שכיר',
  self_employeed = 'עצמאי',
  share_holder = 'בעל מניות'
}


