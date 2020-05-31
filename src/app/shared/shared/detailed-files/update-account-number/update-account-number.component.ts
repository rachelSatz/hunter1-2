import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
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


  ref_number: string;

  ngOnInit() {
  }

  submit(): void {
      this.processService.update('refNumber', this.data.ref_number, this.data.file_id, this.data.dataTable )
        .then( response => {
        if (response) {
        this.dialogRef.close();
        }
      });
  }
}
