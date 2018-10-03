import { Company } from './company.model';


export class Product {
  id: number;
  name: string;
  manufacturer: Company;
  type: string;
}

export enum ProductType {
  pension = 'פנסיה',
  provident = 'קופת גמל',
  study = 'קרן השתלמות',
  executive = 'ביטוח מנהלים'
}
