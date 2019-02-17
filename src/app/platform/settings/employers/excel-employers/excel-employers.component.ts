import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as FileSaver from 'file-saver';

import { HelpersService} from 'app/shared/_services/helpers.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { PlatformComponent } from '../../../platform.component';

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
  exampleFileType = 'xlsx';
  exampleFileName = 'employersExample.xlsx';
  organizations = [];

  constructor(private dialogRef: MatDialogRef<ExcelEmployersComponent>,
              private employerService: EmployerService,
              private compensationService: CompensationService,
              private selectUnit: SelectUnitService,
              private  platform: PlatformComponent,
              private  helpers: HelpersService) { }

  ngOnInit() {
    this.typeDoc = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
  }

  submit(): void {
    if (this.uploadedFile !== undefined ) {
      this.helpers.setPageSpinner(true);
      this.employerService.uploadExcelEmployers(this.uploadedFile, this.selectUnit.currentOrganizationID).then(response => {
        this.helpers.setPageSpinner(false);
        this.message = response['message'];
        if (this.message === undefined) {
          this.message = 'שגיאה';
          const byteCharacters = atob(response.toString());
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
          FileSaver.saveAs(blob, 'שגיאה.xlsx');
        } else {
          this.platform.getOrganizations(true);
          this.dialogRef.close();
        }
      });
    }else {
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
      FileSaver.saveAs(blob, fileName);
    });
  }

}
