import { Employee } from './employee.model';
import { EmployerBankAccount } from './employer-bank-account.model';


export class Department {
  id: number;
  name: string;
  employees: Employee[];
  bank_account_deposit: EmployerBankAccount = new EmployerBankAccount;
  bank_account_withdrawal: EmployerBankAccount = new EmployerBankAccount;
}
