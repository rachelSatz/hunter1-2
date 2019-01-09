import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as FileSaver from 'file-saver';

import { HelpersService} from 'app/shared/_services/helpers.service';
import { CompensationService } from 'app/shared/_services/http/compensation.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: '*',
        opacity: '1'
      })),
      transition('active => inactive', animate('0ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
})
export class EmployeesComponent implements OnInit {

  uploadedFile: File;
  files = [];
  typeDoc: string;
  message: string;
  hasServerError: boolean;
  departmentId: number;
  exampleFileType = 'xlsx';
  exampleFileName = 'employeesExample.xlsx';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<EmployeesComponent>,
              private compensationService: CompensationService,
              private  helpers: HelpersService) { }

  ngOnInit() {
    this.typeDoc = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
  }

  submit(): void {
    this.hasServerError = false;
    if (this.uploadedFile) {
      this.helpers.setPageSpinner(true);
      this.compensationService.uploadExcelEmployees(this.uploadedFile, this.departmentId).then(response => {
        this.helpers.setPageSpinner(false);
        this.message = response['message'];
        if (this.message  !== 'הצליח') {
          if (this.message === undefined) {
            this.message = 'שגיאה';
          }
          this.hasServerError = true;
        }else { this.dialogRef.close(); }
      });
    }else {
      this.hasServerError = true;
      this.message = 'בחר קובץ';
    }
  }

  downloadExampleFile(fileName: string, type: string): void {
    this.compensationService.downloadExampleFile(fileName).then(response => {
      const byteCharacters = atob(response);
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
