import {Bank} from './bank.model';
import {BankBranch} from './bank-branch.model';

export class EmployerBankAccount {
  id: number;
  number: string;
  bank: Bank;
  branch: BankBranch;
  is_primary: boolean;
}


export class FlatEmployerBankAccount {
  id: number;
  account_number: string;
  bank_number: Bank;
  branch_number: BankBranch;
  is_primary: boolean;
}
