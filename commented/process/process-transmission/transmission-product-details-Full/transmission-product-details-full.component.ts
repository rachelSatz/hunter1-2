import { Component, OnInit, Inject } from '@angular/core';
import { details } from "../../../../shared/_models/details.model";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProcessService } from "../../../../shared/_services/http/process.service";
import { productTypeLabel } from "../../../../shared/_const/EnumLabels";
import { FileFeedback } from "../../../../shared/_models/file-feedback.model";


@Component({
  selector: 'app-transmission-product-details-full',
  templateUrl: './transmission-product-details-full.component.html',
  styleUrls: ['./transmission-product-details-full.component.css']
})
export class TransmissionProductDetailsFullComponent implements OnInit {


    details: details[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public fileFeedback:FileFeedback, private processService: ProcessService,
  public dialogRef: MatDialogRef<TransmissionProductDetailsFullComponent>) {}

  ngOnInit() {
    this.processService.getTransmissionFileDetails(this.fileFeedback.id).then(response => this.details = response);
  }
 getproductTypeLabel(key: number): string {
    return productTypeLabel.get(key);
  }
  GetBankNameDetails(){
       if (this.fileFeedback.accountNumber==0){
     return "";
   }
   return  this.fileFeedback.bankBranch.bank.text+"-"+this.fileFeedback.bankBranch.text+"-"+this.fileFeedback.accountNumber;
 }
 GetBankDetails(){
   if (this.fileFeedback.accountNumber==0){
     return "0";
   }
   return  this.fileFeedback.bankBranch.bank.id+"-"+this.fileFeedback.bankBranch.id+"-"+this.fileFeedback.accountNumber;
 }

 onCloseClicked(): void {
   this.dialogRef.close();
 }
}
