import {ContactType} from './contactType.model';

export class Contact {
  id: number;
  entity_type: any;
  entity_id: number;
  entity_name: string;
  type: any;
  product_type: string;
  first_name: string;
  last_name: string;
  phone: string;
  mobile: string;
  email: string;
  role: string;
  employer_id: number;
  organization_id: number;
  comment: string;
  employer_contact_id: number;
  types_details: ContactType[] = [];
}

export enum EntityTypes {
  // agent = 'סוכן',
  company = 'חברה מנהלת',
  employer = 'מעסיק',
  user = 'לשכת שרות',
}

export enum Type {
  deposits_report = 'דוח הפקדות',
  payments_instructions = 'קבלת מסב',
  pending = 'שיוך כספים',
  compensation = 'יתרות לפיצויים',
  employee_repayment = 'בקשה לפירעון עובד',
  file_repayment = 'בקשה לפירעון קובץ'
}

