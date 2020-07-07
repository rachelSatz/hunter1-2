
export class ProcessDetails {
  id: number;
  name: string;
  status: string;
  type: string;
  total: number;
  date: string;
  records_count: number;
  mtbs_count: number;
  groups_count: number;
  department_name: string;
  employer_name: string;
  employer_id: number;
  employer_identifier: string;
  percent: number;
  sent_status: string;
  count: number;
  dep_id: number;
  is_deposition: boolean;
  error: string;
  is_allowed_transmission_product_auto: boolean;
  is_allowed_references_auto: boolean;
  error_details: string;

  constructor() {
    this.employer_name = '';
  }

}
