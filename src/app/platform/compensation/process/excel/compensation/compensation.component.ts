import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as FileSaver from 'file-saver';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import {Compensation} from 'app/shared/_models/compensation.model';
import {SelectUnitService} from '../../../../../shared/_services/select-unit.service';


@Component({
  selector: 'app-excel',
  templateUrl: './compensation.component.html',
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
export class ExcelComponent implements OnInit {

  uploadedFile: File;
  files = [];
  typeDoc: string;
  message: string;
  hasServerError: boolean;
  spin: boolean;
  exampleFileType = 'xlsx';
  exampleFileName = 'compensationExample.xlsx';


  constructor(@Inject(MAT_DIALOG_DATA)  public compensation: Compensation,
              private compensationService: CompensationService, private dialogRef: MatDialogRef<ExcelComponent>,
              private selectUnit: SelectUnitService) {

  }

  ngOnInit() {
    this.typeDoc = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
  }

  submit(): void {
    if (this.uploadedFile !== undefined ) {

      this.compensationService.uploadCompensation(this.uploadedFile, this.selectUnit.currentEmployerID).then(response => {
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
