export class Compensation {
  id: number;
  projected_balance: number;
  reported_balance: number;
  comments: string;
  closed_at: string;
  created_at: string;
}

export enum CompensationStatus {
  'V' = 'תקין',
  'E' = 'שגוי',
  'O' = 'פתוח',
  'S' = 'נשלח'
}

export enum CompensationSourceTypes {
  'M' = 'ידני',
  'A' = 'אוטומטי'
}
