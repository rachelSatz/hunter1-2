export class PlanTask {
  id: number;
  organization_name: string;
  employer_name: string;
  task: Task;

  constructor() {
    this.id = 0;
    this.task = new Task();
  }
}

export class Task {
  id: number;
  message: string;
  additional_info: string;
  record: Record;
  file: File;
  process: Process;
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
  total: number;
  type: string;
  status: string;

}




