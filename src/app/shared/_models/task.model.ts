
export class TaskModel {
  id: number;
  created_at: string;
  subject: string;
  description: string;
  status: string;
  due_date: string;
  employer_name: string;
  employer_id: number;
  reporter_name: string;
  reporter_id: number;
  assignee_name: string;
  assignee_id: number;
}
