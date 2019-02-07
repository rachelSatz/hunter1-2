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

export enum PAYMENT_TERMS {
  manual = 'מיידי',
  net = 'שוטף',
  net15 = 'שוטף+15',
  net30 = 'שוטף+30',
  net45 = 'שוטף+45',
  net60 = 'שוטף+60',
  net75 = 'שוטף+75',
  net90 = 'שוטף+90',
  net120 = 'שוטף+120',
  masav = 'מסב זיכויים',
}
export enum PAYMENT_METHOD {
  unknown = 'לא ידוע',
  direct_debit = 'הןראת קבע',
  credit_card = 'כרטיס אשראי',
  bank_transfer = 'העברה בנקאית',
  check = 'צ"ק',
  masbaProduct = 'מסב',
}
export enum TAX {
  before = 'לא כולל',
  included = 'כולל',
  free = 'ללא',
}
export enum CURRENCY {
  ils = 'שקל',
}
export enum LANGUAGE {
  he = 'עברית',
}
