import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm  } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';

import { Department } from 'app/shared/_models/department.model';
import { EmployerBankAccount } from 'app/shared/_models/employer-bank-account.model';


@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css'],
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
export class DepartmentFormComponent implements OnInit {

  department = new Department();
  banks = [];
  isEdit = false;
  isEditWithdrawal= false;
  bankBranchesDeposit = [];
  bankBranchesWithdrawal = [];
  hasServerError: boolean;

  constructor(
              private route: ActivatedRoute,
              private generalService: GeneralHttpService,
              private departmentService: DepartmentService,
              private selectUnit: SelectUnitService,
              private router: Router) {
  }

  ngOnInit() {
    this.loadBanks();
    if (this.route.snapshot.data.department) {
      this.department = this.route.snapshot.data.department;
      if (this.department.bank_account_deposit == null) {
        this.department.bank_account_deposit = new EmployerBankAccount;
      }
      if (this.department.bank_account_withdrawal == null) {
        this.department.bank_account_withdrawal = new EmployerBankAccount;
        this.department.bank_account_withdrawal.type = 'Withdrawal';
      }
    }
  }

  loadBanks(): void {
    this.generalService.getBanks(true).then(banks => {
      this.banks = banks;
    });
  }

  selectedBankBranch(val?: string): void {
    const  bankId = val === 'Withdrawal' ? this.department.bank_account_withdrawal.bank_id :
      this.department.bank_account_deposit.bank_id;
    const  branchId = val === 'Withdrawal' ? this.department.bank_account_withdrawal.branch_id :
      this.department.bank_account_deposit.branch_id;

    const selectedBank = this.banks.find(bank => {
      return +bank.id === +bankId;
    });

    if (!selectedBank.bank_branches.find( b => {
      return +b.id === +branchId; })) {
      if (val === 'Withdrawal') {
        this.department.bank_account_withdrawal.branch_id = 0;
      } else {
        this.department.bank_account_deposit.branch_id = 0;
      }
    }
    if (val === 'Withdrawal') {
      this.bankBranchesWithdrawal = selectedBank ? selectedBank.bank_branches : [];
    } else {
      this.bankBranchesDeposit = selectedBank ? selectedBank.bank_branches : [];
    }
  }

  submit(form: NgForm): void {
    if (form.valid) {
      if (this.department.id) {
        this.departmentService.update(this.department)
          .then(response => this.handleResponse(response));
      } else {
        this.departmentService.create(this.department, this.selectUnit.currentEmployerID)
          .then(response => this.handleResponse(response));
      }
    }
  }

  private handleResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['platform', 'operator', 'employers',
        'form', this.selectUnit.currentEmployerID, 'departments']);
    } else {
      this.hasServerError = true;
    }
  }

}
