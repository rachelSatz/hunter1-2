import {Compensation} from './compensation.model';
import {Employer} from './employer.model';

export class PlanTask {
  id: number;
  company: string;
  organization_name: string;
  employer_name: string;
  task: Task;
  type: Select;
  department: Select;
  employer: Select;
  organization: Select;

  constructor() {
    this.id = 0;
    this.task = new Task();
  }
}

export class Select {
  id: number;
  name: string;
}


export class Task {
  id: number;
  message: string;
  additional_info: string;
  last_process: string;
  record: Record;
  file: File;
  process: Process;
  compensation: Compensation;
  employer: Employer;
}

export class Record {
  id: number;
  salary_month: string;
  updated_at: string;
  deposit_type: string;
  deposit_status: string;
  salary: number;
  employee_status: string;
  employee_status_start_date: string;
  work_month_percentage: number;
  is_relevant: boolean;
  policy_or_account_number: string;
  working_days_in_month: number;

}

export class File {
  id: number;
  file_type: string;
  amount: number;
  process_id: number;
}

export class Process {
  id: number;
  name: string;
  date: string;
  error_details: string;
  total: number;
  type: string;
  status: string;
}

export class ReportsData {
  organization_count: number;
  employers_count: number;
  employees_count: number;
  file_feedback_a_failed: number;
  file_not_defrayed: number;
  file_partially_paid: number;
  file_fully_defrayed: number;
  mtb_defrayed: number;
  mtb_not_defrayed: number;
  requests_company_file: number;
  requests_employer_file: number;
  requests_my_hr_file: number;
  requests_company_mtb: number;
  requests_employer_mtb: number;
  requests_my_hr_mtb: number;
  requests_company_com_er: number;
  requests_employer_com_er: number;
  requests_my_hr_com_er: number;
  requests_company_com_ee: number;
  requests_employer_com_ee: number;
  requests_my_hr_com_ee: number;
  feedback_a_failed: number;
  feedback_failed: number;
  feedback_a: number;
  feedback_a_unanswered: number;
  feedback: number;
  feedback_unanswered: number;
}



