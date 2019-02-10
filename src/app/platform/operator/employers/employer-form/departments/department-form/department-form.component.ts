import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { Department } from 'app/shared/_models/department.model';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';


@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css']
})
export class DepartmentFormComponent implements OnInit {

  department = new Department();
  banks = [];
  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private generalService: GeneralHttpService) { }

  ngOnInit() {
    this.loadBanks();
    if (this.route.snapshot.data.department) {
      this.department = this.route.snapshot.data.department;
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

  // selectedBankBranch(): void {
  //
  //   const selectedBank = this.banks.find(bank => {
  //     return +bank.id === +this.department.bank_account_withdrawal;
  //   });
  //
  //   return selectedBank ? selectedBank.bank_branches : [];
  // }
}
