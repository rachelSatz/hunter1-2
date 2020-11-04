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
export class Operator {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  name: string;

  constructor() {
    this.id = 0;
  }
}
export enum IdentifierTypes {
  private_company = 'ח.פ',
  public_company = 'ח"צ',
  id = 'ת.ז',
  passport = 'דרכון',
  licenced_practitioner = 'עוסק מורשה',
  voluntary_association = 'עמותה',
  cooperative_association = 'אגודה שיתופית',
  govermental_company = ' חברה ממשלתית',
  cooperation = 'איגוד',
  partnership = 'שותפות',
  licence_holder = 'מספר בעל רישיון',
  entity_without_registrar = 'יישות ללא רשם',
}


export class DepartmentSerialNumber {
  id: number;
  number: string;
  company_id: number;
  department_id: number;
  employees: any;
}


