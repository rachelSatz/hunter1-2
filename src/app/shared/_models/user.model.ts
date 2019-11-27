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
  team_leader: string;
  signature_html: string;
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
      this.team_leader = user.team_leader;
      this.signature_html = user.signature_html;
      this.email = user.email;
      this.units = user.units;
      const modules = user.modules;
      this.modules = Object.keys(ModuleTypes).map(function(e) {
        const ext = modules.filter(m => m.name === e);
        if (user && ext.length > 0) {
          return new UserModule(e, ext[0].permission_type, true);
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

export enum TeamLeader {
  general =  'כללי',
  small_employer_manager = 'רעות',
  big_employer_manager =  'סזי',
}
