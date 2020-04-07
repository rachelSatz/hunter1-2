
export class Campaigns {
  id: number;
  status: string;
  amount: number;
  statusSend: string;
  type: CampaignsSubType;

  constructor() {
    this.type = new CampaignsSubType;
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
}

export enum CampaignsFieldStatus {
  full = 'מולא',
  not_full = 'טרם מולא',
}

export enum SentTypeStatus {
  email = 'אמייל',
  sms = 'הודעה',
}
