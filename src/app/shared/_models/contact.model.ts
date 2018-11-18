export class Contact {
  id: number;
  entity_id: number;
  entity_name: string;
  type: EntityTypes;
  first_name: string;
  last_name: string;
  phone: string;
  mobile: string;
  email: string;
  role: string;
  employer_id : number;
}

export enum EntityTypes {
  agent = 'סוכן',
  company = 'חברה מנהלת'
}
