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
}



// export interface IContactResponse {
//   total: number;
//   results: Contact[];
// }


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
  compensation = 'יתרות לפיצוים',
  employee_repayment = 'בקשה לפירעון עובד',
  file_repayment = 'בקשה לפירעון קובץ'
}

