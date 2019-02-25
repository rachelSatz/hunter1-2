export class Contact {
  id: number;
  entity_id: number;
  entity_name: string;
  type: EntityTypes;
  first_name: string;
  last_name: string;
  phone: string;
  mobile: string;
  email: string;
  role: string;
  employer_id: number;
  comment: string;
}

export enum EntityTypes {
  agent = 'סוכן',
  company = 'חברה מנהלת',
  employer = 'מעסיק'
}

export enum Type {
  deposits_report = 'דוח הפקדות',
  payments_instructions = 'קבלת מסב',
  pending = 'שיוך כספים',
  compensation = 'יתרות לפיצוים',
  employee_repayment = 'בקשה לפירעון עובד',
  file_repayment = 'בקשה לפירעון מעסיק'
}

