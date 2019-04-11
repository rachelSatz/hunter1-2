export class PlanTask {
  id: number;
  is_assigned: boolean;
  assignee: Assignee;
  assigned_at: Date;
  error: Error;
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
  owner: Owner;
}

export class Owner {
  id: number;
  type: string;
  file_type: string;
  amount: number;
  process_id: number;
}
