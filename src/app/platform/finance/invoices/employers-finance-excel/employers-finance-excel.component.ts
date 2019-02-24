import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';

import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { InvoiceService } from 'app/shared/_services/http/invoice.service';
import { HelpersService} from 'app/shared/_services/helpers.service';
import { fade } from 'app/shared/_animations/animation';


@Component({
  selector: 'app-employers-finance-excel',
  templateUrl: './employers-finance-excel.component.html',
  animations: [ fade ]
})
export class EmployersFinanceExcelComponent implements OnInit {
  uploadedFile: File;
  files = [];
  typeDoc: string;
  message: string;
  hasServerError: boolean;
  organizationId: number;
  exampleFileType = 'xlsx';
  exampleFileName = 'employersFinanceExample.xlsx';
  constructor(private dialogRef: MatDialogRef<EmployersFinanceExcelComponent>,
              private selectUnit: SelectUnitService,
              private  helpers: HelpersService,
              private invoiceService: InvoiceService) { }

  ngOnInit() {
    this.typeDoc = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
  }

  submit(): void {
    if (this.uploadedFile !== undefined ) {
      this.helpers.setPageSpinner(true);
      this.invoiceService.uploadFinanceExcel(this.uploadedFile).then(response => {
        this.helpers.setPageSpinner(false);
        this.message = response['message'];
        if (this.message  !== 'הצליח') {
          this.hasServerError = true;
        }else {
          this.dialogRef.close();
        }
      });
    }else {
      this.message = 'בחר קובץ';
    }
  }

  downloadExampleFile(fileName: string, type: string): void {
    this.invoiceService.downloadExampleFile(fileName).then(response => {
      const byteCharacters = atob(response['data']);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/' + type});
      FileSaver.saveAs(blob, fileName);
    });
  }
}
