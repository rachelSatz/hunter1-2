import { UserUnitPermission } from './user-unit-permission.model';

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
  unit_permissions: UserUnitPermission[] = [];

  constructor() {
    this.unit_permissions.push(new UserUnitPermission());
  }
}


export enum EntityRoles {
  admin =  'מנהל',
  operator = 'מתפעל',
  employer =  'מעסיק',
}
