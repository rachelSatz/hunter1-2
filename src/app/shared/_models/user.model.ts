import { UserUnitPermission } from './user-unit-permission.model';
import { ModuleTypes, UserModule } from './user-module.model';
import { ProjectGroup } from './project.model';

export class User {
  id: number;
  password: string;
  first_name: string;
  last_name: string;
  token: string;
  role: string;
  email: string;
  phone: string;
  units: UserUnitPermission[] = [];
  modules: UserModule[] = [];
  is_registered: boolean;
  is_active: boolean;
  project_groups: ProjectGroup[]


  constructor(user: User) {
    this.units.push(new UserUnitPermission());
    if (user) {
      this.id = user.id;
      this.password = user.password;
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.token = user.token;
      this.role = user.role;
      this.email = user.email;
      this.phone = user.phone;
      this.units = user.units;
      this.project_groups = user.project_groups;
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
  employer =  'מעסיק',
}

