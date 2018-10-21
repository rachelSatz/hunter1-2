import {Component, Inject, OnInit} from '@angular/core';
import {Select2OptionData} from 'ng2-select2';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { EmployerService } from 'app/shared/_services/http/employer.service';

@Component({
  selector: 'app-employer-form',
  templateUrl: './employer-form.component.html'
})
export class EmployerFormComponent implements OnInit {

  isSubmitting: boolean;
  isSuccessful: boolean;

  employerIdUpdateMode = -1;

  typeSentOptions: {Key: string , Value: number}[];

  bankBranches = [];
  bankBranchSelected = '-1';

  banks = [];
  bankSelected = '-1';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<EmployerFormComponent>,
              private employerService: EmployerService) {}
  ngOnInit() {
    this.employerService.getBanks().then(response => this.banks = response);
  }

  loadBankBranches(bankID: number): void {
    this.employerService.getBankBranches(bankID).then(types => {
      for (const i in types) {
        if (types[i] !== null) {
          this.bankBranches.push({ id: types[i], name: [types[i]] });
        }
      }
    });
  }

  // if (this.employer.bankBranch.id !== 0) {
  // this.bankBranchSelected = String(this.employer.bankBranch.id);
  // }

}
