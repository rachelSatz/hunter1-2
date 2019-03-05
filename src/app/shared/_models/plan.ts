import { User } from './user.model';

export class Plan {
  id: number;
  name: string;
  type: PlanType;
  posNeg: string;
  operators: User[];
  startTime: string;
  endTime: string;
  salaryStartDate: string;
  salaryEndDate: string;
  isActive: boolean;
  isEmployerSpecific: boolean;
  taskCategories: PlanTask[];

  constructor() {
    this.type = new PlanType();
    this.operators = [];
    this.taskCategories = [];
  }
}
export class PlanType {
  id: number;
  name: string;
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
