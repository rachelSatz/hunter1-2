import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

import { EmployeeService } from '../../../shared/_services/http/employee.service';
import { EmployerService } from '../../../shared/_services/http/employer.service';

import { Employee } from '../../../shared/_models/employee.model';
import { Employer } from '../../../shared/_models/employer.model';
import { DataTableHeader } from '../../../shared/data-table/classes/data-table-header';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class EmployeesComponent extends DataTableComponent implements OnInit {

  readonly headers: DataTableHeader[] = [
    { column: 'employer', label: 'שם מעסיק' }, { column: 'name', label: 'שם מלא' },
    { column: 'identityNumber', label: 'מספר ת"ז' }, { column: 'phone', label: 'טלפון' },
    { column: 'mobile', label: 'נייד' }, { column: 'email', label: 'כתובת מייל' },
    { column: 'address', label: 'כתובת' }
  ];

  selectedEmployer: Employer;
  employers: Employer[] = [];

  constructor(protected route: ActivatedRoute, private dialog: MatDialog, private employeeService: EmployeeService,
              private employerService: EmployerService) {
    super(route);
  }

  ngOnInit() {
    this.employerService.getEmployers().then(response => this.init(response));
  }

  init(response: Employer[]): void {
    this.employers = response;
    this.selectedEmployer = this.employers[0];
    super.ngOnInit();
  }

  fetchItems(): void {
    if (this.searchCriteria['q'] === '') {
      delete this.searchCriteria['q'];
    }

    this.searchCriteria['employerID'] = this.selectedEmployer.id;
    this.employeeService.getEmployees(this.searchCriteria).then(response => this.setItems(response));
  }

  openFormDialog(item?: Employee): void {
    const employee = item ? item : new Employee;

    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '800px',
      data: {
        employee: employee,
        employer: this.selectedEmployer
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!result['id']) {
          this.employeeService.newEmployee(result).then(response => {
            if (response['id']) {
              this.setNewItem(response);
            }
          });
        } else {
          this.employeeService.updateEmployee(result);
        }
      }
    });
  }
}
