import { Employer } from './employer.model';
import { ProcessDetails } from './process-details.model';

export class Process {

  name: string;
  id: number;
  employer_name: string;
  department_name: string;
  employer: Employer;
  month;
  year;
  totalPaymentFile?: number;
  codeFile: number ;
  details: ProcessDetails;
  stepStatus: StepStatus;
  fileName: string;
  total: string;
  processKind: number;
  errorMessage: string;
  KodSochnut: number;
  pay: boolean;
  HaveDatevalue: boolean;
  HaveNegativeProcess: boolean;
  NegativeProcess: boolean;
  status: string;
  type: string;
  isDirect: boolean;
  file;
  processID: number;
  departmentId;

constructor() {
    this.employer = new Employer();
    this.codeFile = 0;
  }
}

export class ViewProcess {
  file_id: number;
  company_name: string;
  employer_products: EmployerProduct;
  product_type: string;
  product_code: string;
  payment_identifier: string;
  payment_additional_info: PaymentAdditionalInfo;
  payment_date: string;
  file_total: number;
  group_id: number;
  status: string;
  payment_ref_number: string;
  group_thing_sum: string;
}

export class EmployerProduct {
  code: string;
  name: string;
}

export class PaymentAdditionalInfo {
  id: number;
  account_number: string;
  branch_number: string;
  bank_number: string;
  is_primary: boolean;
}

export enum StepStatus {
  error = -1,
  transmitted = 0,
  partiallyTransmitted = 1,
  notTransmitted = 2,
  Loading= 3,
}

export enum ValidityStatus {
  Invalid_file = -1,
  Waiting_for_treatment = 0,
  Collection = 1,
  Finish = 2,
  problem = 3,
  Error = 4,
  NotRelevant = 5,
}

export enum ProcessStatus {
  Loading = 'בטעינה',
  Processing = 'מעבד',
  Processed = 'מעובד',
  Sent = 'שודר',
  Feedbacked_Once = 'פידבק ראשון' ,
  Finished = 'הסתיים'  ,
  Error_Loading = 'שגיאת טעינה',
  Error_Sending = 'שגיאת שליחה',
}

export enum ProcessType {
  Employer_Payment = 'תשלומי מעסיק',
  Regular_Fix = 'תיקון סוג 2',
  Positive_Negative_Fix = 'תיקון 6+1',
  Direct_Employer = 'ישיר',
  Manual_Payment = 'פידבק ראשון' ,
}

export enum PaymentType {
  Bank_Transfer = 'העברה בנקאית',
  Check = 'צק',
  Direct_Debit = 'הוראת קבע',
  Masav = 'מס"ב',
}
