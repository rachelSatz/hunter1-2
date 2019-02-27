import {Bank} from './bank.model';
import {BankBranch} from './bank-branch.model';

export class EmployerBankAccount {
  id: number;
  number: string;
  bank: Bank;
  branch: BankBranch;
  is_primary: boolean;
  bank_id: number;
  branch_id: number;
  type: string;
  account_number: string;
  branch_name: string;
  bank_name: string;

  constructor() {
    this.id = 0;
    this.number = '0';
    this.is_primary = false;
    this.type = 'deposit';
  }
}
