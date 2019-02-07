import { Employee } from './employee.model';
import { EmployerBankAccount } from './employer-bank-account.model';


export class Department {
  id: number;
  name: string;
  employees: Employee[];
  bank_accounts_deposit: EmployerBankAccount[] = [];
  bank_accounts_withdrawal: EmployerBankAccount[] = [];

  constructor() {
    this.bank_accounts_deposit.push(new EmployerBankAccount());
    this.bank_accounts_withdrawal.push(new EmployerBankAccount());
  }
}
