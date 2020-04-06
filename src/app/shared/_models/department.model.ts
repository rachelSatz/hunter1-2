import { Employee } from './employee.model';
import { EmployerBankAccount } from './employer-bank-account.model';


export class Department {
  id: number;
  name: string;
  is_split_invoice: boolean;
  employees: Employee[];
  bank_account_deposit: EmployerBankAccount = new EmployerBankAccount;
  bank_account_withdrawal: EmployerBankAccount = new EmployerBankAccount;
}

export class EmailDepartment {
  id: number;
  name: string;
  email: string;
}
