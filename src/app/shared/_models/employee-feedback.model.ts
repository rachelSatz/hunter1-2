import { EmployeePayment } from './employee-payment.model';

export class EmployeeFeedback extends EmployeePayment {
  name: string;
  personal_id;
  payment_month;
  deposit_month;
  salary;
  company_name;
  product_type;
  product_code;
  manual_status: string;
  sum;
}

export enum Status {
  not_sent = 'לא שודר',
  sent = 'שודר',
  fully_defrayed = 'נפרע במלאו',
  not_defrayed = 'לא נפרע'
}

export enum ManualStatus {
  None = 'ללא סטטוס',
  fully_defrayed_manual = 'נפרע במלואו ידנית',
  fully_defrayed_no_errors = 'נפרע במלואו ללא שגיאות',
  no_relevant = 'לא רלונטי',
  in_treatment = 'בטיפול'
}

export enum ApplicationStatusLabel {
  other = 'נשלח',
  notPaid = 'פתוח',
  partialyPaid = 'ממתין לטיפול',
  inProcess = 'הסתיים',
  fullyPaidNoErrors = 'נפרע במלואו ללא שגיאות',
  menualyFullyPaid = 'נפרע במלואו ידנית',
  retransmit = 'לשדר מחדש',
  check = 'לבדיקת מתפעל',
  irrelevant = 'קובץ לא רלוונטי',
}



