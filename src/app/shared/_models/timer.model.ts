export class TaskTimer {
  id: number;
  path: string;
}



export enum TaskTimerLabels  {
  emails = '/platform/operator/work-queue/emails',
  phoneCall = '/platform/operator/work-queue/phone-call',
  guidance = '/platform/operator/work-queue/guidance',
  interruption = '/platform/operator/work-queue/interruption',
  ongoingOperation = '/platform/operator/work-queue/ongoing-operation',
  systemTasks = '/platform/operator/work-queue/system-tasks'
}


