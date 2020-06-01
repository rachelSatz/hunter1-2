import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { InvoiceService } from 'app/shared/_services/http/invoice.service';
import { fade } from 'app/shared/_animations/animation';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { NotificationService} from '../../../../shared/_services/notification.service';
import { MatDialogRef} from '@angular/material';
import * as FileSaver from 'file-saver';
import { HelpersService } from 'app/shared/_services/helpers.service';

@Component({
  selector: 'app-proactive-invoice-form',
  templateUrl: './proactive-invoice-form.component.html',
  styles: ['#styleFormat { height: 200px; padding-top: 20px }', '::ng-deep .mat-dialog-container {overflow: visible;}'],
  animations: [ fade ]
})
export class ProactiveInvoiceFormComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  employers: any;
  message: string;
  invoice: string;
  hasServerError = false;
  spin: boolean;

  constructor( private helpers: HelpersService,
               private route: ActivatedRoute,
               private router: Router,
               private invoiceService: InvoiceService,
              private employerService: EmployerService,  private selectUnit: SelectUnitService,
              private notificationService: NotificationService,
              private dialogRef: MatDialogRef<ProactiveInvoiceFormComponent>) { }

  ngOnInit() {
    this.employerService.getAllPayEmployers().then(
      response =>  {
        this.employers = response;
        this.employers.push({'id': '0', 'name': 'כלל המעסיקים'});
        this.employers.sort((a, b) => a.id - b.id);
      });
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      this.helpers.setPageSpinner(true);
      this.invoiceService.createInvoice(form.value).then(response => {
        this.helpers.setPageSpinner(false);
        if (response != null) {
          this.message = response['message'];
          if (response['message'] === 'excel') {
            if (response['blob'] !== '') {
              this.downloadExcel(response['blob']);
            } else {
              this.notificationService.info('אירעה שגיאה בהורדת קובץ האקסל');
            }
          } else if (response['message'] === 'success') {
            this.notificationService.success('נשמר בהצלחה.');
            // this.dialogRef.close();
          } else {
            this.message = response['error']['message'];
            this.notificationService.error( this.message);
          }
          } else {
            this.notificationService.error('');
        }

      });
    }
  }

  downloadExcel(blob_res: string): void {
    this.spin = true;
    const fileName = 'סיכום יצירת חשבוניות';
    const byteCharacters = atob(blob_res['data']);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
    FileSaver.saveAs(blob, fileName + '' + '.xlsx');
    this.spin = false;
  }
}
