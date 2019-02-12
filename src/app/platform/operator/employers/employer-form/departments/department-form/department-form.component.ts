import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NgForm  } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Department } from 'app/shared/_models/department.model';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { EmployerBankAccount } from 'app/shared/_models/employer-bank-account.model';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';



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
  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private generalService: GeneralHttpService,
              private departmentService: DepartmentService,
              private selectUnit: SelectUnitService) {
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

  // openBankAccountDialog(): void {
  //   this.dialog.open(BankAccountComponent, {
  //     width: '655px',
  //     panelClass: 'dialog-file'
  //   });
  // }

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

  saveChange(form: NgForm) {
    if (form.valid) {
      if (this.department.id) {
        this.departmentService.update(this.department).then(response => {
          if (response) {}});
      } else {
        this.departmentService.create(this.department, this.selectUnit.currentEmployerID).then(response => {
          if (response) {}});
      }
    }
  }
}
