import {Employer} from './employer.model';

export class EmployerFinancialDetails {
  id: number;
  employer: Employer;
  pay_employer: Employer;
  financial_product: EmployerFinancialProduct[];
  invoice_employer_name: string;
  currency: string;
  language: string;
  payment_terms: string;
  payment_method: string;
  tax: string;
  green_invoice_id: string;
  green_invoice_email: string;
  direct_debit_commission: string;
}

export class EmployerFinancialProduct {
  id: number;
  product_type: string;
  is_zero: string;
  show_details: string;
  additional_payment_amount: string;
  additional_payment_desc: string;
  financial_payments: EmployerFinancialPayments[];
}

export class EmployerFinancialPayments {
  payment_type: string;
  payment_amount: string;
  ids_count: string;
}
