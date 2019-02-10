import { Employee } from './employee.model';
import { EmployerBankAccount } from './employer-bank-account.model';


export class Department {
  id: number;
  name: string;
  employees: Employee[];
  bank_account_deposit: EmployerBankAccount;
  bank_account_withdrawal: EmployerBankAccount;

  constructor() {
    this.bank_account_deposit = new EmployerBankAccount();
    this.bank_account_withdrawal = new EmployerBankAccount();
  }
}
