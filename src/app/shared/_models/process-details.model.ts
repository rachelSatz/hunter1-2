import { Process } from './process.model';

export class ProcessDetails {
  // process: Process;
  // productNumber: number;
  // recordNumber: number;
  // paymentNumber: number;
  // paymentSum: number;
  // dateToPay:string;
  id: number;
  name: string;
  status: string;
  type: string;
  total: number;
  date: string;
  records_count: number;
  records_total: number;
  groups_count: number;
  department_name: string;
  employer_name: string;
  employer_business_number: string;
  percent: number;
  sent_status: string;

  constructor() {
    this.employer_name = '';
  }

}
