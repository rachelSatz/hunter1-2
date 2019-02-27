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
  sum;
}

export enum Status {
  sent = 'שודר',
  fully_paid = 'נפרע במלאו',
  paid_failed = 'לא נפרע'
}

export enum StatusManual {
  fully_paid_manual = 'נפרע במלאו ידני'
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



