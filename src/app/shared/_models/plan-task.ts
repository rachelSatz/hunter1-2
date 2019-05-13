export class PlanTask {
  id: number;
  is_assigned: boolean;
  assignee: Assignee;
  assigned_at: Date;
  organization_name: string;
  employer_name: string;
  error: Error;

  constructor() {
    this.id = 0;
    this.is_assigned = false;
    this.assignee = new Assignee();
    this.assigned_at = new Date();
    this.organization_name = '';
    this.employer_name = '';
    this.error = new Error();
  }
}

export class Assignee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export class Error {
  id: number;
  message: string;
  organization_name: string;
  employer_name: string;
  process_salary_month: string;
  process_name: string;
  product_name: string;
  sent_file_name: string;
  owner: Owner;
}

export class Owner {
  id: number;
  type: string;
  file_type: string;
  amount: number;
  process_id: number;
  salary_month: string;
  deposit_type: string;
  deposit_status: string;
  salary: number;
  employee_status: string;
  employee_status_start_date: string;
  work_month_percentage: number;
  working_days_in_month: number;
  is_relevant: number;
  policy_or_account_number: string;
  owner_type: string;
}
