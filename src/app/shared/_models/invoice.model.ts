import {EmployerFinancialDetails} from './employer-financial-details.model';
import {GreenInvoiceDocument} from './GreenInvoiceDocument';

export class Invoice {
  id: number;
  employer_financial_details: EmployerFinancialDetails;
  green_invoice_document: GreenInvoiceDocument;
  total_amount: string;
  ids_count: string;
  for_month: string;
  created_at: string;
  last_payment_date: string;
  kind: string;
  type: string;
  status: string;
  remark: string;
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
  green_invoice_valid = 'נשלח לחשבונית ירוקה',
  green_invoice_error = 'לא נשלח לחשבונית ירוקה',
}

export enum ERROR_STATUS {
  num_employees_max = 'מספר עובדים גבוה',
  num_employee_min = 'מספר עובדים נמוך',
  no_payment = 'אין פרטי תשלום',
  partial_payment = 'פרטי תשלום חלקיים',
}



