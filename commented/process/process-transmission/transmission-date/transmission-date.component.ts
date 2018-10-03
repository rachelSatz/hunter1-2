import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ProcessService } from '../../../../shared/_services/http/process.service';

@Component({
  selector: 'app-transmission-date',
  templateUrl: './transmission-date.component.html',
  styleUrls: ['./transmission-date.component.css']
})
export class TransmissionDateComponent implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) public payment: any, private processService: ProcessService,
              public dialogRef: MatDialogRef<TransmissionDateComponent>) { }
public Send:boolean=false;
  date: string;
ngOnInit(){
      let getSend = sessionStorage.getItem('Send'+this.payment.process.id);
   console.log("getSendTransmissionDateComponent", getSend);

    if (getSend && getSend == "true") {
      this.Send = true;
    }
}

  submit(isValid: boolean): void {
    if (isValid) {
      this.processService.postNewDateDetails(this.payment, this.date)
      .then(response => this.dialogRef.close(response));
    }
  }

}
