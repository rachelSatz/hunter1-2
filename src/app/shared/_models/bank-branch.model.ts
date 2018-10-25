import { Bank } from './bank.model';

export class BankBranch {
  id: number;
  text: string;
  number: string;
  bank: Bank;
  differentAccounts: boolean=false;
  name: string;
  constructor() {
    this.bank = new Bank;
  }
}
