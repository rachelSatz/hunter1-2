import { UserUnitPermission } from './user-unit-permission.model';
import {ModuleTypes, UserModule} from './user-module.model';

export class User {
  id: number;
  username: string;
  password: string;
  name: string;
  first_name: string;
  last_name: string;
  token: string;
  role: string;
  email: string;
  units: UserUnitPermission[] = [];
  modules: UserModule[] = [];
  is_registered: boolean;

  constructor(user: User) {
    this.units.push(new UserUnitPermission());
    if (user) {
      this.id = user.id;
      this.username = user.username;
      this.password = user.password;
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.token = user.token;
      this.role = user.role;
      this.email = user.email;
      this.units = user.units;
      const modules = user.modules;
      this.modules = Object.keys(ModuleTypes).map(function(e) {
        if (user && modules.some(m => m.name === e)) {
          return new UserModule(e, 'all', true);
        }
        return new UserModule(e, 'read', false);
      });
    }else {
      this.modules = Object.keys(ModuleTypes).map(function(e) {
        return new UserModule(e, 'read', false);
      });
    }

  }
}

export enum EntityRoles {
  admin =  'מנהל',
  operator = 'מתפעל',
  employer =  'מעסיק',
}
