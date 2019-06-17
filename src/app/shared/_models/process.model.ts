import { Employer } from './employer.model';
import { ProcessDetails } from './process-details.model';

export class Process {

  name = '';
  id: number;
  employer_name: string;
  department_name: string;
  employer: Employer;
  month;
  monthName;
  date: string;
  year;
  totalPaymentFile?: number;
  codeFile: number ;
  details: ProcessDetails;
  stepStatus: StepStatus;
  fileName: string;
  total: number;
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
  pageIndex;
  file;
  processID: number;
  departmentId;
  pageNumber;
  returnDetails;
  error_details: string;
  incorrect: boolean;
  highlightFileId: number;
  highlightRecordId: number;



  constructor() {
    this.employer = new Employer();
    this.codeFile = 0;
    this.type = 'positive';
    this.year = new Date().getFullYear();
    this.month = new Date().getMonth();
  }
}

export class ViewProcess {
  file_id: number;
  company_name: string;
  employer_products: EmployerProduct[];
  product_type: string;
  product_code: string;
  payment_identifier: string;
  payment_additional_info: PaymentAdditionalInfo;
  payment_date: string;
  file_total: number;
  group_id: number;
  status: string;
  status_sent: string;
  ref_path: string;
  payment_ref_number: string;
  group_thing_sum: string;
  paid_account_number: string;
  account_number: string;
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
  loading= 3,
}

export enum ValidityStatus {
  invalid_file = -1,
  waiting_for_treatment = 0,
  collection = 1,
  finish = 2,
  problem = 3,
  error = 4,
  notRelevant = 5,
}

export enum ProcessStatus {
  loading = 'בטעינה',
  can_be_processed = 'מעבד',
  done_processing = 'מעובד',
  transmitted = 'שודר',
  feedbacked_once = 'פידבק ראשון' ,
  finished = 'הסתיים'  ,
  error_loading = 'שגיאת טעינה',
  error_transmiting = 'שגיאת שליחה',
  loaded_with_errors = 'יש שגיאה בקובץ'
}

export enum ProcessType {
  employer_payment = 'תשלומי מעסיק',
  regular_fix = 'תיקון סוג 2',
  positive_negative_fix = 'תיקון 6+1',
  direct_employer = 'ישיר',
  manual_payment = 'ידני' ,
  unknown = 'אחר'

}

export enum PaymentType {
  bank_transfer = 'העברה בנקאית',
  check = 'צק',
  direct_debit = 'הוראת קבע',
  masav = 'מס"ב',
}

export enum FilesStatus {
  open = 'פתוח',
  sent = 'נשלח',
  feedback_a = 'התקבל פידבק א',
  feedback_b = 'התקבל פידבק ב',
  closed = 'סגור',
  not_relevant = 'לא רלוונטי'
}
