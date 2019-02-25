import { Inquiry } from './inquiry';
import { Comment } from './comment';
import { EmployerBankAccount } from './employer-bank-account.model';

export class FileFeedback {
  id: number;
  updated_at: Date;
  amount: number;
  employer_name: string;
  product_name: string;
  product_code: string;
  product_type: string;
  company_name: string;
  status: string;
  error_code: string;
  error_details: string;
  file_name: string;
  process_name: string;
  date: string;
  product_bank_account: EmployerBankAccount;
  inquiries: Inquiry;
  comments: Comment;
  group_thing_feedback: GroupThingFeedback;
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
