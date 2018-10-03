import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { BankBranch } from "../../../shared/_models/bank-branch.model";
import { ProcessService } from "../../../shared/_services/http/process.service";
import { NotificationService, NotificationType } from "../../../shared/_services/notification.service";
import { GeneralHttpService } from "../../../shared/_services/http/general-http.service";
import { Process } from "../../../shared/_models/process.model";
import { Select2OptionData } from "ng2-select2/ng2-select2";

@Component({
  selector: 'app-bank-account-employer',
  templateUrl: './bank-account-employer.component.html',
  styleUrls: ['./bank-account-employer.component.css']
})
export class BankAccountEmployerComponent implements OnInit {
process:Process;
employerBankAccount:BankBranch;
public bankNumber: number;
public branchNumber: number;
public inputAccountNumber: string;
bankBranches: Select2OptionData[] = [];
 banks: Select2OptionData[] = [];
 Lode:boolean=false;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, public dialogRef: MatDialogRef<BankAccountEmployerComponent>,
    private processService: ProcessService,private notificationService: NotificationService, private generalHttp: GeneralHttpService) { 
    this.process=data.process;
    this.employerBankAccount=data.EmployerBankAccount
  }

   ngOnInit() {
  
    
       this.generalHttp.getBanks().then(response => {
      this.banks = response.map( x => <Select2OptionData>{id: String(x.id), text : String(x.id)+"-"+x.text});
      this.banks.unshift({id: '-1', text : 'בחר בנק'});
       if (this.employerBankAccount) {
     this.bankNumber=this.employerBankAccount.bank.id;
   this.branchNumber=this.employerBankAccount.id;
     this.loadBankBranches(this.bankNumber);
     
        this.branchNumber=this.employerBankAccount.id;
        console.log(this.branchNumber);
        
     this.inputAccountNumber=this.employerBankAccount.number;
      }
    
    })
    setTimeout(function () {
      this.Lode = true;
       
    }.bind(this), 3000);

  }
  UpdateBankAccountEmployer(){

    if(!this.inputAccountNumber||this.bankNumber==-1||this.branchNumber==-1){
         this.notificationService.showResult("עליך למלא פרטי חשבון", "error");
    }
     this.employerBankAccount.bank.id=this.bankNumber;
     this.employerBankAccount.id=this.branchNumber;
     this.employerBankAccount.number=this.inputAccountNumber;   
         this.processService.UpdateEmployerBankBranchProcess(this.employerBankAccount, this.process.id)
        .then(response => setTimeout(() => {
        if (response['responseCode'] == 1) {
          this.notificationService.showResult(response['message'], NotificationType.success);
           this.dialogRef.close(response);
          return;
        }
        else if (response['responseCode'] == 0) {
          this.notificationService.showResult(response['message'], NotificationType.error);
               this.dialogRef.close(response);
        }}, 2000));
  }

  setBank(index: string): void {
     if(index === '-1') {
       this.branchNumber=0;
     }
    if(index !== '-1') {
     this.bankNumber=Number(index);
      this.branchNumber = 0;
      this.loadBankBranches(Number(index));
    }
  }
   loadBankBranches(bankID: number): void {
    if (bankID) {
      this.generalHttp.getBankBranches(bankID).then(response => {
      this.bankBranches = response.map( x => <Select2OptionData>{id: String(x.id), text : String(x.id)+"-"+x.text});
      this.bankBranches.unshift({id: '-1', text : 'בחר סניף'});
      });
    }
  }
setBankBranch(index: string): void {
  console.log("setBankBranch");
  
    if(index === '-1') {
      this.branchNumber = 0;

    } else {
      this.branchNumber = Number(index);
    }
  }
}
