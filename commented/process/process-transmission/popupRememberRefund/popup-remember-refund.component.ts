import { Component, OnInit, Inject } from '@angular/core';
import { ProcessService } from "../../../../shared/_services/http/process.service";
import { Process } from "../../../../shared/_models/process.model";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-popup-remember-refund',
  templateUrl: './popup-remember-refund.component.html',
  styleUrls: ['./popup-remember-refund.component.css']
})
export class PopupRememberRefundComponent implements OnInit {
process:Process;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private processService: ProcessService,
              public dialogRef: MatDialogRef<PopupRememberRefundComponent>,private router: Router) {

                 this.process = data.fileUplode;
               }

  ngOnInit() {
    console.log("process",this.process);
  }
  sendHomePage() {
    
    this.router.navigate(['dashboard'])
    this.dialogRef.close();

  }
  sendUplodePage() {

         this.router.navigate(['process/new/upload'], { queryParams: {
      employer: this.process.employer.id,
      year: this.process.year,
      month: this.process.month,
      Neg:true,
    }
    });
   this.dialogRef.close();
  }
}
