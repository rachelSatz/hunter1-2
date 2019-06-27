
export class ProcessDetails {
  id: number;
  name: string;
  status: string;
  type: string;
  total: number;
  date: string;
  records_count: number;
  groups_count: number;
  department_name: string;
  employer_name: string;
  employer_identifier: string;
  percent: number;
  sent_status: string;
  count: number;

  constructor() {
    this.employer_name = '';
  }

}
