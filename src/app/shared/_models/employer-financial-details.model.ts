import {Employer} from './employer.model';

export class EmployerFinancialDetails {
  employer: Employer;
  pay_employer: Employer;
  pay_employer_masav: string;
  payment_type: string;
  payment_amount: number;
  ids_count: number;
  payment_terms: string;
  invoice_type: string;
  invoice_employer_name: string;
  tax: string;
  show_zero: boolean;
  show_details: boolean;
  invoice_digital_signed: boolean;
  date_first_send: Date;
  date_last_send: Date;
  payment_period: string;
  payment_method: string;
  green_invoice_id: string;
  green_invoice_email: string;
  remark: string;
  direct_debit_commission: string;
  additional_payment_amount: string;
  additional_payment_desc: string;
}
