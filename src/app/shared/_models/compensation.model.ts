export class Compensation {
  id: number;
  projected_balance: number;
  reported_balance: number;
  comments: string;
  closed_at: string;
  created_at: string;
  company_id: string;
  employer_id: string;
  portal_balance: number;
}

export enum CompensationStatus {
  'valid' = 'תקין',
  'invalid' = 'שגוי',
  'open' = 'פתוח',
  'sent' = 'נשלח'
}

export enum CompensationSendingMethods {
  'email' = 'מייל',
  'safebox' = 'כספת'
}


