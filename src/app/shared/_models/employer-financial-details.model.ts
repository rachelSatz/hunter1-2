import { Employer } from './employer.model';
import { EmployerRelation } from './employrRelation';

export class EmployerFinancialDetails {
   id: number;
   employer_relation: Employer;
   pay_employer_relation: EmployerRelation;
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
   credit_card_last_digits: string;
   min_payment: string;
   is_masav: number;
   no_payment_comment: string;
   billing_number: string;
   agreement_start_date: Date;
   automatic_billing: boolean;

  constructor() {
      this.id = 0;
      this.employer_relation = new Employer();
      this.pay_employer_relation = new EmployerRelation();
      this.financial_product.push(new EmployerFinancialProduct());
  }
}

export class EmployerFinancialProduct {
  id: number;
  is_zero: boolean;
  show_details: boolean;
  additional_payment_amount: number;
  additional_payment_desc: string;
  exception_amount: number;
  created_at: Date;
  financial_details: number;
  product_relation: number;
  updated_at: Date;
  financial_payments: EmployerFinancialPayments[] = [];
  product_type: string;

  constructor() {
    this.financial_payments.push(new EmployerFinancialPayments());
  }
}

export class EmployerFinancialPayments {
  id: number;
  payment_type: string;
  payment_amount: string;
  ids_count: string;

  constructor() {
    this.payment_amount = '1';
    this.ids_count = '1';
  }
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
