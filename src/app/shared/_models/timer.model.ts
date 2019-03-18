export class TaskTimer {
  id: number;
  text: string;
}



export enum TaskTimerLabels  {
  emails = '/platform/operator/work-queue/emails',
  phoneCall = '/platform/operator/work-queue/phone-call',
  guidance = '/platform/operator/work-queue/guidance',
  break = '/platform/operator/work-queue/break',
  ongoingOperation = '/platform/operator/work-queue/ongoing-operation',
  systemTasks = '/platform/operator/work-queue/system-tasks'
}


