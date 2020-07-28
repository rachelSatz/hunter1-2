import { Component, OnInit } from '@angular/core';
import { EmployerComponent } from 'app/employer/employer.component';
import { MONTHS } from 'app/shared/_const/months';
import * as FileSaver from 'file-saver';

import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { SendFileEmailComponent } from 'app/shared/_dialogs/send-file-email/send-file-email.component';
import { ActivatedRoute, Router } from '@angular/router';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-payment-instructions-employer',
  templateUrl: './payment-instructions-employer.component.html',
  styleUrls: ['./payment-instructions-employer.component.css'],
  animations: [ fade ]
})
export class PaymentInstructionsEmployerComponent implements OnInit {

  constructor(public employerComponent: EmployerComponent,
              private dialog: MatDialog,
              public route: ActivatedRoute,
              private router: Router,
              private selectUnit: SelectUnitService,
              public processDataService: ProcessDataService,
              private processService: ProcessService) { }
  months = MONTHS;
  sub = new Subscription;
  is_valid = false;
  showFiles = true;

  ngOnInit() {
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }
  }

  downloadPaymentsInstruction(): void {
     this.processService.downloadPaymentsInstruction(this.employerComponent.process_details.id).then(response => {
       this.is_valid = true;
       response.forEach(function (value) {
         const byteCharacters = atob(value['data']);
         const byteNumbers = new Array(byteCharacters.length);
         for (let i = 0; i < byteCharacters.length; i++) {
           byteNumbers[i] = byteCharacters.charCodeAt(i);
         }
         const byteArray = new Uint8Array(byteNumbers);
         const blob = new Blob([byteArray], {type: 'application/' + value['ext']});
         FileSaver.saveAs(blob, value['filename']);
       });
     });
  }

  openDialogSendFileEmail(): void {
    const dialog = this.dialog.open(SendFileEmailComponent, {
      data: {processId: this.employerComponent.process_details.id ,
        employerId: this.employerComponent.process_details.employer_id},
      width: '450px',
      panelClass: 'send-email-dialog'
    });


    this.sub.add(dialog.afterClosed().subscribe(res => {
      if (res === 'Message_Sent') {
        this.is_valid = true;
      }
    }));

  }

  submit(): void {
    this.employerComponent.setPage(3);
  }

  openRow(): void {
    this.showFiles = false;
    this.router.navigate(['./files'], {relativeTo: this.route});
  }

  previous(): void {
    this.showFiles = true;
    this.router.navigate(['.'], {relativeTo: this.route});
  }



}
