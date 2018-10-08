import { Company } from './company.model';

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
