import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { NotificationService } from 'app/shared/_services/notification.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { Month } from 'app/shared/_const/month-bd-select';
import { Process } from 'app/shared/_models/process.model';
import { FileDepositionComponent } from './file-deposition/file-deposition.component';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.css'],
  providers: [ProcessService, NotificationService],
  animations: [ fade ]
})
export class ProcessDataComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput: ElementRef;
  sub = new Subscription;
  selectedType: 'positive' | 'negative';
  pageNumber = 1;
  monthValid = true;
  yearValid = true;
  isSubmitting = false;
  hasServerError: boolean;

  process: Process;

  readonly months = Month;

  readonly years = [
    {'id': 2016, 'name': '2016'},
    {'id': 2017, 'name': '2017'},
    {'id': 2018, 'name': '2018'},
    {'id': 2019, 'name': '2019'}
  ];

  public files: any[] = [];
  spin: boolean ;
  processFile: File;
  fileTypeError = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private processService: ProcessService,
              private notificationService: NotificationService,
              private selectUnitService: SelectUnitService,
              public processDataService: ProcessDataService) {}

  ngOnInit() {

    if (this.route.snapshot.params.status === '0') {
        this.processDataService.activeProcess = null;
    }

    if (this.route.snapshot.params.status === '2') {
      this.processDataService.activeProcess = new Process();
      this.processDataService.activeProcess.type = 'negative';
    }

    this.process = this.processDataService.activeProcess ?  this.processDataService.activeProcess : new Process();
  }

  getFileFromDrop(event) {
    if (event.files != null && event.files.length > 0) {
      for (const droppedFile of event.files) {
        if (droppedFile['fileEntry'].isFile) {
          const fileEntry = droppedFile['fileEntry'] as any;
          fileEntry.file((file: File) => this.setFile(file));
        }
      }
    }
  }

  setFile(file: File) {
    const ext = file.name.substr(file.name.indexOf('.') + 1);
    if (['xml', 'dat'].indexOf(ext.toLowerCase()) === -1) {
      this.fileTypeError = true;
      return;
    }
    this.fileTypeError = false;
    const type = file.name.indexOf('NEG') === -1 ? 'positive' : 'negative';
    if (type !== this.selectedType) {
      this.notificationService.warning('הקובץ שהועלה אינו תואם את סוג הקובץ שבחרת', 'האם תרצה לשנות את סוג התהליך?').then(confirmation => {
        if (confirmation.value) {
          this.selectedType = this.selectedType === 'positive' ? 'negative' : 'positive';
          this.process.type = this.selectedType;
          this.processFile = file;
        } else {
          this.processFile = null;
          this.fileInput.nativeElement.value = null;
        }
      });
    } else {
      this.processFile = file;
    }
  }

  setPage(index: number, form: NgForm): void {
    switch (this.pageNumber) {
      case 1:
        this.selectedType = form.value.type;
        if ( this.selectedType ) {
          this.process.type = this.selectedType;
        }

        if (form.value.year && form.value.month) {

          if (this.selectUnitService.currentDepartmentID === undefined ||
            this.selectUnitService.currentDepartmentID === 0) {
            this.notificationService.error('  לא ניתן להעלות קובץ ללא בחירת מחלקה\n' +
              ' אנא בחר מחלקה ונסה שנית\n');
              return;
          }
          this.pageNumber += index;
        }
        this.monthValid = !!form.value.month;
        this.yearValid = !!form.value.year;
        break;
        case 2:
          this.hasServerError = false;
          this.pageNumber += index;
        }
      }

  paymentPopup(form: NgForm): void {
    if (form.valid && !this.isSubmitting && ( this.processFile || this.process.file )) {
      this.isSubmitting = true;
      this.hasServerError = false;

      if (this.selectedType === 'positive') {
        let text = 'במידה ובוצע תשלום לקופות, הנתונים ילקחו ';
        text += 'מתוך קובץ ה-XML בהתאם לפרטים שהוזנו בתוכנית השכר. ';
        text += 'במידה והתשלום לא בוצע לקופות הנך מועבר לקבלת הנחיית תשלום. ';
        text += 'ניתן יהיה לערוך את פרטי התשלום לפני שידור הנתונים לקופות.';

        const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};

        this.notificationService.warning('האם בוצע תשלום לקופות?', text, buttons).then(confirmation => {
          if (confirmation['dismiss'] === 'cancel' || confirmation.value) {
            const isDirect = !!confirmation.value;
            this.sendFile(isDirect, form, null);
          } else {
            this.isSubmitting = false;
          }
        });
      }else {
        const dialog = this.dialog.open(FileDepositionComponent, {
          width: '550px',
          panelClass: 'send-email-dialog'
        });

        this.sub.add(dialog.afterClosed().subscribe(res => {
          this.sendFile( null, form, res);
        }));
      }
    }
    }

  sendFile(isDirect: any, form: NgForm, fileDeposition: File): void {
     const data = {
       'month': this.months[form.value.month - 1].id,
       'year': form.value['year'],
       'processName': form.value['processName'],
       'departmentId': this.selectUnitService.currentDepartmentID,
       'type': this.selectedType,
       'isDirect': isDirect,
       'processId': '',
       'pageNumber': 1
     };

      this.processService.newProcess(data,
        this.route.snapshot.params.status === '1' ? this.process.file : this.processFile , fileDeposition ).then(response => {
        if (response['processId']) {
          data['processId'] = response['processId'];
          data['file'] = this.route.snapshot.params.status === '1' ? this.process.file : this.processFile;
          data['monthName'] = this.months[form.value.month - 1].name;

          this.processDataService.setProcess(data);

          this.router.navigate(['./payment', response['processId']], {relativeTo: this.route});
          if (response['processId'] > 0) {
          } else {
            this.hasServerError = true;
          }
          this.isSubmitting = false;
        }else {
          this.isSubmitting = false;
          this.notificationService.error('העלאת הקובץ נכשלה');
        }
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

