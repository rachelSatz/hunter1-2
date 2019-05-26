import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { NgForm } from '@angular/forms';
import { ProcessService } from 'app/shared/_services/http/process.service';


@Component({
  selector: 'app-update-account-number',
  templateUrl: './update-account-number.component.html'
})
export class UpdateAccountNumberComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private generalService: GeneralHttpService,
              private processService: ProcessService,
              private dialogRef: MatDialogRef<UpdateAccountNumberComponent>) { }


  // banks = [];
  // branchs = [];
  // bankId: number;
  // branchId: number;
  number: number;
  ref_number: string;

  ngOnInit() {
    // this.generalService.getBanks(true).then(banks => {
    //   this.banks = banks;
    // });
  }

  // selectedBankBranch(): void {
  //   const selectedBank = this.banks.find(bank => {
  //     return +bank.id === this.bankId;
  //   });
  //
  //   this.branchs = selectedBank ? selectedBank.bank_branches : [];
  // }

  submit(form: NgForm): void {
      this.processService.update('refNumber', this.data.ref_number, this.data.file_id).then( response => {
        if (response) {
        this.dialogRef.close();
        }
      });
  }
}
