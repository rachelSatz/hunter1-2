import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { CompensationService } from 'app/shared/_services/http/compensation.service';;
import {Compensation} from '../../../../shared/_models/compensation.model';


@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
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

  constructor(@Inject(MAT_DIALOG_DATA) public compensation: Compensation,
              private compensationService: CompensationService, private dialogRef: MatDialogRef<ExcelComponent>) { }

  ngOnInit() {
    this.typeDoc = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
  }

  submit(): void {
    if (this.uploadedFile !== undefined ) {

      this.compensationService.uploadCompensation(this.uploadedFile).then(response => {
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
}
