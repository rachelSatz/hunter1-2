import { EmployerFinancialDetails } from './employer-financial-details.model';
import { GreenInvoiceDocument } from './GreenInvoiceDocument';


export class Invoice {
  id: number;
  employer_financial_details: EmployerFinancialDetails;
  total_amount: string;
  ids_count: string;
  for_month: string;
  created_at: string;
  last_payment_date: string;
  type: string;
  status: string;
  remark: string;
  is_valid: string;
  green_invoice_document: GreenInvoiceDocument;
  project_name: string;
  updated_at: string;
  payment_amount: number;
  tax_amount: number;
  department: string;
  comment: string;
  error: string;
  project: number;
  product_type: number;
}

export class ManualInvoice {
  employer_financial_details: EmployerFinancialDetails;
  for_month: string;
  tax_type: string;
  product_type: string;
  remark: string;
  total_payment_amount: string;
  invoice_details: ManualInvoiceDetails[] = [];

  constructor() {
    this.employer_financial_details = new EmployerFinancialDetails();
    this.invoice_details.push(new ManualInvoiceDetails());
    this.tax_type = 'before';
    this.remark = '';
  }
}

export class ManualInvoiceDetails {
  tax: string;
  tax_amount: number;
  description: string;
  ids_count: number;
  payment_amount: number;
  total_payment_amount: number;
  is_saved: boolean;
  constructor() {
    this.tax = 'before';
    this.is_saved = false;
  }
}


export class InvoiceDetails {
  ids_count: number;
  payment_type: string;
  payment_amount: number;
  total_amount: number;
  details: string;
  is_exceptional: boolean;
  for_month_process: string;
  tax: string;
  description: string;
  product_type: ProductRelation;
}
export class ProductRelation {
  product_type: string;
}
export enum PRODUCT_RELATION_ENUM {
  defrayal= 'סליקה',
  compensation= 'יתרות לפיצויים',
  compensation_9302= 'יתרות לפיצויים 9302',
  form_101 = '101',
  form_102 = '102',
  form_103 = '103',
}

export class InvoiceStatus {
  id: number;
  name: any;
}

export enum INVOICE_TYPES {
    proactive= 'יזום',
    manual= 'ידני',
    retainer= 'ריטנייר',
}

export enum ALL_STATUS {
  waiting_for_payment = 'ממתין לתשלום',
  paid = 'שולם',
  canceled = 'בוטל',
  green_invoice_valid = 'נשלח לחשבונית ירוקה',
  green_invoice_error = 'לא נשלח לחשבונית ירוקה',
  num_employees_max = 'מספר עובדים גבוה',
  num_employee_min = 'מספר עובדים נמוך',
  no_payment = 'אין פרטי תשלום',
  partial_payment = 'פרטי תשלום חלקיים',
}
export enum STATUS {
  waiting_for_payment = 'ממתין לתשלום',
  paid = 'שולם',
  canceled = 'בוטל',
  transaction_green_invoice = 'חשבון עסקה - חשבונית ירוקה',
  green_invoice_error = 'לא נשלח לחשבונית ירוקה',
  direct_debit = 'הוראת קבע',
  credit_card = 'כרטיס אשראי',
  tax_green_invoice = 'מס/קבלה - חשבונית ירוקה',
  only_tax_green_invoice = 'חשבונית מס - חשבונית ירוקה',
  manual = 'ידני',
  invoice_0 = 'חשבונית על 0'
}

export enum ERROR_STATUS {
  num_employees_max = 'מספר עובדים גבוה',
  num_employees_min = 'מספר עובדים נמוך',
  no_payment = 'אין פרטי תשלום',
  partial_payment = 'פרטי תשלום חלקיים',
}
export enum TYPES {
  proactive= 'יזומה',
  manual= 'ידנית',
  auto= 'אוטומטית',
}

export class InvoiceDetailsRemarks {
  ids_count: number;
  total_payment_amount: number;
  payment_type: string;
  payment_amount: number;
  remarks_finance_payment: RemarksFinancePayment[];
}

export class RemarksFinancePayment {
  finance_ids_count: number;
  finance_payment_amount: number;
  payment_type: string;
  product_type: string;

}





