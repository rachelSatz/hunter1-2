import { BankBranch } from './bank-branch.model';

export class Employer {
  id: number;
  name: string;
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
  bankAccountNumber: string;
  typeSent: number; // סוג מזהה לשליחה
  employerCodeSent: string; // מספר מזהה לשליחה
  comments: string;

  constructor() {
    this.bankBranch = new BankBranch;
  }
}

