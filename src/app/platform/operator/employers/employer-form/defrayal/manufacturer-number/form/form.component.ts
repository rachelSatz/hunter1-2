import {ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { DepartmentService } from 'app/shared/_services/http/department.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ContactService } from '../../../../../../../shared/_services/http/contact.service';
import {Contact} from '../../../../../../../shared/_models/contact.model';
import {ManufacturerNumberComponent} from '../manufacturer-number.component';
import {DepartmentSerialNumber} from '../../../../../../../shared/_models/employer.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: ['.top { margin-top: -10px}']
})
export class FormComponent implements OnInit {

  constructor(private router: Router,
              public departmentService: DepartmentService,
              public selectUnit: SelectUnitService,
              private fb: FormBuilder,
              private _location: Location,
              private route: ActivatedRoute) { }

  departments = [];
  number: FormGroup;
  employees = [];
  scrollIndex = 1;
  companies = [] ;
  navigate: any;
  manufacturerNumber: DepartmentSerialNumber[] = [];

  ngOnInit() {
    if (this.route.snapshot.data.manufacturerNumber) {
      this.manufacturerNumber = this.route.snapshot.data.manufacturerNumber;
    }
    this.departmentService.getDepartments(this.selectUnit.currentEmployerID)
      .then(response => this.departments = response.items);
    this.companies = this.selectUnit.getCompanies();
    if (this.manufacturerNumber.length > 0 && this.manufacturerNumber !== null) {
      this.initForm(this.manufacturerNumber);
    } else {
      this.initForm();
    }
  }

  initForm(manufacturerNumber?: Object): void {
    this.number = this.fb.group({
      'department_id': [manufacturerNumber ?  manufacturerNumber[0]['department_id'] : null, Validators.required],
      'company_id': [manufacturerNumber ?  manufacturerNumber[0]['company_id'] : null , Validators.required],
      'number': [manufacturerNumber ?  manufacturerNumber[0]['number'] : null,  Validators.required],
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
            this._location.back();
          } else {
            // response.errors
          }
        });
    }
  }


}
