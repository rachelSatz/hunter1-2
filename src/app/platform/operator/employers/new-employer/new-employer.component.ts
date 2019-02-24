import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-new-employer',
  templateUrl: './new-employer.component.html',
  styleUrls: ['./new-employer.component.css'],
  animations: [ fade ]
})
export class NewEmployerComponent implements OnInit {

  banks = [];
  selectedBank1: number;
  selectedBank2: number;
  operators;
  projects = [];
  organizations = [];
  branches1;
  branches2;
  selectedBranch1;
  selectedBranch2;
  newEmployerForm: FormGroup;
  hasServerError = false;
  statuses = [
    {name: 'פעיל',    id: 'active'},
    {name: 'לא פעיל', id: 'inactive'},
    {name: 'בהקמה',   id: 'onProcess'},
  ];


  constructor(private fb: FormBuilder,
              private generalHttpService: GeneralHttpService,
              private router: Router,
              private organizationService: OrganizationService,
              private employerService: EmployerService) { }

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

  getBranches(bank) {
    if (bank === 1) {
      console.log(this.banks[this.selectedBank1])
      this.branches1 = this.banks[this.selectedBank1].bank_branches;
    } else {
      this.branches2 = this.banks[this.selectedBank2].bank_branches;
    }
  }

  getOperator(organizationId) {
    this.employerService.getOperator(organizationId).then(response => {
      this.operators = response;
    });
  }

  submit(form: NgForm): void {
    console.log(this.newEmployerForm.value)
    // this.helpers.setPageSpinner(true);
    // if (this.newEmployerForm.valid) {
    //   this.hasServerError = true;
    //   this.submitFormGroup(this.newEmployerForm.controls['employerDetails']);
    //   this.submitFormGroup(this.newEmployerForm.controls['department']);
    //   this.submitFormGroup(this.newEmployerForm.controls['payingBank']);
    //   this.submitFormGroup(this.newEmployerForm.controls['receivingBank']);
    //   this.router.navigate(['/platform', 'employers']).then();
    // }
    //

  }


  submitFormGroup(subForm) {
   const parsedSubForm = JSON.stringify(subForm.value);
   console.log(parsedSubForm);
  }
}
