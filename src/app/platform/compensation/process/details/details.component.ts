import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as FileSaver from 'file-saver';
import { AddFileComponent } from '../add-file/add-file.component';

import { CompensationService } from 'app/shared/_services/http/compensation.service';

import { Compensation } from 'app/shared/_models/compensation.model';
import {DataTableHeader} from 'app/shared/data-table/classes/data-table-header';
import {DataTableComponent} from 'app/shared/data-table/data-table.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['../../../../shared/data-table/data-table.component.css'],
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
export class DetailsComponent  extends DataTableComponent implements OnInit, OnDestroy {

  uploadedFile: File [];
  file_count: string[] = [];
  spin: boolean;
  hasServerError: boolean;

  constructor(protected route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public compensation: Compensation,
              private dialogRef: MatDialogRef<DetailsComponent>, private compensationService: CompensationService)  {
            super(route);
    }

    ngOnInit() {
      this.setItems(this.compensation.files);
  }

  readonly headers: DataTableHeader[] =  [
    { column: 'file_name', label: 'שם הקובץ' }, { column: 'file_type', label: 'סוג' },
    { column: 'file_upload', label: 'תאריך העלאה' },
    { column: 'null', label: 'אפשריות' }
  ];


  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      this.file_count = []
      this.compensationService.updateCompensation(this.compensation, this.uploadedFile, this.file_count).then(response => {
        if (response) {
          this.dialogRef.close(this.compensation);
        } else {
          this.hasServerError = true;
        }
      });
    }
  }


  downloadFile(fileName: string, type: string): void {
    this.spin = true;
    this.compensationService.downloadFile(this.compensation.id, fileName).then(response => {
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


  deleteFile(fileName: string): void {
      this.hasServerError = false;
      this.compensationService.deleteFile(this.compensation.id, fileName).then(response => {
        if (response) {
          // console.log(response['file_list'])
          this.compensation.files = response['file_list']
          this.dialogRef.close(this.compensation);
        } else {
          this.hasServerError = true;
        }
      });
  }
}
