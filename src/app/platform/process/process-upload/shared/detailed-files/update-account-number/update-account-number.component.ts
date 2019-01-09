import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { GeneralHttpService } from '../../../../../../shared/_services/http/general-http.service';

@Component({
  selector: 'app-update-account-number',
  templateUrl: './update-account-number.component.html'
})
export class UpdateAccountNumberComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: object,
              private generalService: GeneralHttpService) { }

  banks = [];
  branchs = [];
  bankId: number;
  branchId: number;
  number: number;

  ngOnInit() {
    this.generalService.getBanks(true).then(banks => {
      this.banks = banks;
    });
  }

  selectedBankBranch(): void {
    const selectedBank = this.banks.find(bank => {
      return +bank.id === this.bankId;
    });

    this.branchs = selectedBank ? selectedBank.bank_branches : [];
  }

}
