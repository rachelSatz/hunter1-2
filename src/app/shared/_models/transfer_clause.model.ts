
export class TransferClause {
  id: number;
  clause_type: string;
  transfer_sum: number;
  // exempt: number;
  percent: number;
  expected_sum: number;
  expected_percent: number;
  salary_calculated: number;
  policy_or_account_number: string;

  constructor() {

  }

}

export enum ClauseType {
  compensation = 'פיצויים',
  employee_benefits = 'תגמולי עובד',
  employer_benefits = 'תגמולי מעביד',
  self_employeed_benefits = 'תגמולים47',
  ipi_employee = ' א.כ.ע עובד',
  ipi_employer = 'א.כ.ע מעביד',
  other_employee = 'שונות עובד',
  other_employer = 'שונות מעביד',
}

export enum  FeedBackStatus {
  record_received = 'רשומה נקלטה',
  record_processing_manufacture = 'רשומה בטיפול יצרן',
  record_transferred_employer = 'רשומה הועברה לטיפול מעסיק'
}
