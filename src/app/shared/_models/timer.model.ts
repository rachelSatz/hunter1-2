export class TaskTimer {
  id: number;
  text: string;
  isMinTask: boolean;
}

const TasksTypes = [
  {id: 1, name: 'שיחות טלפון'},
  {id: 2, name: 'מיילים'},
  {id: 3, name: 'תפעול שוטף'},
  {id: 4, name: 'הדרכה'},
  {id: 5, name: 'הפסקה'},
  {id: 6, name: 'משימה'},
  {id: 7, name: 'משימה עצמית'},
];

export enum TaskTimerLabels  {
  emails = '/platform/operator/work-queue/emails',
  phoneCall = '/platform/operator/work-queue/phone-call',
  guidance = '/platform/operator/work-queue/guidance',
  break = '/platform/operator/work-queue/break',
  ongoingOperation = '/platform/operator/work-queue/ongoing-operation',
  systemTasks = '/platform/operator/work-queue/system-tasks',
  task = '/platform/operator/tasks'
}


