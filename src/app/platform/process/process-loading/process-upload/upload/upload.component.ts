import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MONTHS } from 'app/shared/_const/months';
import { Process } from 'app/shared/_models/process.model';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { startWith, switchMap } from 'rxjs/operators';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import { iif, interval, of, Subscription } from 'rxjs';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  animations: [ fade ]
})
export class UploadComponent implements OnInit, OnDestroy {

  sub = new Subscription;
  process_percent = 0;
  public files: any[] = [];
  process = new Process;
  process_details: ProcessDetails;
  fileTypeError = false;
  months = MONTHS;
  inter = <any>interval(5000);
  showError: boolean;
  isError: boolean;
  error: string;

  constructor(@Inject(MAT_DIALOG_DATA)  public data: any,
              public processDataService: ProcessDataService,
              private dialogRef: MatDialogRef<UploadComponent>,
              private processService: ProcessService,
              private notificationService: NotificationService,
              private selectUnit: SelectUnitService,
              private employerService: EmployerService,
              protected route: ActivatedRoute,
              protected router: Router) { }

  ngOnInit() {
    this.process = this.data['process'];
    this.process.file = [];
    const employers = this.selectUnit.getOrganization().find(o => o.id === this.selectUnit.currentOrganizationID).employer;
    this.process.employer_name = employers.find(o => o.id === this.selectUnit.currentEmployerID).name;


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
        case 'error_loading': {
          this.isError = true;
          this.error = this.process_details.error;
          this.process.id = null;
          break;
        }
        case 'can_be_processed': {
          this.process_percent = 100;
          setTimeout(() => {
            this.sub.unsubscribe();
            this.dialogRef.close({'processId' : this.process.id, type: '', 'process_details': response});
          }, 1000);
          break;
        }
        case 'loaded_with_errors': {
          if (this.processDataService.activeProcess !== undefined) {
            this.processDataService.activeProcess.incorrect = true;
            this.processDataService.activeProcess.returnDetails = true;
            this.selectUnit.setProcessData(this.processDataService);
          }
          this.sub.unsubscribe();
          this.dialogRef.close({type: 'incorrect', 'process_details': response});
          break;
        }

      }
    }
  }

  getFileFromDrop(event) {
    if (event.files != null && event.files.length > 0) {
      for (const droppedFile of event.files) {
        if (droppedFile['fileEntry'].isFile) {
          const fileEntry = droppedFile['fileEntry'] as any;
          fileEntry.file((file: File) => this.setFile([file]));
        }
      }
    }
  }

  setFile(files: File[]) {
    this.emptyError();
    for (let i = 0; i < files.length; i++) {
      const ext = files[i].name.substr(files[i].name.lastIndexOf('.') + 1).toLowerCase();
      if (['xml', 'dat', 'xlsx', 'xls'].indexOf(ext) === -1) {
        this.fileTypeError = true;
        break;
      }
      this.fileTypeError = false;
      const type = files[i].name.indexOf('NEG') === -1 ? 'positive' : 'negative';
      if (type !== this.process.type && ['xml', 'dat'].indexOf(ext) !== -1) {
        this.isError = true;
        this.error  = 'הקובץ שהועלה אינו תואם את סוג הקובץ שבחרת ';
        this.process.file = [];
      } else {
        this.process.file.push(files[i]);
      }
    }
  }

  emptyError() {
    this.isError = false;
    this.showError = false;
    this.error = '';
  }

  paymentPopup(): void {
    this.emptyError();
    if (this.process.file != null && this.process.file.length > 0) {
      this.employerService.getIsEmployerFile(this.selectUnit.currentEmployerID).then(response => {
        if (!response.result) {
          this.isError = true;
          this.error  = 'אין למעסיק קובץ יפוי כח וקובץ פרוטוקול הרשאה ';
        } else {
            let text = 'במידה ובוצע תשלום לקופות, הנתונים ילקחו ';
            text += 'מתוך קובץ ה-XML בהתאם לפרטים שהוזנו בתוכנית השכר. ';
            text += 'במידה והתשלום לא בוצע לקופות הנך מועבר לקבלת הנחיית תשלום. ';
            text += 'ניתן יהיה לערוך את פרטי התשלום לפני שידור הנתונים לקופות.';

            const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};

            this.notificationService.warning('האם בוצע תשלום לקופות?', text, buttons).then(confirmation => {
              if (confirmation['dismiss'] === 'cancel' || confirmation.value) {
                const isDirect = !!confirmation.value;
                this.sendFile(isDirect, this.data['fileDeposition']);
              }
            });
        }
      });
    }
  }

  sendFile(isDirect: any, fileDeposition: File): void {
    const data = {
      'month': this.process.month,
      'year': this.process.year,
      'processName':  this.process.name,
      'departmentId': this.selectUnit.currentDepartmentID,
      'type': this.process.type,
      'isDirect': isDirect,
      'processId': '',
      'pageNumber': 1
    };

    this.processService.newProcess(data, this.process.file , fileDeposition ).then(response => {
      if (response['processId']) {
        data['processID'] = response['processId'];
        data['file'] = this.process.file;
        data['monthName'] = this.months[this.process.month - 1];

        this.processDataService.setProcess(data);
        this.selectUnit.setProcessData(this.processDataService);
        // this.selectUnit.setProcessData(data);
        this.process.id = response['processId'];
      }else {
        this.notificationService.error('העלאת הקובץ נכשלה');
      }
    });
  }

  openDialog(): void {
    if (!this.isError) {
      this.dialogRef.close({'processId': this.process.id, type: 'email'});
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  loadNew(): void {
    this.emptyError();
    this.process.id = null;
    this.process.file = [];
    this.processDataService.activeProcess.processID = null;
    this.processDataService.setProcess(this.processDataService.activeProcess);
    this.selectUnit.setProcessData(this.processDataService);
  }

  close(): void {
    this.emptyError();
    if (this.processDataService.activeProcess) {
      this.processDataService.activeProcess.processID = null;
      this.processDataService.setProcess(this.processDataService.activeProcess);
      this.selectUnit.setProcessData(this.processDataService);
    }
    this.sub.unsubscribe();
    this.dialogRef.close({type: 'processID'});
  }


}
