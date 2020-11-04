import {Component, OnInit, ViewChild} from '@angular/core';
import {fade} from '../../../../shared/_animations/animation';
import {DataTableComponent} from '../../../../shared/data-table/data-table.component';
import {ActivatedRoute,Router} from '@angular/router';
import {NotificationService} from '../../../../shared/_services/notification.service';
import {MatDialogRef} from '@angular/material';
import {HelpersService} from '../../../../shared/_services/helpers.service';
import {DatePipe} from '@angular/common';
import {NgForm} from '@angular/forms';
import * as FileSaver from 'file-saver';
import {InvoiceService} from '../../../../shared/_services/http/invoice.service';

@Component({
  selector: 'app-reports-form',
  templateUrl: './reports-form.component.html',
  styleUrls: ['./reports-form.component.css'],
  styles: ['#styleFormat { height: 200px; padding-top: 20px }', '::ng-deep .mat-dialog-container {overflow: visible;}'],
  animations: [ fade ]
})
export class ReportsFormComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  selectedReport: string;
  reports: string[] = ['מעסיקים ללא הגדרות פיננסיות', 'מעסיקים ללא תשלום', 'מעסיקים שלא הופקה להם חשבונית עבור חודש'];
  hasServerError = false;
  message: string;
  spin: boolean;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService,
              private dialogRef: MatDialogRef<ReportsFormComponent>,
              private helpers: HelpersService,
              public datePipe: DatePipe,
              private invoiceService: InvoiceService) { }

  ngOnInit() {
  }
  submit(form: NgForm): void {
    this.hasServerError = false;
    form.value['for_month'] = this.datePipe.transform(form.value['for_month'], 'yyyy-MM-dd');
    this.invoiceService.getInvoiceReport(form.value, this.selectedReport).then(response => {
      if (response['message']['data']) {
        const byteCharacters = atob(response['message']['data']);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
        const fileName = response['date'] + '.xlsx';
        FileSaver.saveAs(blob, fileName);
        this.spin = false;
        this.notificationService.success('הקובץ הופק בהצלחה');
      } else if (response['message'] === 'error') {
        this.notificationService.info('ארעה שגיאה');
      } else if (response['message'] === 'no_data') {
        this.notificationService.info('לא נמצאו נתונים');
      } else {
        this.notificationService.error('לא ניתן להפיק את הדו"ח');

      }
    });
  }
}
