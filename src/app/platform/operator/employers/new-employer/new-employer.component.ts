import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EmployerStatus, IdentifierTypes } from 'app/shared/_models/employer.model';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { PlatformComponent } from '../../../platform.component';
import { PaymentType } from 'app/shared/_models/process.model';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-new-employer',
  templateUrl: './new-employer.component.html',
  styleUrls: ['./new-employer.component.css'],
  animations: [ fade ]
})
export class NewEmployerComponent implements OnInit {

  banks = [];
  selectedBankD: number;
  selectedBankW: number;
  operators;
  projects = [];
  organizations = [];
  branchesD;
  branchesW;
  selectedBranchD;
  selectedBranchW;
  newOrganization: string;
  newEmployerForm: FormGroup;
  organizationId: number;

  hasServerError = false;
  identifierTypes = Object.keys(IdentifierTypes).map(function(e) {
    return { id: e, name: IdentifierTypes[e] };
  });
  statuses = Object.keys(EmployerStatus).map(function(e) {
    return { id: e, name: EmployerStatus[e] };
  });
  paymentType = Object.keys(PaymentType).map(function(e) {
    return { id: e, name: PaymentType[e] };
  });
  isEdit = false;
  constructor(private fb: FormBuilder,
              private generalHttpService: GeneralHttpService,
              private router: Router,
              private organizationService: OrganizationService,
              private employerService: EmployerService,
              private  helpers: HelpersService,
              private  platformComponent: PlatformComponent) {
    this.organizationId = 0;
  }

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
          'newOrganization': [null],
          'organization': [null],
          'name': [null, Validators.required],
          'businessNumber': [null, [Validators.pattern('^\\d{9}$'), Validators.required]],
          'senderIdentifier': [null, [Validators.pattern('^\\d{9}$'), Validators.required]],
          'deductionNumber': [],
          // 'email': [null, [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'), Validators.required]],
          'address': [],
          'phone': [],
          'project': [null, Validators.required],
          'operator': [null, Validators.required],
          'status': [null, Validators.required],
          'identifierType': [null, Validators.required],
          'sendingNumber': [null, [Validators.pattern('^\\d{9}$'), Validators.required]],
          'paymentType': [null, Validators.required],
          'institutionCode5': [null, [Validators.pattern('^\\d{5}$')]],
          'institutionCode8': [null, [Validators.pattern('^\\d{8}$')]],

        }),
        'department': this.fb.group({
          'name': ['כללי', Validators.required]
        }),
          'payingBank': this.fb.group({
            'name': [null, Validators.required],
            'branchId': [null, Validators.required],
            'accountNumber': [null, [Validators.pattern('^\\d{5,9}$'), Validators.required]],
            'ownerId': [null],
            'ownerType': ['department'],
            'type': ['deposit'],
            'isPrimary': [true]
          }),
          'receivingBank': this.fb.group({
            'name': [null, Validators.required],
            'branchId': [null, Validators.required],
            'accountNumber': [null, [Validators.pattern('^\\d{5,9}$'), Validators.required]],
            'ownerId': [null],
            'ownerType': ['department'],
            'type': ['withdrawal'],
            'isPrimary': [true],
          }),

        'comments':  [''],
      }
    );
  }
  copyBankRow(): void {
    this.selectedBankW = this.selectedBankD;
    this.selectedBranchW = this.selectedBranchD;
    this.getBranches(2);
    const bankGroup = (<FormGroup>this.newEmployerForm.get('payingBank').value);
    this.newEmployerForm.controls['receivingBank'].patchValue({'accountNumber': bankGroup['accountNumber']});
  }

  validCopy(): Boolean {
    const bankGroup = (<FormGroup>this.newEmployerForm.get('payingBank').value);
    return this.selectedBankD > 0 && this.selectedBranchD > 0 && bankGroup['accountNumber'] > 0;
  }

  getBranches(bank) {
    if (bank === 1) {
      this.branchesD = this.banks.find( b => b.id === this.selectedBankD).bank_branches;
    } else {
      this.branchesW = this.banks.find( b => b.id === this.selectedBankW).bank_branches;
    }
  }

  getOperator( organizationId): void {
    this.organizationId = organizationId;
    console.log(this.organizationId );
    this.employerService.getOperator(organizationId, 'organizationId').then(response => {
      this.operators = response;
    });
  }
  getAllOperator() {
    this.employerService.getAllOperators().then(response => {
      this.operators = response;
    });
  }

  enableOrganization(form: NgForm , isEdit: Boolean): void {
    this.isEdit = !isEdit;
    if (isEdit) {
      this.newEmployerForm.controls['employerDetails'].patchValue({'newOrganization': null});
    } else {
        this.newEmployerForm.controls['employerDetails'].patchValue({'organization': null});
        this.organizationId = 0;
        this.getAllOperator();
    }
  }

  submit(form: NgForm): void {
     if (this.newEmployerForm.valid) {
       this.helpers.setPageSpinner(true);
       this.employerService.newEmployer( this.newEmployerForm.controls['employerDetails'].value,
         this.newEmployerForm.controls['department'].value)
         .then(response => {
           if (response) {
             const employerId = response['employer_id'];
             const departmentId = response['department_id'];
             if (employerId === 0) {
               this.helpers.setPageSpinner(false);
               this.hasServerError = true;
             } else {
               this.newEmployerForm.controls['payingBank'].value['ownerId'] = departmentId;
               this.generalHttpService.addNewBankAccount(this.newEmployerForm.controls['payingBank'].value)
                 .then(response => {
                   if (response) {
                     this.newEmployerForm.controls['receivingBank'].value['ownerId'] = departmentId;
                     this.generalHttpService.addNewBankAccount(this.newEmployerForm.controls['receivingBank'].value)
                       .then(response => {
                         if (response) {
                           const comments = this.newEmployerForm.controls['comments'].value;
                           if (comments !== '') {
                             this.generalHttpService.newComment(employerId, this.newEmployerForm.controls['comments'].value, 'employer');
                           }
                           this.platformComponent.getOrganizations(true, true);
                           if (this.router.url.includes( 'operator')) {
                             this.router.navigate(['/platform', 'operator' , 'employers']);
                           }else {
                             this.router.navigate(['/platform', 'employers']);
                           }
                         }
                       });
                   }
                 });
             }
           }
         });
    }
  }
}
