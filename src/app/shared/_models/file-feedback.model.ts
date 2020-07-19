import { Inquiry } from './inquiry';
import { Comment } from './comment';
import { EmployerBankAccount } from './employer-bank-account.model';
import { ManualStatus } from './employee-feedback.model';

export class FileFeedback {
  id: number;
  updated_at: Date;
  amount: number;
  employer_name: string;
  product_name: string;
  product_code: string;
  product_type: string;
  company_name: string;
  company_id: number;
  status: string;
  sent_date: string;
  error_code: string;
  error_details: string;
  file_name: string;
  process_name: string;
  date: string;
  product_bank_account: EmployerBankAccount;
  inquiries: Inquiry;
  comments: Comment;
  group_thing_feedback: GroupThingFeedback;
  feedback_a: string;
  manual_status: string;
  feedback_emp: string;
}

export class GroupThingFeedback {
  total_deposit_employer: number;
  total_deposit_manufacturer_account: number;
  total_money_employees_accounts: number;
  total_transferred_manufacturer: number;
  handling_status: number;
  status_handling_funds: string;
  id_number: string;
  validity_date: string;
  clearing_number: string;
}

export enum Status {
  not_sent = 'לא שודר',
  sent = 'שודר',
  sent_failed = 'שגיאת שידור',
  feedback_a =  'היזון ראשוני',
  feedback_a_failed = 'היזון ראשוני נכשל',
  partially_paid = 'נפרע חלקי',
  fully_paid = 'נפרע במלאו',
  paid_failed = 'לא נפרע'
}


export enum CodeError {
  '100 invalid_id_technical_level' = 'מספר ת.ז לא תקין ברמה הטכנית',
  '102 no_document_attached' = 'לא צורף מסמך/טופס',
  '105 other' = 'אחר',
  '110 no_initial_feedbackA' =  'לא התקבל היזון חוזר ראשוני (שלב א)',
  '111 no_manufacturer_response' = 'לא התקבלה תשובת יצרן (שלב ב)',
  '117 information_ 9201_not_received' = 'מידע מגוף מוסדי מסויים בגין פעולה 9201 לא התקבל החודש מיצרן',
  '118 Request_9201_close' = 'בקשה 9201 נסגרה באופן יזום על ידי המסלקה',
  '119 no_final_feedback_received' = 'לא התקבל היזון חוזר מסכם',
  '120 monthly_feedback_not_accepted' = 'לא התקבל היזון חוזר מסכם חודשי',
  '121 no_annual_summaries' = ' לא התקבל היזון חוזר מסכם שנתי',
  '122 request_for_deposit_intentionally_closed_by_clearing_house' = 'בקשת פקודוקציה נסגרה באופן יזום על ידי מסלקה',
  '123 no_retirement_report_received' =  'לא התקבל דוח גריעה',
  '124 product_request_information_not_received_from_supplier_month' = 'מידע בגין בקשת פרודוקציה לא התקבל החודש מיצרן',
  '125 different_conflicting_responses_received_same_manufacturer_request' = 'התקבלו תשובות סותרות ממוקדים שונים של אותו יצרן לבקשה',
  '126 no_weekly_feedback_received' = 'לא התקבל היזון חוזר מסכם שבועי'
}
