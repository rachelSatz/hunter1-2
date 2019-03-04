import { Company } from './company.model';
import {Bank, BankAccount} from './bank.model';
import {BankBranch} from './bank-branch.model';

export class Product {
  id: number;
  company: Company;
  name: string;
  code: number;
  type: string;
}

export enum ProductType {
  pension = 'פנסיה',
  provident = 'קופת גמל',
  study = 'קרן השתלמות',
  executive = 'ביטוח מנהלים'
}

export class ExtendedProduct {
  id: number;
  name: string;
  code: number;
  type: string;
  company_id: number;
  company_name: string;
  company_code: string;
  bank_account: BankAccount[] = [];

  constructor() {
    this.bank_account.push(new BankAccount());
  }
}
