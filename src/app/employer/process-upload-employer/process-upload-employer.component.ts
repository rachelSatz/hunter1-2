import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { iif, interval, of, Subscription } from 'rxjs';
import { Process } from 'app/shared/_models/process.model';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import { MONTHS } from 'app/shared/_const/months';
import { startWith, switchMap } from 'rxjs/operators';
import { EmailComponent } from 'app/employer/process-upload-employer/email/email.component';
import { EmployerComponent } from 'app/employer/employer.component';



@Component({
  selector: 'app-process-upload-employer',
  templateUrl: './process-upload-employer.component.html',
  styleUrls: ['./process-upload-employer.component.css']
})

export class ProcessUploadEmployerComponent implements OnInit, OnDestroy {

  constructor(private processService: ProcessService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private documentService: DocumentService,
              private notificationService: NotificationService,
              public processDataService: ProcessDataService,
              private helpers: HelpersService,
              private employerComponent: EmployerComponent,
              private selectUnit: SelectUnitService) { }

  sub = new Subscription;
  process_percent = 0;
  public files: any[] = [];
  process = new Process;
  process_details: ProcessDetails;
  fileTypeError = false;
  months = MONTHS;
  inter = <any>interval(5000);


  readonly types = [
    {'id': 'positive', 'name': 'חיובי'},
    {'id': 'negative', 'name': 'שלילי'}
  ];

  ngOnInit() {

    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }

    this.process.file = [];
    this.process.employer_name = 'אא';

    this.sub = this.inter.pipe(
      startWith(0),
      switchMap(() =>
        iif(() => this.process.id !== undefined && this.process.id !== null
          , this.processService.getUploadFile(this.process.id)
          , of(null)
        )
      )).subscribe(response => {
      if (response) {
        this.set_process(response);
      }
    });

  }

  set_process(response): void {
    this.process_details = response;
    if (this.process_details.status !== null) {
      switch (this.process_details.status) {
        case 'loading':
          this.process_percent = this.process_details.percent;
          break;
        case 'error_loading':
        case 'loaded_with_errors': {
          this.sub.unsubscribe();
          this.notificationService.success('', 'הקובץ מועבר לטיפול',
            {showConfirmButton: false, allowOutsideClick: false
            });
          break;
        }
        case 'can_be_processed': {
          this.process_percent = 100;
          setTimeout(() => {
            this.sub.unsubscribe();
            this.employerComponent.process_details = this.process_details;
            this.employerComponent.setPage(2);
          } , 1000);

          break;
        }
      }
    }
  }
  setFile(files: File[]) {
    for (let i = 0; i < files.length; i++) {
      const ext = files[i].name.substr(files[i].name.lastIndexOf('.') + 1).toLowerCase();
      if (['xml', 'dat', 'xlsx', 'xls'].indexOf(ext) === -1) {
        this.fileTypeError = true;
        break;
      }
      this.fileTypeError = false;
      const type = files[i].name.indexOf('NEG') === -1 ? 'positive' : 'negative';
      if (type !== this.process.type && ['xml', 'dat'].indexOf(ext) !== -1) {
        // this.isError = true;
        // this.error  = 'הקובץ שהועלה אינו תואם את סוג הקובץ שבחרת ';
        this.process.file = [];
      } else {
        this.process.file.push(files[i]);
      }
    }
  }


  paymentPopup(): void {
    if (this.process.file != null && this.process.file.length > 0) {
      this.sendFile(false);
    }
  }

  sendFile(isDirect: any): void {
    const data = {
      'month': this.process.month,
      'year': this.process.year,
      'processName':  this.process.name,
      'departmentId': 2,
      'isDirect': isDirect,
      'processId': '',
    };

    this.processService.newProcess(data, this.process.file , null).then(response => {
      if (response['processId']) {
        data['processID'] = response['processId'];
        data['file'] = this.process.file;
        data['monthName'] = this.months[this.process.month - 1];

        this.processDataService.setProcess(data);
        this.selectUnit.setProcessData(this.processDataService);
        if (response['allowed']) {
          this.process.id = response['processId'];
        } else {
          this.notificationService.success(
            'הקובץ נטען בהצלחה', 'נמשיך לעדכנך בפרטים בהמשך התהליך!',
            {allowOutsideClick: false,
            showConfirmButton: false});
        }
      }else {
        this.notificationService.error('העלאת הקובץ נכשלה');
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  openDialog(): void {
    this.processService.getPaymentMailOnCompletion( this.process.id ).then( response => {
      this.dialog.open(EmailComponent, {
        data: response['email_address'],
        width: '550px',
        panelClass: 'email-dialog'
      });
    });
  }

  getFileFromDrop(event) {
    if (event.files != null && event.files.length > 0) {
      for (const droppedFile of event.files) {
        if (droppedFile['fileEntry'].isFile) {
          const fileEntry = droppedFile['fileEntry'] as any;
          fileEntry.file((file: File) =>  this.setFile([file]));
        }
      }
    }
  }
}
