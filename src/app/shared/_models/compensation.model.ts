export class Compensation {
  id: number;
  projected_balance: number;
  reported_balance: number;
  comments: string;
  closed_at: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  employer_id: string;
  portal_balance: number;
  has_by_safebox: boolean;
}

export enum CompensationStatus {
  'open' = 'פתוח',
  'sent' = 'נשלח',
  'feedback_a' = 'התקבל פידבק א',
  'feedback_b' = 'התקבל פידבק ב',
  'closed' = 'סגור'
}

export enum CompensationSendingMethods {
  'email' = 'מייל',
  'safebox' = 'כספת'
}


