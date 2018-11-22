import {EmployerFinancialDetails} from './employer-financial-details.model';

export class Invoice {
  employer_financial_details: EmployerFinancialDetails;
  green_invoice_number: string;
  total_amount: string;
  ids_count: string;
  for_month: string;
  created_at: string;
  last_payment_date: string;
  kind: string;
  type: string;
  status: string;
  green_invoice: object;
}

export enum InvoiceTypes {
    Proactive= 'יזום',
    Manual= 'ידני',
    Retainer= 'ריטנייר',
}
export enum STATUS {
  WaitingForPayment = 'ממתין לתשלום',
  Paid = 'שולם',
  Canceled = 'בוטל',
  GreenInvoiceStatus = 'נשלח לחשבונית ירוקה',
  GreenInvoiceErrorStatus = 'לא נשלח לחשבונית ירוקה',
}

export enum ERROR_STATUS {
  NumEmployeesMax = 'מספר עובדים גבוה',
  NumEmployeeMin = 'מספר עובדים נמוך',
  NoPayment = 'אין פרטי תשלום',
  PartialPayment = 'פרטי תשלום חלקיים',
}

