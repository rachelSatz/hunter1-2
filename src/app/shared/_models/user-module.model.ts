export class UserModule {
  name: string;
  permission_type: 'read' | 'all';
  isEnabled: boolean;

  constructor(name: string, permission_type: any, isEnabled: boolean) {
    this.name = name;
    this.permission_type = permission_type;
    this.isEnabled = isEnabled;
  }
}

export enum ModuleTypes {
  user_management = 'משתמשים',
  finance = 'פיננסים',
  clients = 'לקוחות'
}
