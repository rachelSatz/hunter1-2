import { Component, Input, OnInit } from '@angular/core';

import { Process } from '../../../shared/_models/process.model';
import { MatDialog } from '@angular/material';
import { TransmissionIntroFormComponent } from '../process-transmission/transmission-intro-form/transmission-intro-form.component';
import { BankBranch } from "../../../shared/_models/bank-branch.model";
import { GeneralHttpService } from "../../../shared/_services/http/general-http.service";
import { BankAccountEmployerComponent } from "../bank-account-employer/bank-account-employer.component";
import { Employer } from "../../../shared/_models/employer.model";

@Component({
  selector: 'app-process-details',
  templateUrl: './process-details.component.html',
  styleUrls: ['./process-details.component.css']
})
export class ProcessDetailsComponent implements OnInit {
  @Input() process: Process;
  @Input() mode: 'payment' | 'transmission';
  @Input() send: boolean;
  public Employerbank: BankBranch;
  constructor(private dialog: MatDialog, private generalHttp: GeneralHttpService) { }
  ngOnInit() {
   this.getEmployerBankBranch();
  }
  getEmployerBankBranch(){
    this.generalHttp.getEmployerBankBranch(this.process.employer.id,this.process.id).then(response => {
      this.Employerbank = response;
      console.log("Employerbank",this.Employerbank);
      
    });
  }
  public clickOpenBankAccountEmployerDialog(){

       const payDetails: { process: Process, EmployerBankAccount: BankBranch } = { process: this.process , EmployerBankAccount: this.Employerbank };
    const dialog = this.dialog.open(BankAccountEmployerComponent, {

      width: '1000px',
      data: payDetails,


      
    });

    dialog.afterClosed().subscribe(data => {
      console.log("data", data);
      if (data['responseCode'] == 1)
         this.getEmployerBankBranch();
      
    });
  }
  public clickOpenDialog(): void {
    const dialog = this.dialog.open(TransmissionIntroFormComponent, {


      data: this.process,
      disableClose: true
    });

    dialog.afterClosed().subscribe(data => {
      console.log("data", data);
      if (data)
        this.process = data.process;
    });
  }

}
