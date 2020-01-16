import { TransferClause } from './transfer_clause.model';

export class MonthlyTransferBlock {
  id: number;
  first_name: string;
  last_name: string;
  personal_id: string;
  product_id: number;
  deposit_type: string;
  employer_product_code: number;
  employer_product_name: string;
  employer_product_type: string;
  company_name: string;
  product_code: number;
  employer_company_id: number;
  employee_status: string;
  inquiries: Object[];
  transfer_clause: TransferClause[];
  salary: number;
  working_days_in_month: number;
  work_month_percentage: number;
  employee_status_start_date: number;
  salary_month: string;
  exempt_sum:  number;
  deposit_status: string;
  sum_compensation: number;
  percent_compensation: number;
  sum_employee_benefits: number;
  sum_employer_benefits: number;
  sum_self_employeed_benefits: number;
  percent_employer_benefits: number;
  percent_employee_benefits: number;
  percent_self_employeed_benefits: number;
  percent_other_employer: number;
  sum_other_employer: number;
  percent_other_employee: number;
  sum_other_employee: number;
  sum_ipi_employer: number;
  amount: number;
  checked: false;
  company_id: number;
  defrayal_error: any;
  sent_file_name: string;
  group_thing_id: number;
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


export enum Types {
  compensation = 'פיצויים',
  employee_benefits = 'תשלום עובד',
  employer_benefits = 'תשלום מעסיק',
  self_employeed_benefits = 'תגמולים',
  ipi_employee = 'אכע עובד',
  ipi_employer = 'אכע מעסיק',
  other_employee = 'שונות עובד',
  other_employer = 'שונות מעסיק'
}

  export enum DefrayalError {
  The_record_cannot_have_transfer_clauses_with_the_given_employee_monthly_status = 'סטטוס עובד בחודש משכורת לא תקין',
  The_percentage_does_not_match_to_the_clause_type = 'האחוז אינו תואם לסוג הסעיף',
  The_percentage_is_greater_than_100_or_lesser_than_0 = 'האחוז צריך להיות גדול מ100 וקטן מ0',
  Study_fund_accepts_only_employee_or_employer_benefits = 'קרן השתלמות מקבלת רק הטבות עובד או מעביד',
  Provident_and_pension_funds_accept_only_employee_employer_or_self_employeed_benefits =
    'קופות גמל וקרנות פנסיה מקבלות רק הטבות לעובדים, למעביד או לעצמאים',
  self_employeed_clause_for_a_wage_worker = 'פטור עצמי לעובד שכיר',
  Found_exempt_amount_for_a_study_fund = 'נמצא סכום פטור לקרן השתלמות'

}



