import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';
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

  sub = new Subscription;
  pageNumber = 1;

  isSubmitting = false;
  hasServerError: boolean;

  readonly month = Month;

  readonly year = [
    {'id': 2016, 'name': '2016'},
    {'id': 2017, 'name': '2017'},
    {'id': 2018, 'name': '2018'},
    {'id': 2019, 'name': '2019'}
  ];

  public files: any[] = [];
  spin: boolean ;
  processFile: File;
  fileTypeError = false;

  constructor(private router: Router, private dialog: MatDialog,
              private processService: ProcessService, private notificationService: NotificationService,
              private selectUnitService: SelectUnitService) {}

  ngOnInit() {
    console.log('your problem is different woman');

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
    if (this.fileTypeError) {
      this.fileTypeError = false;
    }
    this.processFile = file;
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
        }
        break;
        case 2:
          this.hasServerError = false;
          this.pageNumber += index;
  }
  }

  paymentPopup(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.hasServerError = false;

      let text = 'במידה ובוצע תשלום לקופות, הנתונים ילקחו ';
      text += 'מתוך קובץ ה-XML בהתאם לפרטים שהוזנו בתוכנית השכר. ';
      text += 'במידה והתשלום לא בוצע לקופות הנך מועבר לקבלת הנחיית תשלום. ';
      text += 'ניתן יהיה לערוך את פרטי התשלום לפני שידור הנתונים לקופות.';

      const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};

      this.notificationService.warning('האם בוצע תשלום לקופות?', text, buttons).then(confirmation => {
        if (confirmation.value) {
          console.log(confirmation.value);
          const data = [form.value, this.selectUnitService.currentDepartmentID, confirmation.value];
          this.processService.newProcess(data).then(response => {
            console.log(data);
            this.router.navigate(['upload']);
            if (response) {
            } else {
              this.hasServerError = true;
            }

            this.isSubmitting = false;
          });
        } else {
          this.isSubmitting = false;
        }
      });
    }
  }

  uploadFile(): void {
    this.router.navigate(['./', 'payment']);
  }



  next(index, form: NgForm) {
   if (form.value.year && form.value.month) {
     this.pageNumber += index;
   }
   if (index === -1) {
     this.pageNumber = 1;
   }
    if (form.value.year && form.value.month) {
      this.pageNumber += index;
    }
  }
}

