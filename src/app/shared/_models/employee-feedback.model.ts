import { EmployeePayment } from './employee-payment.model';

export class EmployeeFeedback extends EmployeePayment {

  static statusLabel = new Map([
    [0, 'נפרע באופן חלקי'],
    [1, 'תקין'],
    [2, 'בטיפול'],
    [3, 'שגיאה'],
    [4, 'בעיה']]);

  static productTypeLabel = new Map ([
    [0, 'אחר'],
    [1, 'קרן פנסיה'],
    [2, 'קופת גמל'], [3, 'ביטוח מנהלים'],
    [4, 'ביטוח בריאות'], [5, 'פוליסת חיסכון טהור'],
    [6, 'פוליסת סיכון טהור']]);


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

export enum StatusLabel {
  other = 'אחר',
  notPaid = 'לא נפרע',
  partialyPaid = 'נפרע באופן חלקי',
  inProcess = 'בטיפול',
  fullyPaidNoErrors = 'נפרע במלואו ללא שגיאות',
  menualyFullyPaid = 'נפרע במלואו ידנית',
  retransmit = 'לשדר מחדש',
  check = 'לבדיקת מתפעל',
  Irrelevant = 'קובץ לא רלוונטי',

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
  Irrelevant = 'קובץ לא רלוונטי',

}









// import { Employee } from './employee.model';
// import {RecordStatus} from './record-status.model';
// import {Product} from "./product.model";
// import {Process} from "./process.model";
// import {ProductEmployer} from "./product-employer.model";
// import {EmployeePayment} from "./employee-payment.model";
//
// export class EmployeeFeedback extends EmployeePayment {
//
//   static statusLabel = new Map([[0, 'ללא מענה'], [1, 'תקין'], [2, 'בטיפול'], [3, 'שגיאה'], [4, 'בעיה']]);
//
//   static productTypeLabel = new Map ([[0, 'אחר'], [1, 'קרן פנסיה'], [2, 'קופת גמל'],
//     [3, 'ביטוח מנהלים'], [4, 'ביטוח בריאות'], [5, 'פוליסת חיסכון טהור'], [6, 'פוליסת סיכון טהור']]);
//   ApplicationUpdatedAt:string;
//   ApplicationCreatedAt:string;
//   IntApplicationsSubject:number;
//   ApplicationsSubject:string;
//   IntApplicationStatus:number;
//   ApplicationStatus:string;
//   status: number;
//   recordStatus: RecordStatus[];
//   treatmentFactor:string;
//   Applicationid:number;
//   inttreatmentFactor:number;
//   Comments:string;
//   getStatusLabels(label: string, type?: 'key' | 'value'): string {
//     //  if (type === 'key') {
//     //    return this.labels.status[label];
//     //  }
//     //
//     //  for (const i in this.labels.status) {
//     //    if (label === this.labels.status[i]) {
//     //      return i;
//     //    }
//     //  }
//
//     return "";
//
//   }
// }
