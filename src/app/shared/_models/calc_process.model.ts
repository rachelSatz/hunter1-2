import {Project} from './project.model';

export class Employee {
  id: number;
  count_employers: number;
  count_employees: number;
  amount_invoices: number;
  project: Project;

  constructor() {
    this.id = 0;
    this.project = new Project();
  }
}
