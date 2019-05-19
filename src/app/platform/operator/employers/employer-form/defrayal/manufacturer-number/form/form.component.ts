import { Component, OnInit } from '@angular/core';

import { DepartmentService } from 'app/shared/_services/http/department.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: ['.top { margin-top: -10px}']
})
export class FormComponent implements OnInit {

  constructor(private router: Router,
              public departmentService: DepartmentService,
              public selectUnit: SelectUnitService,
              private fb: FormBuilder) { }

  departments = [];
  number: FormGroup;
  employees = [];
  scrollIndex = 1;
  companies = [] ;
  navigate: any;
  location: string;

  ngOnInit() {
    if (this.router.url.includes( 'employers')) {
      this.navigate = ['platform', 'employers',
        'form', this.selectUnit.currentEmployerID, 'number'];
      this.location = 'employers';
    } else if (this.router.url.includes( 'operator')) {
      this.location = 'operator';
      this.navigate = ['platform', 'operator', 'number'];
    } else {
      this.navigate = ['platform', 'number'];
      this.location = 'settings';
    }


    this.departmentService.getDepartments(this.selectUnit.currentEmployerID)
      .then(response => this.departments = response.items);
    this.companies = this.selectUnit.getCompanies();
    this.initForm();
  }

  initForm(): void {
    this.number = this.fb.group({
      'department_id': [null , Validators.required],
      'company_id': [null , Validators.required],
      'number': [null,  Validators.required],
      'employee_id': []
    });
  }

  checkLoadEmployees(scrollY: number): void {
    if (scrollY >= 3700 * this.scrollIndex) {
      this.scrollIndex++;
      this.loadEmployees();
    }
  }

  loadEmployees(val?: string): void {
    this.departmentService.getEmployees(this.number.value.department_id, val, this.scrollIndex)
      .then(response => {
        if (!val) {
          this.employees = [...this.employees, ...response];
        } else {
          this.employees = response;
        }
      });
  }

  filter(event: any, name: string) {
    if (name === 'employee') {
      this.scrollIndex = 1;
      this.loadEmployees(event);
    }
  }

  submit(form: NgForm) {
    if (form.valid) {
      let value = this.number.value;
      if (this.number.value['employee_id'] === null) {
        value = { 'department_id' : this.number.value['department_id'] ,
          'company_id' : this.number.value['company_id'] ,
          'number' : this.number.value['number']};
      }
      this.departmentService.addSNInCompanies(value)
        .then(response => {
          if (response.result) {
            this.router.navigate(this.navigate);
          } else {
            // response.errors
          }
        });
    }
  }


}
