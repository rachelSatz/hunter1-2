import {UserUnitPermission} from './user-unit-permission.model';

export class Compensation {
  id: number;
  projected_balance: number;
  reported_balance: number;
  comments: string;
  closed_at: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  employer_id: string;
  portal_balance: number;
  has_by_safebox: boolean;
  has_file_inquiry: boolean;
  files: File[] = [];
  code_error: string;
  detail_error: string;

  constructor() {
    this.files.push(new File());
  }
}

export class File {
  file_name: string;
  file_type: string;
  file_date: string;
}

export enum CompensationStatus {
  'open' = 'פתוח',
  'sent' = 'נשלח',
  'feedback_a' = 'התקבל פידבק א',
  'feedback_b' = 'התקבל פידבק ב',
  'closed' = 'סגור'
}

export enum CompensationSendingMethods {
  'email' = 'מייל',
  'safebox' = 'כספת'
}

export enum ValidityMethods {
  'valid' = 'תקין',
  'unValid' = 'לא תקין'
}

// export enum ResponseTimesMethods {
//   '0-2' = 2,
//   '2-4' = 4,
//   '5+' = 5
// }

