
export class TransferClause {
  id: number;
  clause_type: string;
  transfer_sum: string;
  transfer_percent: string;
  exempt_sum: string;
  predicted_sum: number;
  predicted_percent: string;
  previous_guid: string;
  comments: string;
  guid: string;
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

export enum  FeedBackStatus{
  record_received = 'רשומה נקלטה',
  record_processing_manufacture = 'רשומה בטיפול יצרן',
  record_transferred_employer = 'רשומה הועברה לטיפול מעסיק'
}
