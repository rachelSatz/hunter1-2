import { BankBranch } from './bank-branch.model';
import { EmployerBankAccount } from './employer-bank-account.model';
import { Department } from './department.model';

export class Employer {
  id: number;
  name: string;
  payment_type: string;
  business_number: string;
  institution_code_5: string; // instituteCode5: string; // קוד מוסד - 5
  institution_code_8: string; // instituteCode8: string; // קוד מוסד - 8
  deductionNumber: string; // מספר תיק ניכויים
  email: string; // דוא"ל אישי
  phone: string;
  secondaryPhone: string;
  mobile: string;
  fax: string;
  emailReceiving: string; // מייל לקבלת מידע
  emailSending: string; // מייל לשליחת מידע
  address: string;
  employeeCount: number;
  bankBranch: BankBranch;
  typeSent: number; // סוג מזהה לשליחה
  employerCodeSent: string; // מספר מזהה לשליחה
  comments: string;
  bank_accounts: EmployerBankAccount[] = [];
  organizationId: number;
  organization_name: string;
  status: string;
  department: Department[];
  operator;
  identifier_type: string;
  deduction_number: number;
  project_id: number;
  project_name: string;

  constructor() {
    this.bank_accounts.push(new EmployerBankAccount());
    this.bankBranch = new BankBranch;
  }
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

export enum EmployerStatus {
  active = 'מעסיק פעיל',
  inactive = 'מעסיק לא פעיל',
  on_process = 'בהקמה'
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

