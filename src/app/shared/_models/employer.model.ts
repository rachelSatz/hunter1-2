export class Employer {
  id: number;
  name: string;
  identifier: string;
  is_active: boolean;
  status: string;
  phone: string;
  constructor() {

  }

}
export enum EmployerStatus {
  active = 'מעסיק פעיל',
  inactive = 'מעסיק לא פעיל',
  on_process = 'בהקמה',
  moved_association = 'הועבר לשיוך מנהל תיק',
}
