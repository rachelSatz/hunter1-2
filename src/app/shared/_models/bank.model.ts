import { BankBranch } from './bank-branch.model';

export class Bank {
  id: number;
  text: string;
  number: string;
  name: string;
  branches: BankBranch[];
}
