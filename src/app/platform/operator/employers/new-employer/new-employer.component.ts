import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';

@Component({
  selector: 'app-new-employer',
  templateUrl: './new-employer.component.html',
  styleUrls: ['./new-employer.component.css'],
})
export class NewEmployerComponent implements OnInit {

  banks = [];
  operators;
  projects = [];
  organizations = [];
  branches1;
  branches2;
  newEmployerForm: FormGroup;
  hasServerError = false;
  statuses = [
    {name: 'פעיל',    id: 'active'},
    {name: 'לא פעיל', id: 'inactive'},
    {name: 'בהקמה',   id: 'onProcess'},
  ];


  constructor(private fb: FormBuilder, private generalHttpService: GeneralHttpService,
              private organizationService: OrganizationService, private employerService: EmployerService) { }

  ngOnInit() {
    this.initForm();
    this.generalHttpService.getBanks(true).then(banks => {
      this.banks = banks;
      this.organizationService.getOrganizationsNameAndId().then(response => {
        this.organizations = response;
      });
    });
    this.employerService.getProjects().then(response => this.projects = response);
  }

  initForm(): void {
    this.newEmployerForm = this.fb.group(
      {
        'employerDetails': this.fb.group({
          'organization':      [null, Validators.required],
          'name':              [null, Validators.required],
          'businessNumber':    [null, [Validators.pattern('^\\d{9}$'), Validators.required]],
          'deductionNumber':   [],
          'email':             [null, [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'), Validators.required]],
          'address':           [],
          'phone':             [],
          'project':           [null, Validators.required],
          'operator':          [null, Validators.required],
          'status':            [null, Validators.required],
          'identifierType':    [null, Validators.required],
          'sendingNumber':     [null, [Validators.pattern('^\\d{9}$'), Validators.required]],
          'institutionCode5':  [null, [Validators.pattern('^\\d{5}$'), Validators.required]],
          'institutionCode8':  [null, [Validators.pattern('^\\d{8}$'), Validators.required]],
        }),
        'department': this.fb.group({
          'number': [],
          'name': [null, Validators.required]
        }),
          'payingBank': this.fb.group({
            'name': [null, Validators.required],
            'branch': [null, Validators.required],
            'number': [null, [Validators.pattern('^\\d{5,8}$'), Validators.required]],
          }),
          'receivingBank': this.fb.group({
            'name': [null, Validators.required],
            'branch': [null, Validators.required],
            'number': [null, [Validators.pattern('^\\d{5,8}$'), Validators.required]],
          }),

        'comments':  [],
      }
    );
  }

  getBranches(index, bank) {
    if (bank === 1) {
      this.branches1 = this.banks[index].bank_branches;
    } else {
      this.branches2 = this.banks[index].bank_branches;
    }
  }

  getOperator(organizationId) {
    this.employerService.getOperator(organizationId).then(response => {
      this.operators = response;
    });
  }

  submit(form: NgForm): void {
    this.submitFormGroup(this.newEmployerForm.controls['employerDetails']);
    this.submitFormGroup(this.newEmployerForm.controls['department']);
    this.submitFormGroup(this.newEmployerForm.controls['payingBank']);
    this.submitFormGroup(this.newEmployerForm.controls['receivingBank']);
    const fixed = JSON.stringify(form.value);
  }


  submitFormGroup(subForm) {
   const parsedSubForm = JSON.stringify(subForm.value);
   console.log(parsedSubForm);
  }
}
