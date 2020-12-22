import { Project } from './project.model';
import { Organization } from './organization';

export class CalcProcess {
  id: number;
  count_employers: number;
  count_employees: number;
  amount_invoices: number;
  projector: Organization;
  project: Project;

  constructor() {
    this.id = 0;
    this.project = new Project();
    this.projector = new Organization();
  }
}
