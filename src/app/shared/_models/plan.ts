import { User } from './user.model';

export class Plan {
  id: number;
  type: string;
  sub_type: string;
  name: string;
  salary_start_date: string;
  salary_end_date: string;
  start_time: string;
  end_time: string;
  operators: User[];
  isActive: boolean;
  taskCategories: TaskType[];

  constructor() {
    // this.type = new PlanType();
    this.operators = [];
    this.taskCategories = [];
  }
}
export class PlanType {
  id: number;
  name: string;
}
export class TaskType {
  id: string;
  name: string;
}

export enum PlanTypeLabel {
  repayments = 'מרתון פרעונות',
  payments = 'גבייה',
  handle_errors = 'טיפול בשגויים'
}

export enum PlanCategoryLabel {
  record_level = 'רמת רשומה',
  file_level = 'רמת קובץ',
  file_max_amount = 'סכום גבוה בקובץ',
  file_min_amount = 'סכום נמוך בקובץ',
  employees_max_amount = 'מספר עובדים גבוה',
  employees_min_amount = 'מספר עובדים נמוך'
}

export class PlanTask {
  category: TimerType;
  priority: number;
  amount: number;

  constructor() {
    this.amount = 1;
  }
}

export class TimerType {
  id: number;
  name: string;
  color: string;
}

export enum TimerTypeLabels {
  phones = 'שיחות טלפון',
  mails = 'מיילים',
  operations = 'תפעול שוטף',
  guidance = 'הדרכה',
  break = 'הפסקה',
}

export const TIMESTAMPS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
];
