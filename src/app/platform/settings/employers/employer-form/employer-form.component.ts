import {Component, Inject, OnInit} from '@angular/core';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {Employer} from '../../../../shared/_models/employer.model';
import {Bank} from '../../../../shared/_models/bank.model';
import {BankBranch} from '../../../../shared/_models/bank-branch.model';
import {FormArray, FormBuilder,FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {GeneralHttpService} from '../../../../shared/_services/http/general-http.service';



@Component({
  selector: 'app-employer-form',
  templateUrl: './employer-form.component.html',
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
  entityRows = [{}];

  banks = [];
  bankBranches = [];

  employerForm: FormGroup;

  isSubmitted: boolean;

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

    console.log(this.employer);

    // this.employerForm.patchValue(this.employer);
    this.employer.bank_accounts.forEach(account => {
      this.addBank(account);
    });
    // this.employerForm.get('bank_accounts').patchValue(this.employer.bank_accounts);
  }

  addBank(account?: Object): void {
    const bankControl = {
      'id': [account  ? account['id'] : null],
      'is_primary': [account  ? account['is_primary'] : null],
      'bank_id': [account  ? account['bank_id'] : null, Validators.required],
      'branch_id': [account ? account['branch_id'] : null, Validators.required],
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

  // loadBankBranches(bank: Bank): void {
  //   this.bankBranches = [];
  //   this.generalService.getBankBranches(bank.id).then(types => {this.bankBranches = types; });
  // }

  abc() {
    this.employerForm.updateValueAndValidity();
    console.log(this.employerForm)
  }

  getArrControls(): any[] {
    return (<FormArray>this.employerForm.get('bank_accounts')).controls;
  }

  submit(isValid: boolean): void {
    this.hasServerError = false;

    if (true) {
      this.isSubmitted = true;
      if (this.employer.id) {
        this.employerService.updateEmployer(this.employerForm.value, this.employer.id).then(response => this.handleResponse(response));
      } else {
        this.employerService.saveNewEmployer(this.employerForm.value).then(response => this.handleResponse(response));
      }
      this.isSubmitted = false;
    }
  }

  private handleResponse(isSaved: boolean): void {
    if (isSaved) {
      this.router.navigate(['platform', 'settings', 'employers']);
    } else {
      this.hasServerError = true;
    }
  }


  hasError(inputName: string, errorType: string, form?: NgForm, arrayIndex?: number): boolean {
    let isInvalid = false;
    if (this.employerForm.get(inputName)) {
      isInvalid = this.employerForm.get(inputName).errors && this.employerForm.get(inputName).errors[errorType];
    } else {
      const bankControl = <FormArray>this.employerForm.controls.bank_accounts;
      isInvalid = bankControl.controls[arrayIndex].get(inputName).errors &&
        bankControl.controls[arrayIndex].get(inputName).errors[errorType];
    }


    let trigger = false;
    // if (errorType === 'required') {
    //   trigger = this.isSubmitted;
    // } else {
    //   const control = this.employerForm.get(inputName);
    //   trigger = control ? control.touched : (<FormArray>this.employerForm.get('bank_accounts')).controls[arrayIndex].touched;
    // }

    const control = this.employerForm.get(inputName);
    trigger = control ? control.touched : (<FormArray>this.employerForm.get('bank_accounts')).controls[arrayIndex].touched;

    return (isInvalid && trigger);
  }
}
