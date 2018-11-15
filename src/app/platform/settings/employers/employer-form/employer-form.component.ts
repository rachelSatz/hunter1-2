import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { isNumber } from 'util';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';

import { Employer } from 'app/shared/_models/employer.model';

@Component({
  selector: 'app-employer-form',
  templateUrl: './employer-form.component.html',
  styleUrls: ['./employer-form.component.css'],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        height: '0'
      })),
      state('active', style({
        display: '*',
        height: '*'
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
})
export class EmployerFormComponent implements OnInit {
  hasServerError: boolean;
  employer = new Employer();

  banks = [];
  bankBranches = [];

  employerForm: FormGroup;

  @ViewChild('form') form: NgForm;

  constructor(private route: ActivatedRoute, private router: Router, private employerService: EmployerService
              , private generalService: GeneralHttpService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadBanks();
    this.employer = this.route.snapshot.data.employer ?  this.route.snapshot.data.employer : new Employer;

    this.initForm();
  }

  private initForm(): void {
    this.employerForm = this.fb.group({
      'name': [null, Validators.required],
      'business_number': [null, [Validators.pattern('^\\d{9}$'), Validators.required]],
      'institute_code_5': [null, Validators.pattern('^\\d{5}$')],
      'institute_code_8': [null, Validators.pattern('^\\d{8}$')],
      'phone': [null],
      'mobile': [null],
      'email': [null, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')],
      'fax': [null],
      'address': [null],
      'bank_accounts': this.fb.array([]),
      'comments': [null],

    });

    if (this.employer.id) {
      this.loadEmployerValues();
    } else {
      this.addBank();
    }
  }

  loadEmployerValues(): void {
    this.employerForm.patchValue(this.employer);

    if (this.employer.bank_accounts.length === 0) {
      this.addBank();
    } else {
      this.employer.bank_accounts.forEach(account => {
        this.addBank(account);
      });
    }


    // this.employerForm.get('bank_accounts').patchValue(this.employer.bank_accounts);
  }

  addBank(account?: Object): void {
    const bankControl = {
      'id': [account  ? account['id'] : null],
      'is_primary': [account  ? +account['is_primary'] : false],
      'bank_id': [account  ? account['bank_id'] : null, Validators.required ],
      'branch_id': [account ? account['branch_id'] : null, Validators.required ],
      'number': [account ? account['number'] : null,  [Validators.pattern('^\\d{5}$'), Validators.required]]
    };

    const bankGroup = (<FormArray>this.employerForm.get('bank_accounts'));
    bankGroup.push(this.fb.group(bankControl));
  }

  remove(index: number): void {
    const bankGroup = (<FormArray>this.employerForm.get('bank_accounts'));
    bankGroup.removeAt(index);
  }

  loadBanks(): void {
    this.generalService.getBanks(true).then(banks => {
      this.banks = banks;
      // this.bankBranches.push(this.banks.find(x => x.id == account.bank_id).bank_branches);
      //
      // this.bankBranches = banks[3].bank_branches;
    });
  }

  selectedBankBranch(index: number): void {
    const bankId = (<FormArray>this.employerForm.get('bank_accounts')).controls[index].value['bank_id'];
    if (!bankId) {
      return;
    }
    const selectedBank = this.banks.find(bank => {
      return +bank.id === +bankId;
    });

    return selectedBank ? selectedBank.bank_branches : [];
  }

  primaryBankChecked(index: number, isChecked: boolean): void {
    if (!isChecked) {
      return;
    }

    (<FormArray>this.employerForm.get('bank_accounts')).controls.forEach((account, controlIndex) => {
      if (controlIndex !== index) {
        account['controls']['is_primary'].reset();
      }
    });


    console.log(this.employerForm.value);
  }

  // loadBankBranches(bank: Bank): void {
  //   this.bankBranches = [];
  //   this.generalService.getBankBranches(bank.id).then(types => {this.bankBranches = types; });
  // }

  getArrControls(): any[] {
    return (<FormArray>this.employerForm.get('bank_accounts')).controls;
  }

  submit(isValid: boolean): void {
    this.hasServerError = false;

    if (isValid) {
      if (this.employer.id) {
        this.employerService.updateEmployer(this.employerForm.value, this.employer.id).then(response => this.handleResponse(response));
      } else {
        this.employerService.saveNewEmployer(this.employerForm.value).then(response => this.handleResponse(response));
      }
    }
  }

  private handleResponse(isSaved: boolean): void {
    if (isSaved) {
      this.router.navigate(['platform', 'settings', 'employers']);
    } else {
      this.hasServerError = true;
    }
  }


  hasErrors(controlName: string, options?: {
    touch?: boolean, specificError?: string, arrayPosition?: number, formArrayName?: string
  }): boolean {

    let control = this.employerForm.get(controlName);
    if (options && options.formArrayName && isNumber(options.arrayPosition)) {
      const formArray = <FormArray>this.employerForm.get(options.formArrayName);
      control = formArray.controls[options.arrayPosition].get(controlName);
    }

    let hasErrors = !!control.errors;
    if (options && options.specificError) {
      hasErrors = hasErrors && control.errors[options.specificError];
    }

    let isTriggered = this.form.submitted;
    if (!options || options.touch !== false) {
      isTriggered = (isTriggered || control.touched);
    }

    return (hasErrors && isTriggered);
  }
}
