import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { ProcessService } from '../../../../shared/_services/http/process.service';
import { TransmissionIntroFormComponent } from '../transmission-intro-form/transmission-intro-form.component';
import { SendFile } from "../../../../shared/_models/send-file.model";
import { NotificationService, NotificationType } from "../../../../shared/_services/notification.service";

@Component({
  selector: 'app-transmission-bank-details',
  templateUrl: './transmission-bank-details.component.html',
  styleUrls: ['./transmission-bank-details.component.css']
})
export class TransmissionBankDetailsComponent implements OnInit {

  public select = 1;
  public bankNumber: number;
  public bankAccountNumber: number;
  public inputAccountNumber: number;
  public accountNumber: any;
  public bankNumbers: any[] = [];
  public Lode: boolean = false;
  public branchNumber: any;
  public bankBranchNumbers: any[] = [];
  public sendfile: SendFile;
  public bankAccountNumbers: any[] = [];
  public checkboxValue: Boolean = false;
  public Send:boolean=false;
  constructor( @Inject(MAT_DIALOG_DATA) public payment: any, public dialogRef: MatDialogRef<TransmissionBankDetailsComponent>,
    private processService: ProcessService, private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    let getSend = sessionStorage.getItem('Send'+ this.payment.process.id);
    console.log("getSendTransmissionBankDetailsComponent", getSend);
   debugger;
    if (getSend && getSend == "true") {
      this.Send = true;
    }
    this.sendfile = this.payment.file;
    if (this.sendfile.kindPay == 1) {

      this.select = 1;
      this.bankNumber = this.sendfile.bankBranch.bank.id;
      this.branchNumber = this.sendfile.bankBranch.id;
      this.accountNumber = this.sendfile.accountNumber;
      this.bankAccountNumber=this.accountNumber;
      this.processService.postCreateBankFrom(this.payment).then(response => {
        this.checkboxValue = response === 1;
        this.processService.postBankNumbers(this.payment,this.checkboxValue)
          .then(response => {
            this.bankNumbers = response;
            console.log("bankNumbers",this.bankNumbers);
            
            this.bankNumbers = this.getParseInt(this.bankNumbers);
            this.processService.postBankBranchNumbers(this.payment, this.bankNumber,this.checkboxValue)
              .then(response =>{ this.bankBranchNumbers = this.getParseInt(response)
                    console.log("bankBranchNumbers",this.bankBranchNumbers);
            
              }).then(response => {
                this.processService.postBankAccountNumbers(this.payment, this.bankNumber, this.branchNumber,this.checkboxValue)
                  .then(response =>{
                      if (this.checkboxValue && response.length > 0) {
                  this.inputAccountNumber = response[0].Text;
                }
                else {
                  this.bankAccountNumbers = response
                }
                  });
              });

          });
      });


    }
    else {
      this.select=2;
      this.processService.postBankNumbers(this.payment)
        .then(response => {

          this.bankNumbers = response;


        })
    }
    setTimeout(function () {
      this.Lode = true;
    }.bind(this), 3000);

  }
  checkValueManualBankAccountNumber() {

    this.processService.postBankNumbers(this.payment, this.checkboxValue)
      .then(response => {
        this.bankNumbers = response;
        this.bankNumbers = this.getParseInt(this.bankNumbers);
        this.processService.postBankBranchNumbers(this.payment, this.bankNumber, this.checkboxValue)
          .then(response => this.bankBranchNumbers = this.getParseInt(response)).then(
          response => {

            this.processService.postBankAccountNumbers(this.payment, this.bankNumber, this.branchNumber,this.checkboxValue)
              .then(response => {
       
                if (this.checkboxValue && response.length > 0) {
                  this.inputAccountNumber = response[0].Text;
             
                }
                else {
                  this.bankAccountNumbers = response
                }

              });

          });

      });
      if(this.checkboxValue){
        this.select=1;
      }
      else{
        this.select=2;
      }

  }
  getParseInt(ArrayList: any[]) {
    ArrayList.forEach(element => {
      element.Value = parseInt(element.Value);
    });
    return ArrayList;
  }
  selectionClickBankNumber(): void {
 
    debugger;
    this.processService.postBankBranchNumbers(this.payment, this.bankNumber, this.checkboxValue)
      .then(response => this.bankBranchNumbers = this.getParseInt(response));
  }

  selectionClickAccountNumber(): void {
    this.processService.postBankAccountNumbers(this.payment, this.bankNumber, this.branchNumber)
      .then(response => this.bankAccountNumbers = this.getParseInt(response));
  }

  sendNewBankDetails(): void {
    if(!this.checkboxValue){
      
    }
    this.processService.postNewBankDetails(this.payment, this.bankNumber, this.branchNumber, this.checkboxValue ? this.inputAccountNumber
      : this.bankAccountNumber, this.select, this.checkboxValue)
      .then(response => {
        if (response['responseCode'] == 1) {
          this.notificationService.showResult(response['message'], NotificationType.success);
          return;
        }
        else if (response['responseCode'] == 0) {
          this.notificationService.showResult(response['message'], NotificationType.error);
        }
        this.dialogRef.close(response);
      });
  }


}
