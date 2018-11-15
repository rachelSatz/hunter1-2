import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as FileSaver from 'file-saver';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';

@Component({
  selector: 'app-excel-employers-dialog',
  templateUrl: './excel-employers.component.html',
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
export class ExcelEmployersComponent implements OnInit {

  uploadedFile: File;
  files = [];
  typeDoc: string;
  message: string;
  hasServerError: boolean;
  organizationId: number;
  spin: boolean;
  exampleFileType = 'xlsx';
  exampleFileName = 'employersExample.xlsx';
  organizations = [];

  constructor(private dialogRef: MatDialogRef<ExcelEmployersComponent>,
              private employerService: EmployerService, private compensationService: CompensationService,
              private  organizationService: OrganizationService) { }

  ngOnInit() {
    this.organizationService.getOrganizations().then(response => this.organizations = response);
    this.typeDoc = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
  }

  submit(): void {
    if (this.uploadedFile !== undefined ) {
      this.employerService.uploadExcelEmployers(this.uploadedFile, this.organizationId).then(response => {
        this.message = response['message'];
        if (this.message  !== 'הצליח') {
          if (this.message === undefined) {
            this.message = 'שגיאה';
          }
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
    this.spin = true;
    this.compensationService.downloadExampleFile(fileName).then(response => {
      const byteCharacters = atob(response);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/' + type});
      FileSaver.saveAs(blob, fileName);
      this.spin = false;
    });
  }

}
