
export class DepositsReport {
  id: number;
  comments: string;
  status: string;
  username: string;
  employer_name: string;
  first_name: string;
  last_name: string;
  identifier: string;
  company_name: string;
  company_id: number;
  to_date: string;
  from_date: string;
  created_at: string;
  updated_at: string;
  sending_method: string;
  error_sent_failed: string;
  identifier_employee: string;

  constructor() {
    this.last_name = '';
    this.first_name = '';
  }
}



export enum Status {
  sent = 'נשלח',
  closed = 'סגור',
  failed = 'נכשל'
}
