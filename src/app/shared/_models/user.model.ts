
export class User {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  token: string;
  role: string;
  email: string;
  module: number;
  permission_type: number;

}

export enum EntityRoles {
  admin =  'מנהל',
  operator = 'מתפעל',
  employer = 'חברה מעסיק',
}
