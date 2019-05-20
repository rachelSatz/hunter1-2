import {Employer} from './employer.model';

export class EmployerFinancialDetails {
  id: number;
  employer: Employer;
  pay_employer: Employer;
  financial_product: EmployerFinancialProduct[] = [];
  invoice_employer_name: string;
  currency: string;
  language: string;
  payment_terms: string;
  payment_method: string;
  payment_time: string;
  payment_time_validity: string;
  payment_due_date: string;
  tax: string;
  green_invoice_id: string;
  green_invoice_email: string;
  direct_debit_commission: string;
  est_payment_type: string;
  est_payment_amount: number;
  est_ids_count: number;
  est_invoice_id: string;

  constructor() {
      this.id = 0;
      this.employer = new Employer();
      this.pay_employer = new Employer();
      this.financial_product.push(new EmployerFinancialProduct());
  }
}

export class EmployerFinancialProduct {
  id: number;
  product_type: string;
  is_zero: string;
  show_details: string;
  additional_payment_amount: number;
  additional_payment_desc: string;
  financial_payments: EmployerFinancialPayments[] = [];

  constructor() {
    this.financial_payments.push(new EmployerFinancialPayments());
  }
}

export class EmployerFinancialPayments {
  id: number;
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
  direct_debit = 'הוראת קבע',
  credit_card = 'כרטיס אשראי',
  bank_transfer = 'העברה בנקאית',
  check = 'צ"ק',
  masbaProduct = 'מסב',
}
export enum TAX {
  before = 'לא כולל',
  included = 'כולל'
}
export enum CURRENCY {
  ils = 'שקל',
}
export enum LANGUAGE {
  he = 'עברית',
}

export enum PRODUCT_TYPES {
  defrayal = 'סליקה',
  compensation = 'יתרות לפיצויים',
  compensation_9302 = 'יתרות לפיצויים - דו"ח שנתי'
}

export enum PAYMENT_TYPE {
  no_payment = 'ללא פרטי תשלום',
  number_of_employees = 'מספר עובדים',
  fixed = 'חודשי קבוע',
  number_of_companies = 'מספר קופות'
}

export enum PAYMENT_TIME {
  no_payment = 'ללא חיוב',
  proactive = 'יזום',
  auto = 'אוטומטי'
}
export enum NO_PAYMENT_TIME {
  no_due_date = 'לתמיד',
  month = 'בחירת חודש'
}
