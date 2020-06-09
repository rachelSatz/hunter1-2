import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Month } from 'app/shared/_const/month-bd-select';
import { Process } from 'app/shared/_models/process.model';
import { UploadComponent } from 'app/platform/process/process-loading/process-upload/upload/upload.component';
import { FileDepositionComponent } from 'app/shared/_dialogs/file-deposition/file-deposition.component';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { EmailComponent } from 'app/platform/process/process-loading/process-upload/email/email.component';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { ProcessLoadingComponent } from 'app/platform/process/process-loading/process-loading.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { IncorrectRowsComponent } from 'app/platform/process/process-loading/process-upload/incorrect-rows/incorrect-rows.component';
import { HelpersService } from 'app/shared/_services/helpers.service';

@Component({
  selector: 'app-process-upload',
  templateUrl: './process-upload.component.html',
  styleUrls: ['./process-upload.component.css']
})
export class ProcessUploadComponent implements OnInit, OnDestroy {

  constructor(private processService: ProcessService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private documentService: DocumentService,
              private notificationService: NotificationService,
              public processDataService: ProcessDataService,
              public processLoading: ProcessLoadingComponent,
              private helpers: HelpersService, private selectUnit: SelectUnitService) { }

  process = new Process;
  sub = new Subscription;

  readonly months = Month;
  year = new Date().getFullYear();
  readonly years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];

  readonly types = [
    {'id': 'positive', 'name': 'חיובי'},
    {'id': 'negative', 'name': 'שלילי'}
  ];

  ngOnInit() {
    this.process = this.processDataService.activeProcess ?  this.processDataService.activeProcess : new Process();
    if (this.route.snapshot.params.status === 'create') {
      this.processDataService.setProcess(new Process());
      this.processLoading.process_details = undefined;
    } else {
        this.process.id = this.processDataService.activeProcess.processID;
      // pass
        this.helpers.setPageSpinner(true);
        this.processService.getUploadFile(this.process.id).subscribe(response =>
          this.set_process(response)
        );
    }
  }

  set_process(response): void {
    const process_details = response;
    this.helpers.setPageSpinner(false);
    if (process_details.status !== null) {
      switch (process_details.status) {
        case 'loading':
        case 'error_loading':
          this.popUpload();
          break;
        case 'loaded_with_errors': {
          this.openIncorrectRows(process_details);
          break;
        }
      }
    }
  }

  openUpload(form: NgForm): void {
    if (form.valid) {
      if (this.process.type !== 'positive') {
        this.documentService.getIsNegativeFile(this.selectUnit.currentEmployerID).then(res => {
          if (!res) {
            this.openAddFile();
          } else {
            this.popUpload();
          }
        });
      } else {
        this.popUpload();
      }
    }
  }

  popUpload(fileDeposition?): void {
    if (this.selectUnit.currentDepartmentID === undefined ||
      this.selectUnit.currentDepartmentID === 0) {
      this.notificationService.error('  לא ניתן להעלות קובץ ללא בחירת מעסיק ומחלקה\n' +
        ' אנא בחר מחלקה ונסה שנית\n');
      return;
    }

    const dialog = this.dialog.open(UploadComponent, {
      data: { 'process': this.process, 'fileDeposition': fileDeposition},
      width: '630.6px',
      height: '492.6px',
      panelClass: 'form-dialog',
      disableClose: true
    });

    this.sub.add(dialog.afterClosed().subscribe(res => {
      if (res) {
        if (res['type'] === 'email') {
          this.processService.getPaymentMailOnCompletion( res['processId']).then( response => {
            this.dialog.open(EmailComponent, {
              data: response['email_address'],
              width: '550px',
              panelClass: 'email-dialog'
            });
          });
        } else if (res['type'] === 'processID') {
          this.process.id = null;
        } else if (res['type'] === 'incorrect') {
          this.openIncorrectRows(res['process_details']);
        } else {
          this.processLoading.process_details = res['process_details'];
          this.processLoading.setPage(2, true);
        }
      }
    }));
  }

  openIncorrectRows(process_details): void {
    this.processLoading.process_details = process_details;
    const dialog = this.dialog.open(IncorrectRowsComponent, {
      data:  process_details,
      width: '550px',
      disableClose: true,
      panelClass: 'email-dialog'

    });

    this.sub.add(dialog.afterClosed().subscribe(res => {
      this.processDataService.activeProcess.incorrect = false;
      this.processDataService.setProcess(this.processDataService.activeProcess);
      this.selectUnit.setProcessData(this.processDataService);
      this.processLoading.setPage(2, true);
    }));
  }

  openAddFile(): void {
    const dialog = this.dialog.open(FileDepositionComponent, {
      width: '550px',
      panelClass: 'deposition-dialog',
      disableClose: true
    });

    this.sub.add(dialog.afterClosed().subscribe(file_deposition => {
       this.popUpload(file_deposition);
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
