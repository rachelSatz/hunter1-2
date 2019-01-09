import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Month } from 'app/shared/_const/month-bd-select';
import { NotificationService } from 'app/shared/_services/notification.service';
import { SelectUnitService} from 'app/shared/_services/select-unit.service';
import { ProcessService } from 'app/shared/_services/http/process.service';

@Component({
  selector: 'app-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.css'],
  providers: [ProcessService, NotificationService],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: 'block',
        opacity: '1'
      })),
      transition('active => inactive', animate('0ms ease-in')),
      transition('inactive => active', animate('300ms ease-in'))
    ])
  ]
})
export class ProcessDataComponent implements OnInit {

  processType = [
    { id: 'negative', name: 'שלילי' },
    { id: 'positive', name: 'חיובי'}
  ]

  selectedType: 'positive' | 'negative';

  pageNumber = 1;
  monthValid = true;
  yearValid = true;
  isSubmitting = false;
  hasServerError: boolean;

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

  constructor(private router: Router, private route: ActivatedRoute,
              private dialog: MatDialog, private processService: ProcessService,
              private notificationService: NotificationService, private selectUnitService: SelectUnitService) {}

  ngOnInit() {
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
          this.processFile = file;
        } else {
          this.processFile = null;
        }
      });
    } else {
      this.processFile = file;
    }
  }

  setPage(index: number, form: NgForm): void {
    switch (this.pageNumber) {
      case 1:
        if (form.value.year && form.value.month) {
          if (this.selectUnitService.currentDepartmentID === undefined) {
            this.notificationService.error('  לא ניתן להעלות קובץ ללא בחירת מחלקה\n' +
              ' אנא בחר מחלקה ונסה שנית\n');
            // return;
          }
          this.pageNumber += index;
        } if (form.value.month) {
          this.monthValid = true;
        } else { this.monthValid = false;
        } if ( form.value.year ) {
          this.yearValid = true;
        } else { this.yearValid = false; }
        break;
        case 2:
          this.hasServerError = false;
          this.pageNumber += index;
      }
  }

  paymentPopup(form: NgForm): void {
    if (form.valid && !this.isSubmitting && this.processFile ) {
      this.isSubmitting = true;
      this.hasServerError = false;

      let text = 'במידה ובוצע תשלום לקופות, הנתונים ילקחו ';
      text += 'מתוך קובץ ה-XML בהתאם לפרטים שהוזנו בתוכנית השכר. ';
      text += 'במידה והתשלום לא בוצע לקופות הנך מועבר לקבלת הנחיית תשלום. ';
      text += 'ניתן יהיה לערוך את פרטי התשלום לפני שידור הנתונים לקופות.';

      const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};

      this.notificationService.warning('האם בוצע תשלום לקופות?', text, buttons).then(confirmation => {
          const data = [this.processFile, form.value, this.selectUnitService.currentDepartmentID, confirmation.value];

          this.processService.newProcess(data).then(response => {
            const processID = response;
            const fileData = [this.months[form.value.month - 1].name, form.value.year, form.value.processName, this.selectedType];
            this.router.navigate(['./payment'], { relativeTo: this.route, queryParams: {fileData}});
            if (response) {
            } else {
              this.hasServerError = true;
            }

            this.isSubmitting = false;
          });
      });
    }
  }

  uploadFile(): void {
    this.router.navigate(['./', 'payment']);

  }
}
