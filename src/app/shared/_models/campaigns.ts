export class TaskCampaign {
  details: Campaign;
  timings: Timings;
  groups: Group;
  constructor() {
    this.details = new Campaign();
    this.timings = new Timings();
    this.groups = new Group();
  }
}

export class Group {
  groups: number[];
  isCheckAll: boolean;

  constructor() {
    this.groups = [0];
    this.isCheckAll = false;
  }
}

export class Campaign {
  id: number;
  typeTask: number;
  name: string;
  amount: number;
  statusSend: string;
  dateModule: string;
  status: CampaignsFieldStatus;
  moduleType: CampaignsType;
  moduleName: CampaignsSubType;

  constructor() {
    this.moduleType = new CampaignsType;
    this.moduleName = new CampaignsSubType;
  }
}

export class CampaignsSubType {
  id: number;
  subtype: string;
  type: CampaignsType;

  constructor() {
    this.type = new CampaignsType();
  }
}

export class CampaignsType {
  id: number;
  type: string;
}

export enum CampaignsStatus {
  done = 'הסתיים',
  in_process = 'בתהליך',
  no_active = 'לא פעיל',
}

export enum CampaignsFieldStatus {
  full = 'מולא',
  not_full = 'טרם מולא',
}


export enum SentTypeStatus {
  operator_email = 'מייל מנהל תיק',
  email = 'אמייל',
  sms = 'הודעה',
}

export class Timings {
  isSchedule: boolean;
  skipHolidays: boolean;
  sendNow: boolean;
  sendAt: SendAtArray[];
  schedules: Schedules[];
  end: End;

  constructor() {
    this.end = new End();
    this.sendAt = [];
    this.schedules = [];
  }
}

export class SendAtArray {
   date: string;
   hour: string;
}

export class Schedules {
  days: string;
  hour: string;
}

export class End {
  type: string;
  date: string;
  counter: number;
}
