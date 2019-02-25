import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {Component, Inject, OnInit} from '@angular/core';
import * as FileSaver from 'file-saver';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { Compensation } from 'app/shared/_models/compensation.model';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-request-deposits-report',
  templateUrl: './request-deposits-report.component.html',
  animations: [ fade ]
})
export class RequestDepositsReportComponent implements OnInit {

  uploadedFile: File;
  files = [];
  typeDoc: string;
  message: string;
  hasServerError: boolean;
  exampleFileType = 'xlsx';
  exampleFileName = 'compensationExample.xlsx';

  constructor(@Inject(MAT_DIALOG_DATA)  public compensation: Compensation,
              private compensationService: CompensationService,
              private dialogRef: MatDialogRef<RequestDepositsReportComponent>,
              private selectUnit: SelectUnitService,
              private  helpers: HelpersService) {}

  ngOnInit() {
    this.typeDoc = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
  }

  submit(): void {
    if (this.uploadedFile) {
      this.helpers.setPageSpinner(true);
      this.compensationService.uploadCompensation(this.uploadedFile, this.selectUnit.currentEmployerID, 'dep').then(response => {
        this.helpers.setPageSpinner(false);
        this.message = response['message'];
        if (this.message  !== 'הצליח') {
          if (this.message === undefined) {
            this.message = 'שגיאה';
            const byteCharacters = atob(response['data']);
            if (byteCharacters !== '') {
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
              FileSaver.saveAs(blob, 'שגיאה.xlsx');
            }
          }
          this.hasServerError = true;
        }else {
          this.dialogRef.close();
        }
      });

    }else {
      this.hasServerError = true;
      this.message = 'בחר קובץ';
    }
  }

  downloadExampleFile(fileName: string, type: string): void {
    this.compensationService.downloadExampleFile(fileName).then(response => {
      const byteCharacters = atob(response['data']);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/' + type});
      FileSaver.saveAs(blob, 'deposits-report.' + type);
    });
  }
}
