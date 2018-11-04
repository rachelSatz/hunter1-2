import {Bank} from './bank.model';
import {BankBranch} from './bank-branch.model';

export class EmployerBankAccount {
  id: number;
  number: string;
  bank: Bank;
  branch: BankBranch;
  is_primary: boolean;
}
