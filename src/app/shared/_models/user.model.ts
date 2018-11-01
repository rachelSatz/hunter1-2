import { Department } from 'app/shared/_models/department.model';
import { Employer } from 'app/shared/_models/employer.model';
import { Organization } from 'app/shared/_models/organization.model';

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

