import { BankBranch } from './bank-branch.model';

export class Bank {
  id: number;
  text: string;
  number: string;
  name: string;
  branches: BankBranch[];
}


export class BankAccount {
  id: number;
  number: string;
  bank: Bank;
  branch: BankBranch;
  is_primary: boolean;
  bank_id: number;
  branch_id: number;
  type: string;
  account_number: string;
  branch_number: string;
  bank_number: string;
  branch_name: string;
  bank_name: string;


  constructor() {
    this.id = 0;
    this.account_number = '0';
    this.is_primary = false;
    this.type = 'deposit';
  }
}
